"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface ThemeSwitcherProps {
  direction?: "up" | "down";
  align?: "left" | "right";
  className?: string;
}

export default function ThemeSwitcher({
  direction = "down",
  align = "right",
  className = "",
}: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return <div className={className || "w-10 h-10"} />;

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="w-4 h-4 text-orange-500" />;
    if (theme === "dark") return <Moon className="w-4 h-4 text-primary" />;
    return <Monitor className="w-4 h-4 text-on-surface-variant" />;
  };

  const options = [
    { key: "light", label: "Claro", icon: <Sun className="w-4 h-4" /> },
    { key: "dark", label: "Oscuro", icon: <Moon className="w-4 h-4" /> },
    { key: "system", label: "Sistema", icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Seleccionar tema"
        className={`rounded-xl border border-outline/25 bg-surface-container/30 hover:bg-on-surface/5 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 text-on-surface ${
          className || "w-10 h-10"
        }`}
      >
        {getThemeIcon()}
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === "left" ? "left-0" : "right-0"} ${
            direction === "up"
              ? `bottom-full mb-2 ${align === "left" ? "origin-bottom-left" : "origin-bottom-right"}`
              : `mt-2 ${align === "left" ? "origin-top-left" : "origin-top-right"}`
          } w-36 rounded-2xl border border-outline/10 bg-background/95 backdrop-blur-md shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in-50 duration-150`}
        >
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                setTheme(opt.key);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-left font-semibold transition-all duration-200 cursor-pointer ${
                theme === opt.key
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface hover:bg-on-surface/5"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
