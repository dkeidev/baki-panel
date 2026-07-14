import { createClient } from "@lib/supabase/server";
import type { MetadataRoute } from "next";

// Forzar a Next.js a que no cachee esto estáticamente en el build
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Traer los slugs de todos los comercios registrados
  const { data: commerces } = await supabase
    .from("commerces")
    .select("slug, updated_at");

  // Rutas estáticas de la landing
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://baki.lat",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://baki.lat/auth/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Generar rutas dinámicas para cada comercio de tus clientes
  const commerceRoutes: MetadataRoute.Sitemap = (commerces || []).map((c) => ({
    url: `https://baki.lat/@${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: "daily", // Se actualiza según cambie su inventario
    priority: 0.8,            // Prioridad alta para indexar los catálogos
  }));

  return [...staticRoutes, ...commerceRoutes];
}
