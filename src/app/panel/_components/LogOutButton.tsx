"use client";

import { createClient } from "@lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogOutButtonProps {
  collapsedClass?: string;
}

export function LogOutButton({ collapsedClass = "" }: LogOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={`p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-on-surface-variant transition-colors cursor-pointer flex items-center justify-center ${collapsedClass}`}
      title="Cerrar Sesión"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
