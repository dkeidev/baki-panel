"use server";

import { createClient } from "@lib/supabase/server";
import { validateWhatsappNumber } from "@shared/utils/phone";
import { revalidatePath } from "next/cache";

async function uploadCoverImage(file: File): Promise<string> {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `cover-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error } = await supabase.storage
    .from("baki-media")
    .upload(filePath, file);

  if (error) {
    throw new Error(`Error subiendo portada: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("baki-media").getPublicUrl(filePath);

  return publicUrl;
}

export async function updateStore(
  commerceId: string,
  _prevState: any,
  formData: FormData,
) {
  const name = (formData.get("name") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const currency = (formData.get("currency") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const coverFile = formData.get("coverImage") as File | null;
  const currentCoverUrl = (formData.get("currentCoverUrl") as string) || "";

  if (!name) return { error: "El nombre de la tienda es obligatorio." };
  if (!slugInput) return { error: "El enlace público (slug) es obligatorio." };
  if (!whatsapp) return { error: "El número de WhatsApp es obligatorio." };
  if (!currency) return { error: "La moneda es obligatoria." };

  const phoneValidation = validateWhatsappNumber(whatsapp);
  if (!phoneValidation.isValid) {
    return { error: phoneValidation.error };
  }

  // Strip leading @ and sanitize slug
  const cleanSlug = slugInput
    .replace(/^@/, "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (cleanSlug.length < 3) {
    return { error: "El enlace público debe tener al menos 3 caracteres." };
  }

  const supabase = await createClient();

  // Validate slug uniqueness
  const { data: existingCommerce, error: checkError } = await supabase
    .from("commerces")
    .select("id")
    .eq("slug", cleanSlug)
    .neq("id", commerceId)
    .maybeSingle();

  if (checkError) {
    return { error: "Error al validar la disponibilidad del enlace." };
  }

  if (existingCommerce) {
    return {
      error: "Este enlace de catálogo ya está registrado por otra tienda.",
    };
  }

  let coverImageUrl = currentCoverUrl;
  if (coverFile && coverFile.size > 0) {
    try {
      coverImageUrl = await uploadCoverImage(coverFile);
    } catch (uploadError: any) {
      return { error: uploadError.message };
    }
  }

  const { error } = await supabase
    .from("commerces")
    .update({
      name,
      slug: cleanSlug,
      whatsapp_number: phoneValidation.formatted,
      currency,
      description,
      cover_image_url: coverImageUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commerceId);

  if (error) {
    console.error("Error updating commerce:", error);
    return { error: "No se pudieron guardar los cambios. Inténtalo de nuevo." };
  }

  revalidatePath(`/panel/${cleanSlug}/store`);
  revalidatePath(`/${cleanSlug}`);

  return { success: true, newSlug: cleanSlug };
}
