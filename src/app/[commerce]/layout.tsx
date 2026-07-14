import { createClient } from "@lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import UserProfileWidget from "./_components/UserProfileWidget";

export default async function CommerceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ commerce: string }>;
}) {
  const { commerce: commerceSlug } = await params;
  const supabase = await createClient();

  // 1. Verify session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // 2. Verify ownership - user can only access their own commerce
  const { data: commerceData, error: commerceError } = await supabase
    .from("commerces")
    .select("id, profile_id")
    .eq("slug", commerceSlug)
    .maybeSingle();

  if (commerceError || !commerceData) {
    // Commerce does not exist, redirect to root which handles the redirect
    redirect("/");
  }

  if (commerceData.profile_id !== user.id) {
    // User does not own this commerce, redirect to their own panel
    redirect("/");
  }

  return (
    <div className="h-screen flex justify-center w-full panel-bg-animated overflow-hidden">
      <div className="w-full max-w-[1728px] flex flex-col md:flex-row text-foreground h-full border-x border-outline/5 dark:border-outline/15 shadow-2xl dark:shadow-[0_0_80px_-20px_rgba(0,0,0,0.9)] bg-background/95 backdrop-blur-md overflow-hidden">
        <Sidebar userProfileWidget={<UserProfileWidget />} />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="w-full px-6 py-8 md:py-10 flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
