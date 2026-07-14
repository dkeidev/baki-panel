import {
  ArrowRight,
  Award,
  CircleDollarSign,
  Cpu,
  Gem,
  Rocket,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <Star className="w-4 h-4 fill-primary text-primary" />
              100% Gratis - Sin tarjeta
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-on-surface">
              De fotos desordenadas <br />
              <span className="text-primary">a ventas organizadas</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed">
              Crea tu catálogo digital en 30 segundos. Sube fotos desde tu
              celular, obtén un link profesional y empieza a vender más por
              WhatsApp. Sin apps, sin complicaciones.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:opacity-90 transition-all duration-300 text-on-primary font-bold px-8 py-4 rounded-2xl text-lg shadow-lg shadow-primary/20 flex items-center gap-2 group"
              >
                Crear mi catálogo gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="border-2 border-outline/30 hover:border-primary/50 transition-all duration-300 text-on-surface font-bold px-8 py-4 rounded-2xl text-lg text-center"
              >
                Ver demo
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            {/* Ambient background glow */}
            <div className="absolute -z-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Phone Mockup with floating animation */}
            <div className="relative max-w-[320px] w-full aspect-[9/19.5] bg-neutral-900 rounded-[3rem] p-3 border-[8px] border-neutral-800 shadow-2xl animate-float">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-800 rounded-b-2xl z-20" />
              <div className="relative w-full h-full overflow-hidden rounded-[2.2rem]">
                <Image
                  alt="Vista previa del catálogo digital en móvil"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEXkn0nD5INS4rRIoAK6R-hBDFdT55tSElzmMH6N09PIYHKDSxSmM0Bw1qu0afBEK-O01y6vHWbhuZa9Iqg8C9fSTg4epaljmq9JQOxA7Lw8NEteoGnY_9fXOIrtDbRzaKdy4P6-odmc-j5IIk9zko08fKxtpdglbLqEPa3Md8xasz-j2zmKx0GoDrnXnVQr-hqWI4WcBvT4NDk6i6iiqJwVxZJCEyYNkIFuWSQUeZD7wvklgopHJjAk3D1oC82hrBKljOwsknAjt9"
                  fill
                  sizes="320px"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-outline/10 py-10 bg-surface-container/30 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-on-surface-variant font-semibold text-xs uppercase tracking-widest mb-8">
            Utilizado por +5000 emprendedores
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 text-on-surface">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Gem className="w-6 h-6 text-primary" /> Fictional
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Award className="w-6 h-6 text-primary" /> Spotify
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Cpu className="w-6 h-6 text-primary" /> Human
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <CircleDollarSign className="w-6 h-6 text-primary" /> Financan
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Rocket className="w-6 h-6 text-primary" /> Starup
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
