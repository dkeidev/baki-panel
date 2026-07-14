"use client";

import { createClient } from "@lib/supabase/client";
import ThemeSwitcher from "@shared/components/ThemeSwitcher";
import BakiIcon from "@shared/icons/BakiIcon";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Store,
  X
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar({
  userProfileWidget,
}: {
  userProfileWidget: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commerceName, setCommerceName] = useState("");
  const [planType, setPlanType] = useState<string>("free");

  const commerceSlug = params.commerce as string | undefined;

  useEffect(() => {
    if (!commerceSlug) {
      setCommerceName("");
      return;
    }

    const supabase = createClient();
    
    // Fetch commerce details
    supabase
      .from("commerces")
      .select("id, name, profile_id")
      .eq("slug", commerceSlug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data && !error) {
          setCommerceName(data.name);
          
          // Fetch commerce subscription status
          supabase
            .from("subscriptions")
            .select("plan_type")
            .eq("commerce_id", data.id)
            .maybeSingle()
            .then(({ data: subData, error: subError }) => {
              if (subData && !subError) {
                setPlanType(subData.plan_type);
              }
            });
        }
      });
  }, [commerceSlug]);

  const activeLinks = commerceSlug
    ? [
        {
          name: "Productos",
          href: `/${commerceSlug}/products`,
          icon: Package,
        },
        {
          name: "Pedidos",
          href: `/${commerceSlug}/orders`,
          icon: ShoppingCart,
        },
        ...(planType !== "free"
          ? [
              {
                name: "Baki Bot",
                href: `/${commerceSlug}/bakibot`,
                icon: Bot,
              },
            ]
          : []),
      ]
    : [{ name: "Mis Tiendas", href: "/", icon: Store }];

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`h-full flex flex-col justify-between p-4 text-on-surface group ${
        isMobile
          ? "bg-card shadow-2xl border-r border-outline/10"
          : "bg-card/75 backdrop-blur-xl"
      }`}
      data-collapsed={collapsed && !isMobile ? "true" : "false"}
    >
      <div className="space-y-6">
        {/* Dynamic Brand / Store Header */}
        <div className="flex items-center justify-between h-12 w-full">
          {commerceSlug ? (
            collapsed && !isMobile ? (
              <Link
                href={`/${commerceSlug}/store`}
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/40 flex items-center justify-center text-primary font-black text-sm mx-auto transition-all cursor-pointer flex-shrink-0"
                title="Ajustes de la Tienda"
              >
                {commerceName ? commerceName.charAt(0).toUpperCase() : "B"}
              </Link>
            ) : (
              <div className="flex items-center justify-between gap-2 border border-outline/10 bg-surface-container/30 px-3 py-2 rounded-xl transition-all overflow-hidden h-12 w-full">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs flex-shrink-0">
                    {commerceName ? commerceName.charAt(0).toUpperCase() : "B"}
                  </div>
                  <span
                    className={`text-xs font-bold text-on-surface truncate transition-all duration-300 ${
                      collapsed && !isMobile
                        ? "opacity-0 w-0 pointer-events-none"
                        : "opacity-100 w-auto"
                    }`}
                  >
                    {commerceName || "Cargando..."}
                  </span>
                </div>

                {(!collapsed || isMobile) && (
                  <Link
                    href={`/${commerceSlug}/store`}
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors flex-shrink-0"
                    title="Ajustes de la Tienda"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )
          ) : (
            <Link
              href="/"
              className={`flex items-center overflow-hidden ${
                collapsed && !isMobile
                  ? "w-10 h-10 justify-center mx-auto"
                  : "gap-2.5 w-full"
              }`}
            >
              <BakiIcon
                width={30}
                height={30}
                color="#FF5C00"
                className="flex-shrink-0"
              />
              <span
                className={`text-lg font-black tracking-tight text-on-surface whitespace-nowrap transition-all duration-300 ease-in-out origin-left ${
                  collapsed && !isMobile
                    ? "opacity-0 max-w-0 translate-x-[-10px] pointer-events-none overflow-hidden"
                    : "opacity-100 max-w-[200px] translate-x-0"
                }`}
              >
                Baki Panel
              </span>
            </Link>
          )}

          {isMobile && !commerceSlug && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          {activeLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            const isSidebarCollapsed = collapsed && !isMobile;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-xl font-bold text-sm transition-all group overflow-hidden ${
                  isSidebarCollapsed
                    ? "w-10 h-10 justify-center px-0 mx-auto"
                    : "gap-3 px-3 py-2.5 w-full"
                } ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all duration-300 ease-in-out origin-left ${
                    isSidebarCollapsed
                      ? "opacity-0 max-w-0 translate-x-[-10px] pointer-events-none overflow-hidden"
                      : "opacity-100 max-w-[200px] translate-x-0"
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Profile area */}
      <div className="space-y-4 pt-4 border-t border-outline/10">
        {/* 1. User Profile Widget (Top) */}
        {userProfileWidget}
        {/* 2 & 3. Theme Switcher & Collapse Button Grouped (Desktop Only) */}
        {!isMobile && (
          <div
            className={`flex transition-all duration-300 w-full ${
              collapsed
                ? "flex-col items-center justify-center gap-3 px-0"
                : "items-center gap-3"
            }`}
          >
            <div className={`flex-shrink-0 ${collapsed ? "w-full flex justify-center" : ""}`}>
              <ThemeSwitcher direction="up" align="left" />
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className={`border border-outline/10 bg-surface-container/15 hover:bg-primary/10 hover:text-primary hover:border-primary/20 rounded-xl text-on-surface-variant transition-all cursor-pointer text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 ${
                collapsed ? "w-10 h-10" : "flex-1 h-10 px-3"
              }`}
              title={collapsed ? "Expandir barra" : "Colapsar barra"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-primary animate-in fade-in duration-300" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="whitespace-nowrap animate-in fade-in duration-300">
                    Colapsar barra
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex h-14 items-center justify-between px-6 bg-card border-b border-outline/10 text-on-surface sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5">
          <BakiIcon width={28} height={28} color="#FF5C00" />
          <span className="text-base font-black tracking-tight text-on-surface">
            Baki
          </span>
        </Link>
        <div className="flex items-center gap-2.5">
          <ThemeSwitcher direction="down" align="right" />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1 text-on-surface-variant hover:text-on-surface"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Fixed Left) */}
      <aside
        className={`hidden md:block h-screen sticky top-0 transition-all duration-300 z-30 flex-shrink-0 border-r border-outline/15 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay/Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex-1 flex flex-col max-w-[280px] w-full h-full animate-in slide-in-from-left duration-200 bg-background">
            <SidebarContent isMobile={true} />
          </aside>
        </div>
      )}
    </>
  );
}
