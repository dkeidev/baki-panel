import { createClient } from "@lib/supabase/server";
import { LogOutButton } from "./LogOutButton";

export default async function UserProfileWidget() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  // Fetch full profile info from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "Usuario Baki";
  const usernameRaw =
    profile?.username || user.email?.split("@")[0] || "usuario";
  const username = usernameRaw.startsWith("@")
    ? usernameRaw
    : `@${usernameRaw}`;
  const avatarUrl =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    "";

  return (
    <div className="flex items-center justify-between p-2 rounded-2xl bg-surface-container/50 border border-outline/5 overflow-hidden transition-all duration-300 group-data-[collapsed=true]:flex-col group-data-[collapsed=true]:gap-3 group-data-[collapsed=true]:p-1 group-data-[collapsed=true]:w-10 group-data-[collapsed=true]:mx-auto group-data-[collapsed=true]:items-center group-data-[collapsed=true]:justify-center">
      <div className="flex items-center overflow-hidden transition-all duration-300 group-data-[collapsed=true]:flex-col group-data-[collapsed=true]:items-center group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:gap-0 gap-2.5">
        {avatarUrl ? (
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-primary/20 flex-shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-1 ring-primary/20 flex-shrink-0">
            {fullName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col text-left overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out origin-left group-data-[collapsed=true]:hidden group-data-[collapsed=true]:opacity-0 group-data-[collapsed=true]:max-w-0 group-data-[collapsed=true]:translate-x-[-10px] group-data-[collapsed=true]:pointer-events-none">
          <span className="text-xs font-bold text-on-surface truncate">
            {fullName}
          </span>
          <span className="text-[10px] text-on-surface-variant truncate">
            {username}
          </span>
        </div>
      </div>

      <LogOutButton collapsedClass="group-data-[collapsed=true]:w-8 group-data-[collapsed=true]:h-8" />
    </div>
  );
}
