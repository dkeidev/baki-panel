import ThemeSwitcher from "@shared/components/ThemeSwitcher";
import BakiIcon from "@shared/icons/BakiIcon";
import { Check } from "lucide-react";
import ButtonGoogleSignin from "./_components/ButtonGoogleSignin";

export default function LoginPage() {
  const features = [
    "Crea catálogos en segundos sin código",
    "Recibe pedidos organizados en tu WhatsApp",
    "Optimizado para celulares y redes sociales",
    "Soporte para modo claro y oscuro",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background gradients for premium feel */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* Header with logo and theme switcher */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <BakiIcon width={32} height={32} color="#FF5C00" />
          <span className="text-xl font-extrabold tracking-tight text-on-surface">
            Baki
          </span>
        </div>
        <ThemeSwitcher />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10">
        <div className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-outline/10 bg-card/70 backdrop-blur-xl shadow-2xl relative">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Animated Logo Wrapper */}
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-primary/20 hover:scale-105 transition-all duration-300">
              <BakiIcon width={40} height={40} color="#FF5C00" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-on-surface bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Bienvenido a Baki
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant max-w-sm">
              La forma más rápida de vender por WhatsApp con catálogos digitales
              interactivos.
            </p>
          </div>

          {/* Feature List for UX Improvement */}
          <div className="bg-surface-container/40 border border-outline/5 p-4.5 rounded-2xl space-y-2.5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-xs text-on-surface-variant font-medium"
              >
                <div className="w-4 h-4 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-500/20">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <ButtonGoogleSignin />
          </div>

          <p className="text-center text-[10px] text-on-surface-variant/70 leading-relaxed max-w-xs mx-auto">
            Al continuar, aceptas nuestros{" "}
            <a
              href="/terms"
              className="underline hover:text-primary transition-colors"
            >
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a
              href="/privacy"
              className="underline hover:text-primary transition-colors"
            >
              Política de Privacidad
            </a>
            .
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[10px] text-on-surface-variant/60 border-t border-outline/5">
        &copy; {new Date().getFullYear()} Baki.lat. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
