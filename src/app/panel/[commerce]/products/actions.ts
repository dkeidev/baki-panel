"use server";

import { createClient } from "@lib/supabase/server";
import { revalidatePath } from "next/cache";

async function uploadImageToSupabase(file: File): Promise<string> {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("baki-media")
    .upload(filePath, file);

  if (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("baki-media").getPublicUrl(filePath);

  return publicUrl;
}

// ==========================================
// CATEGORIES ACTIONS
// ==========================================
export async function addCategory(commerceId: string, name: string, commerceSlug: string) {
  const cleanName = name?.trim();
  if (!cleanName) return { error: "El nombre de la categoría es obligatorio." };

  const supabase = await createClient();

  // Enforce plan limits - Free plan cannot have categories
  const { data: commerce } = await supabase
    .from("commerces")
    .select("profile_id")
    .eq("id", commerceId)
    .single();

  if (commerce) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan_type")
      .eq("commerce_id", commerceId)
      .maybeSingle();

    if (!sub || sub.plan_type === "free") {
      return { error: "Las categorías requieren suscripción al Plan Lite o superior." };
    }
  }

  const { error } = await supabase.from("categories").insert({
    commerce_id: commerceId,
    name: cleanName
  });

  if (error) {
    console.error("Error creating category:", error);
    if (error.code === "23505") {
      return { error: "Ya existe una categoría con ese nombre." };
    }
    return { error: "No se pudo crear la categoría. Inténtalo de nuevo." };
  }

  revalidatePath(`/panel/${commerceSlug}/products`);
  return { success: true };
}

export async function deleteCategory(categoryId: string, commerceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error);
    return { error: "No se pudo eliminar la categoría." };
  }

  revalidatePath(`/panel/${commerceSlug}/products`);
  return { success: true };
}

// ==========================================
// PRODUCTS ACTIONS
// ==========================================
export async function addProduct(
  commerceId: string,
  _prevState: any,
  formData: FormData,
) {
  const name = (formData.get("name") as string)?.trim();
  const priceInput = (formData.get("price") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const stockInput = (formData.get("stock") as string)?.trim();
  const imageFile = formData.get("image") as File | null;
  const categoryId = formData.get("categoryId") as string | null;

  if (!name) return { error: "El nombre es obligatorio." };
  if (!priceInput) return { error: "El precio es obligatorio." };

  const price = parseFloat(priceInput);
  if (Number.isNaN(price) || price < 0) {
    return { error: "El precio debe ser un número válido mayor o igual a 0." };
  }

  const stock = stockInput ? parseInt(stockInput, 10) : null;
  if (stock !== null && (Number.isNaN(stock) || stock < 0)) {
    return { error: "El stock debe ser un número válido mayor o igual a 0." };
  }

  const supabase = await createClient();

  // Enforce plan limits
  // Free: up to 100 registered products total
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("commerce_id", commerceId)
    .eq("is_deleted", false);

  if (countError) {
    return { error: "Error al validar límites de inventario." };
  }

  if (count !== null && count >= 100) {
    return { error: "Límite del plan gratuito alcanzado (Máx 100 productos)." };
  }

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImageToSupabase(imageFile);
    } catch (uploadError: any) {
      return { error: uploadError.message };
    }
  }

  const { error } = await supabase.from("products").insert({
    commerce_id: commerceId,
    name,
    price,
    description,
    stock,
    image_url: imageUrl || null,
    category_id: categoryId || null,
    is_active: true,
  });

  if (error) {
    console.error("Error inserting product:", error);
    return { error: "No se pudo crear el producto. Inténtalo de nuevo." };
  }

  revalidatePath("/panel/[commerce]/products", "page");
  return { success: true };
}

export async function editProduct(
  productId: string,
  commerceSlug: string,
  _prevState: any,
  formData: FormData,
) {
  const name = (formData.get("name") as string)?.trim();
  const priceInput = (formData.get("price") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const stockInput = (formData.get("stock") as string)?.trim();
  const imageFile = formData.get("image") as File | null;
  const currentImageUrl = (formData.get("currentImageUrl") as string) || "";
  const categoryId = formData.get("categoryId") as string | null;

  if (!name) return { error: "El nombre es obligatorio." };
  if (!priceInput) return { error: "El precio es obligatorio." };

  const price = parseFloat(priceInput);
  if (Number.isNaN(price) || price < 0) {
    return { error: "El precio debe ser un número válido mayor o igual a 0." };
  }

  const stock = stockInput ? parseInt(stockInput, 10) : null;
  if (stock !== null && (Number.isNaN(stock) || stock < 0)) {
    return { error: "El stock debe ser un número válido mayor o igual a 0." };
  }

  const supabase = await createClient();

  let imageUrl = currentImageUrl;
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImageToSupabase(imageFile);
    } catch (uploadError: any) {
      return { error: uploadError.message };
    }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      price,
      description,
      stock,
      image_url: imageUrl || null,
      category_id: categoryId || null,
    })
    .eq("id", productId);

  if (error) {
    console.error("Error updating product:", error);
    return { error: "No se pudo actualizar el producto. Inténtalo de nuevo." };
  }

  revalidatePath(`/panel/${commerceSlug}/products`);
  return { success: true };
}

export async function toggleProductVisibility(
  productId: string,
  commerceSlug: string,
  isActive: boolean,
) {
  const supabase = await createClient();

  // Enforce free limit: max 20 active products
  if (isActive) {
    const { data: product } = await supabase
      .from("products")
      .select("commerce_id")
      .eq("id", productId)
      .single();

    if (product) {
      const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("commerce_id", product.commerce_id)
        .eq("is_active", true)
        .eq("is_deleted", false);

      if (count !== null && count >= 20) {
        throw new Error(
          "Límite de 20 productos activos alcanzado en plan gratis.",
        );
      }
    }
  }

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (error) {
    throw new Error("No se pudo cambiar la visibilidad del producto.");
  }

  revalidatePath(`/panel/${commerceSlug}/products`);
}

export async function deleteProduct(productId: string, commerceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_deleted: true, is_active: false })
    .eq("id", productId);

  if (error) {
    throw new Error("No se pudo eliminar el producto.");
  }

  revalidatePath(`/panel/${commerceSlug}/products`);
}
