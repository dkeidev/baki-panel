import { BrainCircuit, MessageSquareOff, TrendingDown } from "lucide-react";

export default function PainSolution() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-on-surface">
        El problema que todo{" "}
        <span className="text-primary">emprendedor conoce</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-8 rounded-2xl hover:bg-on-surface/[0.04] transition-all duration-300 group border border-outline/10 bg-surface-container/20">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <MessageSquareOff className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-on-surface">
            ¿Fotos perdidas en WhatsApp?
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            Tus clientes se marean buscando precios entre cientos de mensajes y
            capturas de pantalla borrosas.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-8 rounded-2xl hover:bg-on-surface/[0.04] transition-all duration-300 group border border-outline/10 bg-surface-container/20">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-on-surface">
            ¿Clientes que no te entienden?
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            Sin links, sin orden, sin precios claros. Pierdes horas respondiendo
            las mismas dudas básicas una y otra vez.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-8 rounded-2xl hover:bg-on-surface/[0.04] transition-all duration-300 group border border-outline/10 bg-surface-container/20">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-on-surface">
            ¿Perdiendo ventas por desorden?
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            Cada minuto que tu catálogo no está listo, es una venta que se va.
            La fricción mata la conversión en segundos.
          </p>
        </div>
      </div>
    </section>
  );
}
