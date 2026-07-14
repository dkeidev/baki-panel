import { CheckCircle2, FileEdit, Share2, Upload } from "lucide-react";
import Image from "next/image";

const checkFeatures = [
  "Carga ultra rápida",
  "Un solo link para todo",
  "Actualización en vivo",
  "Descargable como imagen",
  "Códigos QR para compartir",
  "Integración con WhatsApp",
];

export default function VisualShowcase() {
  return (
    <section
      id="demo"
      className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden"
    >
      <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-on-surface">
        Cómo funciona
      </h2>

      {/* Steps Grid */}
      <div className="grid md:grid-cols-3 gap-12 mb-20 relative z-10">
        {/* Connector line for desktop */}
        <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-outline/20 -z-10" />

        {/* Step 1 */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto border-2 border-primary shadow-lg shadow-primary/20 bg-surface">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">1. Sube fotos</h3>
          <p className="text-on-surface-variant text-sm px-4">
            Desde tu galería directamente a la plataforma sin pasos extras.
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto border-2 border-primary shadow-lg shadow-primary/20 bg-surface">
            <FileEdit className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">
            2. Personaliza tu tienda
          </h3>
          <p className="text-on-surface-variant text-sm px-4">
            Ponle tu logo, colores y nombre. Que se vea tan profesional como tú.
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto border-2 border-primary shadow-lg shadow-primary/20 bg-surface">
            <Share2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">
            3. Comparte el enlace
          </h3>
          <p className="text-on-surface-variant text-sm px-4">
            En tu bio de Instagram o envíalo por WhatsApp. ¡Listo para vender!
          </p>
        </div>
      </div>

      {/* Feature Bento Card / Dashboard Preview */}
      <div className="glass-card rounded-[2rem] p-8 md:p-12 max-w-5xl mx-auto border border-outline/10 bg-surface-container/20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <div className="bg-surface-container-high px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <div className="ml-4 h-5 w-full bg-neutral-900 rounded-md"></div>
              </div>
              <div className="relative w-full aspect-[4/3]">
                <Image
                  alt="Dashboard de Baki"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhdYylP4km8US5YCX8rXNYfkAKSRJE6F2uULRWHyKtS_hOwpReV6d3BFOL8ykhe414x08Nc-z6d5WxoQriBHi5sH6o9uNIaHI1kA2nJewUpGttSAFb0W_9JtsjICjCFREVtPrY0sQT-cK6BkAwX7KobX9JJt57JyHKkVJ0Osu8Vd-FZR8L4y1r4XAYZ-sZhgtDAw_mfHiDEqBP_aJqRdscU48MIQSpcb3N0iKJXG9SMhBZjxJmARn-qCV5691MbRa1_xb2Gm1vIGXs"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <ul className="grid grid-cols-1 gap-4">
              {checkFeatures.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-3 text-on-surface"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="font-bold text-base">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
