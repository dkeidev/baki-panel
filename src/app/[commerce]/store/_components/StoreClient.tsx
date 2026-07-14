"use client";

import {
  AlertCircle,
  CheckCircle,
  Coins,
  FileText,
  Globe,
  Loader2,
  Phone,
  Store,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateStore } from "../actions";

interface Commerce {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  currency: string;
  whatsapp_number: string;
}

interface StoreClientProps {
  commerce: Commerce;
}

export default function StoreClient({ commerce }: StoreClientProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState(commerce.slug);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    commerce.cover_image_url,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await updateStore(commerce.id, null, formData);

      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess("Ajustes guardados correctamente.");
        if (res.newSlug && res.newSlug !== commerce.slug) {
          // If slug changed, redirect to the new route
          setTimeout(() => {
            router.push(`/${commerce.slug}/store`);
          }, 1000);
        }
      }
    } catch (_err: any) {
      setError("Ocurrió un error al actualizar los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-on-surface flex items-center gap-2">
          <Store className="w-6 h-6 text-primary" /> Mi Tienda
        </h1>
        <p className="text-xs text-on-surface-variant">
          Personaliza los datos públicos de tu comercio y actualiza tu enlace de
          catálogo.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-card/45 border border-outline/10 p-6 rounded-2xl backdrop-blur-md"
      >
        <input
          type="hidden"
          name="currentCoverUrl"
          value={commerce.cover_image_url || ""}
        />

        {/* Store Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-xs font-bold text-on-surface flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-primary" /> Nombre del Comercio
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={commerce.name}
            className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Custom Slug */}
        <div className="space-y-1.5">
          <label
            htmlFor="slug"
            className="text-xs font-bold text-on-surface flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-primary" /> Enlace de Catálogo
            Personalizado (Slug)
          </label>
          <div className="flex items-center bg-surface-container rounded-xl border border-outline/10 px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="text-sm font-bold text-on-surface-variant mr-0.5 select-none">
              baki.lat/@
            </span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
                )
              }
              className="bg-transparent text-on-surface text-sm flex-1 focus:outline-none font-bold"
            />
          </div>
          <p className="text-[10px] text-on-surface-variant">
            Tus clientes te visitarán en:{" "}
            <span className="text-primary font-bold">
              baki.lat/@{slug || "tu-tienda"}
            </span>
          </p>
        </div>

        {/* WhatsApp & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label
              htmlFor="whatsapp"
              className="text-xs font-bold text-on-surface flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-primary" /> Celular / WhatsApp
              de Ventas
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              defaultValue={commerce.whatsapp_number}
              placeholder="ej: +51987654321"
              className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-on-surface-variant">
              Debe incluir el signo '+' y el código de país (ej. para Perú: +51987654321, para Colombia: +573001234567).
            </p>
          </div>

          {/* Currency */}
          <div className="space-y-1.5">
            <label
              htmlFor="currency"
              className="text-xs font-bold text-on-surface flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 text-primary" /> Moneda de la Tienda
            </label>
            <select
              id="currency"
              name="currency"
              defaultValue={commerce.currency}
              className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors cursor-pointer"
            >
              <option value="PEN">Soles (PEN)</option>
              <option value="COP">Pesos Colombianos (COP)</option>
              <option value="USD">Dólares (USD)</option>
              <option value="ARS">Pesos Argentinos (ARS)</option>
              <option value="CLP">Pesos Chilenos (CLP)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="text-xs font-bold text-on-surface flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-primary" /> Descripción de tu
            Comercio
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={commerce.description || ""}
            placeholder="Cuenta brevemente qué vendes, tus horarios o detalles importantes de tu tienda..."
            className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Cover Photo */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface">
            Foto de Portada del Catálogo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <label className="border border-dashed border-outline/20 hover:border-primary/40 bg-surface-container/30 hover:bg-surface-container/50 px-4 py-6 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center">
              <Upload className="w-6 h-6 text-primary" />
              <span className="text-xs font-bold text-on-surface">
                Cambiar Portada
              </span>
              <span className="text-[9px] text-on-surface-variant">
                PNG, JPG, WEBP. Recomendado horizontal
              </span>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <div className="aspect-video w-full rounded-xl bg-surface-container-high/40 border border-outline/10 flex items-center justify-center overflow-hidden">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-on-surface-variant">
                  Sin portada registrada
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-outline/5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:opacity-95 text-on-primary py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando cambios...</span>
              </>
            ) : (
              <span>Guardar Configuración</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
