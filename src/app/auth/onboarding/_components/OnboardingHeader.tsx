"use client";

import { createClient } from "@lib/supabase/client";
import ThemeSwitcher from "@shared/components/ThemeSwitcher";
import BakiIcon from "@shared/icons/BakiIcon";
import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserProfile {
  email: string;
  username: string;
  avatarUrl: string;
  fullName: string;
}

export default function OnboardingHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const fetchUserData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let username = "";
        try {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

          if (profileData?.username) {
            username = profileData.username;
          }
        } catch (error) {
          console.error("Error fetching username from profiles table:", error);
        }

        if (!username) {
          username = user.email?.split("@")[0] || "usuario";
        }

        setProfile({
          email: user.email || "",
          username: username.startsWith("@") ? username : `@${username}`,
          avatarUrl:
            user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
          fullName:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "Usuario Baki",
        });
      }
    };

    fetchUserData();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-outline/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/auth/onboarding" className="flex items-center gap-2.5">
          <BakiIcon width={32} height={32} color="#FF5C00" />
          <span className="text-xl font-extrabold tracking-tight text-on-surface">
            Baki Onboarding
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {mounted && <ThemeSwitcher />}
          <div className="h-8 w-px bg-outline/20" />

          {mounted && (
            <div className="relative" ref={dropdownRef}>
              {profile ? (
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 hover:opacity-90 transition-all cursor-pointer group"
                >
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold ring-2 ring-primary/20">
                      {profile.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-xs font-bold text-on-surface line-clamp-1">
                      {profile.fullName}
                    </span>
                    <span className="text-[10px] text-on-surface-variant line-clamp-1">
                      {profile.username}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface transition-colors hidden sm:block" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse" />
                  <div className="hidden md:flex flex-col gap-1">
                    <div className="h-3 w-20 bg-surface-container rounded animate-pulse" />
                    <div className="h-2 w-16 bg-surface-container rounded animate-pulse" />
                  </div>
                </div>
              )}

              {dropdownOpen && profile && (
                <div className="absolute right-0 mt-2.5 w-60 origin-top-right rounded-2xl border border-outline/10 bg-card p-2 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-outline/5 text-left mb-1">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {profile.fullName}
                    </p>
                    <p className="text-[10px] text-on-surface-variant truncate mt-0.5">
                      {profile.email}
                    </p>
                    <p className="text-[10px] text-primary font-bold mt-1">
                      {profile.username}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer text-left w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
