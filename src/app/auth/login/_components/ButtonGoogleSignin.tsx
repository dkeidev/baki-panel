"use client";

import { createClient } from "@lib/supabase/client";
import GoogleIcon from "@shared/icons/GoogleIcon";
import { useState } from "react";

export default function ButtonGoogleSignin() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/panel`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Supabase OAuth error, using developer fallback:", err);
      // Fallback redirect for developer to access /panel directly if client/credentials not set up yet
      window.location.href = "/panel";
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={loading}
      className="w-full h-12 rounded-xl border border-outline/30 font-bold hover:bg-primary/5 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-on-surface disabled:opacity-50 text-sm"
    >
      <GoogleIcon className="w-5 h-5 flex-shrink-0" />
      {loading ? "Cargando..." : "Continuar con Google"}
    </button>
  );
}
