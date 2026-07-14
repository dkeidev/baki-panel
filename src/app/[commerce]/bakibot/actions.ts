"use server";

import { createClient } from "@lib/supabase/server";
import { revalidatePath } from "next/cache";

const EVO_URL = "https://whatsapp.bakibot.lat";
const EVO_KEY = "iryjqVaR0xmLvKcF";

export async function toggleBotState(commerceId: string, isEnabled: boolean, commerceSlug: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("commerces")
    .update({ bot_enabled: isEnabled })
    .eq("id", commerceId);

  if (error) {
    console.error("Error toggling bot state:", error);
    return { error: "No se pudo cambiar el estado del bot." };
  }

  revalidatePath(`/${commerceSlug}/bakibot`);
  return { success: true };
}

export async function generateInstanceQR(commerceSlug: string) {
  try {
    const response = await fetch(`${EVO_URL}/instance/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": EVO_KEY
      },
      body: JSON.stringify({
        instanceName: commerceSlug,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      })
    });

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    console.error("Error generating QR:", err);
    return { error: err.message || "No se pudo conectar con el servidor de WhatsApp." };
  }
}

export async function deleteInstanceSession(commerceSlug: string, commerceId: string) {
  try {
    // 1. Desconectar la instancia en Evolution API
    const response = await fetch(`${EVO_URL}/instance/delete/${commerceSlug}`, {
      method: "DELETE",
      headers: {
        "apikey": EVO_KEY
      }
    });
    const data = await response.json();

    // 2. Limpiar las sesiones activas en la base de datos para no dejar chats colgados
    const supabase = await createClient();
    const { error: sessionError } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("commerce_id", commerceId);

    if (sessionError) {
      console.error("Error deleting sessions on disconnect:", sessionError);
    }

    revalidatePath(`/${commerceSlug}/bakibot`);
    return { success: true, data };
  } catch (err: any) {
    console.error("Error deleting instance session:", err);
    return { error: err.message || "Error al desconectar la sesión." };
  }
}
