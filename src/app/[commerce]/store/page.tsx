import { createClient } from "@lib/supabase/server";
import { redirect } from "next/navigation";
import StoreClient from "./_components/StoreClient";

interface PageProps {
  params: Promise<{
    commerce: string;
  }>;
}

export default async function StorePage({ params }: PageProps) {
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

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <StoreClient commerce={commerce} />
    </div>
  );
}
