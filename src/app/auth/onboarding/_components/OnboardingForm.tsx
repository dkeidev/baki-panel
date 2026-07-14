"use client";

import {
  AlertCircle,
  ArrowRight,
  Coins,
  Loader2,
  Phone,
  Store,
} from "lucide-react";
import { useActionState, useState } from "react";
import { completeOnboarding } from "../actions";

export default function OnboardingForm() {
  const [commerceName, setCommerceName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [currency, setCurrency] = useState("PEN");

  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Commerce Name Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="commerceName"
          className="text-xs font-bold text-on-surface flex items-center gap-1.5"
        >
          <Store className="w-3.5 h-3.5 text-primary" /> Nombre de tu Comercio
        </label>
        <input
          id="commerceName"
          name="commerceName"
          type="text"
          required
          placeholder="ej: Pastelería Dulce Amor"
          value={commerceName}
          onChange={(e) => setCommerceName(e.target.value)}
          className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
          minLength={3}
          maxLength={50}
        />
      </div>

      {/* WhatsApp Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="whatsapp"
          className="text-xs font-bold text-on-surface flex items-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-primary" /> Celular / WhatsApp de
          Ventas
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          placeholder="ej: +51987654321"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
        />
        <p className="text-[10px] text-on-surface-variant">
          Debe incluir el signo '+' y el código de país (ej. para Perú: +51987654321, para Colombia: +573001234567).
        </p>
      </div>

      {/* Currency Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="currency"
          className="text-xs font-bold text-on-surface flex items-center gap-1.5"
        >
          <Coins className="w-3.5 h-3.5 text-primary" /> Moneda de Venta
        </label>
        <select
          id="currency"
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
        >
          <option value="PEN">Soles (PEN)</option>
          <option value="COP">Pesos Colombianos (COP)</option>
          <option value="USD">Dólares (USD)</option>
          <option value="ARS">Pesos Argentinos (ARS)</option>
          <option value="CLP">Pesos Chilenos (CLP)</option>
        </select>
        <p className="text-[10px] text-on-surface-variant">
          Selecciona la moneda en la que se mostrarán los precios en tu
          catálogo.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:opacity-90 text-on-primary font-bold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creando Tienda...</span>
          </>
        ) : (
          <>
            <span>Crear mi Tienda</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
