"use server";

import { createClient } from "@lib/supabase/server";
import { revalidatePath } from "next/cache";

async function uploadProofToSupabase(file: File): Promise<string> {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `proofs/${fileName}`;

  const { error } = await supabase.storage
    .from("baki-media")
    .upload(filePath, file);

  if (error) {
    throw new Error(`Error subiendo comprobante: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("baki-media").getPublicUrl(filePath);

  return publicUrl;
}

export async function updateOrderStatus(orderId: string, status: string, commerceSlug: string) {
  const supabase = await createClient();

  // 1. Fetch current order status to avoid double cancellations/restorations
  const { data: currentOrder, error: fetchErr } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchErr || !currentOrder) {
    return { error: "No se pudo recuperar la información del pedido." };
  }

  if (currentOrder.status === "cancelled") {
    return { error: "El pedido ya está cancelado." };
  }

  // 2. Perform status update
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { error: "No se pudo actualizar el estado del pedido." };
  }

  // 3. If transitioning to cancelled, restore the stock of products in the order
  if (status === "cancelled") {
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (items) {
      for (const item of items) {
        if (item.product_id) {
          const { data: prod } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();

          if (prod && prod.stock !== null) {
            const newStock = prod.stock + item.quantity;
            await supabase
              .from("products")
              .update({ stock: newStock })
              .eq("id", item.product_id);
          }
        }
      }
    }
  }

  revalidatePath(`/panel/${commerceSlug}/orders`);
  return { success: true };
}

export async function uploadPaymentProofAction(
  orderId: string,
  commerceSlug: string,
  _prevState: any,
  formData: FormData
) {
  const file = formData.get("payment_proof") as File | null;

  if (!file || file.size === 0) {
    return { error: "Por favor selecciona un archivo válido." };
  }

  try {
    const publicUrl = await uploadProofToSupabase(file);
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({ 
        payment_proof_url: publicUrl,
        status: "paid", // Opcionalmente marcamos como pagado al subir comprobante
        payment_verified_at: new Date().toISOString()
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error saving payment proof URL:", error);
      return { error: "No se pudo guardar el comprobante en el pedido." };
    }

    revalidatePath(`/panel/${commerceSlug}/orders`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Error al subir el comprobante." };
  }
}

export async function createManualOrder(
  commerceId: string,
  commerceSlug: string,
  customerName: string,
  customerWhatsapp: string,
  customerAddress: string,
  paymentMethod: string,
  productId: string,
  quantity: number
) {
  const supabase = await createClient();

  // 1. Fetch product price and current stock
  const { data: product, error: prodError } = await supabase
    .from("products")
    .select("name, price, stock")
    .eq("id", productId)
    .single();

  if (prodError || !product) {
    return { error: "No se pudo encontrar el producto seleccionado." };
  }

  // 2. Validate stock
  if (product.stock !== null && quantity > product.stock) {
    return { error: `Stock insuficiente. Solo quedan ${product.stock} unidades de ${product.name}.` };
  }

  const totalAmount = Number(product.price) * quantity;

  // 3. Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      commerce_id: commerceId,
      customer_name: customerName,
      customer_whatsapp: customerWhatsapp,
      customer_address: customerAddress || null,
      total_amount: totalAmount,
      currency: "PEN",
      status: "pending",
      payment_method: paymentMethod,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Error creating manual order:", orderError);
    return { error: "No se pudo crear el pedido en la base de datos." };
  }

  // 4. Insert order item
  const { error: itemError } = await supabase
    .from("order_items")
    .insert({
      order_id: order.id,
      product_id: productId,
      quantity,
      price_at_purchase: product.price,
    });

  if (itemError) {
    console.error("Error creating manual order item:", itemError);
    return { error: "No se pudo registrar los detalles del pedido." };
  }

  // 5. Update stock if limited
  if (product.stock !== null) {
    const newStock = product.stock - quantity;
    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", productId);

    if (stockError) {
      console.error("Error updating stock on manual order:", stockError);
    }
  }

  revalidatePath(`/panel/${commerceSlug}/orders`);
  return { success: true };
}
