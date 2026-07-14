import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container/30 py-16 border-t border-outline/10 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-2xl font-black text-on-surface tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-bold text-lg">
                B
              </span>
              Baki
            </div>
            <p className="text-on-surface-variant text-sm max-w-[240px] text-center md:text-left">
              Potenciando a la nueva generación de micro-emprendedores en
              Latinoamérica.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
              href="/"
            >
              Inicio
            </Link>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
              href="#pricing"
            >
              Precios
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
              href="#demo"
            >
              Demo
            </a>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
              href="/auth/login"
            >
              Iniciar sesión
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
              href="/privacy"
            >
              Privacidad
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
              href="/terms"
            >
              Términos
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
              href="/contact"
            >
              Contacto
            </Link>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-outline/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant/60 font-semibold">
          <p>© 2026 Baki.lat - Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            Hecho con {"<3"} para emprendedores
          </div>
        </div>
      </div>
    </footer>
  );
}
