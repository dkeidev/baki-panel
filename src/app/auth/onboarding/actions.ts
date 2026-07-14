"use server";

import { createClient } from "@lib/supabase/server";
import { validateWhatsappNumber } from "@shared/utils/phone";
import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function completeOnboarding(_prevState: any, formData: FormData) {
  const commerceName = (formData.get("commerceName") as string)?.trim();
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const currency = (formData.get("currency") as string)?.trim() || "PEN";

  if (!commerceName) {
    return { error: "El nombre de tu comercio es obligatorio." };
  }
  if (!whatsapp) {
    return { error: "El número de WhatsApp es obligatorio." };
  }

  const phoneValidation = validateWhatsappNumber(whatsapp);
  if (!phoneValidation.isValid) {
    return { error: phoneValidation.error };
  }


  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Debes iniciar sesión para completar el registro." };
  }

  // Ensure profiles table has a record (fallback sync for existing users after DDL reset)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { error: "Error al verificar tu perfil. Inténtalo de nuevo." };
  }

  const defaultUsername = user.email
    ? user.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "")
    : `user_${user.id.slice(0, 5)}`;

  if (!profile) {
    // Insert new profile
    const { error: insertProfileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        username: `@${defaultUsername}`,
        full_name:
          user.user_metadata?.full_name || user.user_metadata?.name || "",
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
        email: user.email,
      });

    if (insertProfileError) {
      console.error("Error backfilling profile:", insertProfileError);
      return { error: "Error al crear tu perfil de usuario." };
    }
  } else if (!profile.username) {
    // Update missing username
    await supabase
      .from("profiles")
      .update({
        username: `@${defaultUsername}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  let commerceSlug = slugify(commerceName);
  if (!commerceSlug) {
    commerceSlug = `store-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // 1. Check if slug exists in DB, append random number if taken
  try {
    const { data: existingCommerce, error: checkCommerceError } = await supabase
      .from("commerces")
      .select("slug")
      .eq("slug", commerceSlug)
      .maybeSingle();

    if (checkCommerceError) {
      return { error: "Error al validar el comercio. Inténtalo de nuevo." };
    }

    if (existingCommerce) {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      commerceSlug = `${commerceSlug}-${randomSuffix}`;
    }

    // 2. Create the commerce record and get its ID
    const { data: newCommerce, error: commerceError } = await supabase
      .from("commerces")
      .insert({
        profile_id: user.id,
        name: commerceName,
        slug: commerceSlug,
        currency: currency,
        whatsapp_number: phoneValidation.formatted,
      })
      .select("id")
      .single();

    if (commerceError || !newCommerce) {
      console.error("Error creating commerce:", commerceError);
      return { error: "No se pudo crear tu comercio. Inténtalo de nuevo." };
    }

    // 3. Create the default Free subscription linked to the commerce
    const { error: subError } = await supabase.from("subscriptions").insert({
      commerce_id: newCommerce.id,
      plan_type: "free",
      status: "active",
    });

    if (subError) {
      console.error("Error creating commerce subscription:", subError);
      // Non-blocking but logged
    }
  } catch (error) {
    console.error("DB Mutation error:", error);
    return { error: "Ocurrió un error inesperado al procesar tus datos." };
  }

  // Redirect to panel (which automatically takes the user to their new commerce products page)
  redirect("/panel");
}
