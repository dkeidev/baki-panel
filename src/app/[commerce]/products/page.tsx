import { createClient } from "@lib/supabase/server";
import { redirect } from "next/navigation";
import ProductsClient from "./_components/ProductsClient";

interface PageProps {
  params: Promise<{
    commerce: string;
  }>;
}

export default async function ProductsPage({ params }: PageProps) {
  const { commerce: commerceSlug } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch the commerce and check ownership
  const { data: commerce, error: commerceError } = await supabase
    .from("commerces")
    .select("*")
    .eq("slug", commerceSlug)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (commerceError || !commerce) {
    redirect("/");
  }

  // Fetch all non-deleted products for this commerce
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("commerce_id", commerce.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  // Fetch active subscription for the commerce
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_type")
    .eq("commerce_id", commerce.id)
    .maybeSingle();

  // Fetch all categories for this commerce
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("commerce_id", commerce.id)
    .order("name", { ascending: true });

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <ProductsClient
        initialProducts={products || []}
        initialCategories={categories || []}
        commerce={commerce}
        planType={subscription?.plan_type || "free"}
      />
    </div>
  );
}
