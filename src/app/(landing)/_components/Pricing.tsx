import { Check, Star, ShieldAlert } from "lucide-react";
import Link from "next/link";

const freeFeatures = [
  "Hasta 100 productos creados",
  "Hasta 20 productos activos",
  "Productos sin categorías (lista única)",
  "1 tienda por usuario",
  "Creación manual de productos y pedidos",
];

const liteFeatures = [
  "Categorías ilimitadas de productos",
  "Hasta 1000 productos creados",
  "Hasta 100 productos activos",
  "1 tienda por usuario",
  "Creación manual y descargas en vivo",
  "✨ BakiBot LITE Incluido Gratis",
  "🤖 Bot estructurado para WhatsApp 24/7",
  "Suscripción por tienda/comercio",
];

const premiumFeatures = [
  "Productos y categorías ilimitadas",
  "Sincronización XLSX/CSV de inventario",
  "Landings independientes para productos",
  "Hasta 2 tiendas por usuario",
  "✨ BakiBot PREMIUM Incluido",
  "🧠 Bot con Inteligencia Artificial (IA)",
  "Suscripción por tienda/comercio",
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-on-surface">
          Planes flexibles para cada etapa
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto text-sm md:text-base">
          Elige el plan que mejor se adapte al tamaño de tu negocio. Suscripciones transparentes por tienda activa.
        </p>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* FREE PLAN */}
        <div className="glass-card rounded-[2rem] p-8 border border-outline/10 bg-surface-container/5 hover:border-outline/25 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-on-surface-variant uppercase tracking-wider">FREE</h3>
              <p className="text-xs text-on-surface-variant mt-1">Ideal para probar el sistema y arrancar.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-on-surface">S/. 0</span>
              <span className="text-on-surface-variant text-xs font-semibold">/ gratis por siempre</span>
            </div>
            <ul className="space-y-3 pt-4 border-t border-outline/15">
              {freeFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-on-surface">
                  <Check className="text-gray-400 w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-8">
            <Link
              href="/auth/login"
              className="w-full py-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold rounded-2xl text-sm flex items-center justify-center transition-all"
            >
              Empezar Gratis
            </Link>
          </div>
        </div>

        {/* LITE PLAN (POPULAR) */}
        <div className="glass-card rounded-[2rem] p-8 border-2 border-primary shadow-xl shadow-primary/5 bg-surface-container/10 flex flex-col justify-between relative transform md:-translate-y-2">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-on-primary shadow-md flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" /> Más Popular
          </div>
          <div className="space-y-6">
            <div className="pt-2">
              <h3 className="text-xl font-black text-primary uppercase tracking-wider">LITE</h3>
              <p className="text-xs text-on-surface-variant mt-1">El equilibrio perfecto de productos y WhatsApp.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-primary">S/. 59.00</span>
              <span className="text-on-surface-variant text-xs font-semibold">/ al mes por tienda</span>
            </div>
            <ul className="space-y-3 pt-4 border-t border-outline/20">
              {liteFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-on-surface">
                  <Check className="text-primary w-4 h-4 mt-0.5 shrink-0" />
                  <span className={`font-semibold ${feat.startsWith("✨") ? "text-primary" : ""}`}>
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-8">
            <a
              href="https://wa.me/51929735569?text=Hola!%20Quiero%20comprar%20[baki][bakibot]"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary hover:bg-primary/95 text-on-primary font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center shadow-lg shadow-primary/20 transition-all"
            >
              Comprar Ahora
            </a>
          </div>
        </div>

        {/* PREMIUM PLAN (PROXIMAMENTE) */}
        <div className="glass-card rounded-[2rem] p-8 border border-outline/10 bg-surface-container/5 hover:border-outline/25 transition-all duration-300 flex flex-col justify-between relative opacity-85">
          <div className="absolute top-4 right-4 bg-surface-container/50 border border-outline/10 text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">
            Próximamente
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-on-surface-variant uppercase tracking-wider">PREMIUM</h3>
              <p className="text-xs text-on-surface-variant mt-1">Control a gran escala y asistentes inteligentes.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-on-surface">S/. 199.00</span>
              <span className="text-on-surface-variant text-xs font-semibold">/ al mes por tienda</span>
            </div>
            <ul className="space-y-3 pt-4 border-t border-outline/15">
              {premiumFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-on-surface">
                  <Check className="text-primary w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-8">
            <button
              disabled
              className="w-full py-3.5 bg-surface-container/40 text-on-surface-variant/50 font-bold rounded-2xl text-sm flex items-center justify-center cursor-not-allowed border border-outline/5"
            >
              Próximamente
            </button>
          </div>
        </div>

      </div>

      {/* Founder Offer Promotional Banner */}
      <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-transparent border border-purple-500/30 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 flex-1">
            <h4 className="font-black text-base text-purple-400 flex items-center gap-2">
              🏆 Programa de Socios Fundadores (Cupos Limitados)
            </h4>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Apoya la etapa de preventa asegurando un año de suscripción Premium por <strong>S/. 2,000</strong> antes del lanzamiento oficial y te regalamos <strong>1 año adicional completamente GRATIS</strong>. Serás un Socio Fundador con 2 años completos de Baki Premium + BakiBot Premium ilimitado.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-sm whitespace-nowrap shadow-lg shadow-purple-600/10 transition-all shrink-0"
          >
            Asegurar Plan Fundador
          </Link>
        </div>
      </div>
    </section>
  );
}
