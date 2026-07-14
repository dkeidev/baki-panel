import { createClient } from "@lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PanelPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // Fetch user's commerce to redirect dynamically
  const { data: commerce, error: commerceError } = await supabase
    .from("commerces")
    .select("slug")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (commerceError) {
    console.error("Error fetching commerce in panel page:", commerceError);
  }

  if (commerce?.slug) {
    redirect(`/panel/${commerce.slug}/products`);
  } else {
    redirect("/auth/onboarding");
  }
}
