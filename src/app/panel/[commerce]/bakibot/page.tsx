import { createClient } from "@lib/supabase/server";
import { redirect } from "next/navigation";
import BakiBotClient from "./_components/BakiBotClient";

interface PageProps {
  params: Promise<{
    commerce: string;
  }>;
}

const EVO_URL = "https://whatsapp.bakibot.lat";
const EVO_KEY = "iryjqVaR0xmLvKcF";

async function checkConnectionState(commerceSlug: string): Promise<string> {
  try {
    const response = await fetch(`${EVO_URL}/instance/connectionState/${commerceSlug}`, {
      method: "GET",
      headers: {
        "apikey": EVO_KEY
      },
      next: { revalidate: 0 } // Desactivar caché para tener estado en tiempo real
    });

    if (!response.ok) return "close";
    const data = await response.json();
    
    // Devolvemos el estado de la conexión (ej: 'open', 'connecting', 'close')
    return data.instance?.state || "close";
  } catch (err) {
    console.error("Error checking connection state:", err);
    return "close";
  }
}

export default async function BakiBotPage({ params }: PageProps) {
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
    redirect("/panel");
  }

  // Fetch active subscription for the commerce
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("commerce_id", commerce.id)
    .maybeSingle();

  // Check current connection state from VPS
  const connectionState = await checkConnectionState(commerceSlug);

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <BakiBotClient
        commerce={commerce}
        initialConnectionState={connectionState}
        subscription={subscription}
      />
    </div>
  );
}
