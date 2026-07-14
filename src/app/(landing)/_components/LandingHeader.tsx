"use client";

import ThemeSwitcher from "@shared/components/ThemeSwitcher";
import BakiIcon from "@shared/icons/BakiIcon";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingHeader() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline/10">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-black text-on-surface tracking-tighter flex items-center gap-2"
        >
          <BakiIcon width={40} height={40} color="#FF5C00" />
          Baki
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {mounted && <ThemeSwitcher />}
          <div className="h-4 w-px bg-outline/20" />
          <a
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
            href="#pricing"
          >
            Precios
          </a>
          <a
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
            href="#demo"
          >
            Demo
          </a>
          <div className="h-4 w-px bg-outline/20" />
          <Link
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
            href="/auth/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/login"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:opacity-90 transition-all duration-200 text-on-primary font-bold px-5 py-2 rounded-full text-sm active:scale-95 shadow-md shadow-primary/20"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-4">
          {mounted && <ThemeSwitcher />}
          <button
            type="button"
            className="text-on-surface p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline/10 bg-background/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {/* biome-ignore lint/a11y/useValidAnchor: local section navigation */}
          <a
            className="text-on-surface-variant text-base font-semibold hover:text-primary transition-colors py-2"
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
          >
            Precios
          </a>
          {/* biome-ignore lint/a11y/useValidAnchor: local section navigation */}
          <a
            className="text-on-surface-variant text-base font-semibold hover:text-primary transition-colors py-2"
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
          >
            Demo
          </a>
          <Link
            className="text-on-surface-variant text-base font-semibold hover:text-primary transition-colors py-2"
            href="/auth/login"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/login"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:opacity-90 transition-all duration-200 text-on-primary font-bold px-6 py-3 rounded-full text-center text-sm active:scale-95 shadow-md shadow-primary/20 w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Empezar gratis
          </Link>
        </div>
      )}
    </header>
  );
}
