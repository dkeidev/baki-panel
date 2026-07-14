import { createClient } from "@lib/supabase/server";
import { redirect } from "next/navigation";
import OrdersClient from "./_components/OrdersClient";

interface PageProps {
  params: Promise<{
    commerce: string;
  }>;
}

export default async function OrdersPage({ params }: PageProps) {
  const { commerce: commerceSlug } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch commerce and check ownership
  const { data: commerce, error: commerceError } = await supabase
    .from("commerces")
    .select("*")
    .eq("slug", commerceSlug)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (commerceError || !commerce) {
    redirect("/");
  }

  // Fetch all orders for this commerce along with items and product details
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price_at_purchase,
        products (
          id,
          name,
          image_url
        )
      )
    `)
    .eq("commerce_id", commerce.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  // Fetch active products of this commerce to select from for manual orders
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .eq("commerce_id", commerce.id)
    .eq("is_active", true)
    .eq("is_deleted", false);

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <OrdersClient
        initialOrders={orders || []}
        commerce={commerce}
        products={products || []}
      />
    </div>
  );
}
