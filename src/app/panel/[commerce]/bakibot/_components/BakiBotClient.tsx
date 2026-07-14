"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Power,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff
} from "lucide-react";
import { toggleBotState, generateInstanceQR, deleteInstanceSession } from "../actions";

interface BakiBotClientProps {
  commerce: {
    id: string;
    slug: string;
    name: string;
    bot_enabled: boolean;
  };
  initialConnectionState: string;
  subscription: {
    id: string;
    plan_type: string;
    status: string;
  } | null;
}

export default function BakiBotClient({
  commerce,
  initialConnectionState,
  subscription
}: BakiBotClientProps) {
  const [botEnabled, setBotEnabled] = useState<boolean>(commerce.bot_enabled);
  const [connectionState, setConnectionState] = useState<string>(initialConnectionState);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for connection state changes once a QR is active
  useEffect(() => {
    if (connectionState === "open") {
      setQrCodeBase64(null);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    if (qrCodeBase64) {
      pollingRef.current = setInterval(async () => {
        try {
          const response = await fetch(
            `https://whatsapp.bakibot.lat/instance/connectionState/${commerce.slug}`,
            {
              headers: {
                "apikey": "iryjqVaR0xmLvKcF"
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            const state = data.instance?.state || "close";
            if (state === "open") {
              setConnectionState("open");
              setQrCodeBase64(null);
              clearInterval(pollingRef.current!);
              pollingRef.current = null;
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [qrCodeBase64, connectionState, commerce.slug]);

  const handleToggleBot = async () => {
    setLoading(true);
    setErrorMsg(null);
    const newStatus = !botEnabled;
    const res = await toggleBotState(commerce.id, newStatus, commerce.slug);
    if (res.success) {
      setBotEnabled(newStatus);
    } else {
      setErrorMsg(res.error || "No se pudo cambiar el estado del bot.");
    }
    setLoading(false);
  };

  const handleConnect = async () => {
    setLoading(true);
    setErrorMsg(null);
    setQrCodeBase64(null);

    const res = await generateInstanceQR(commerce.slug);
    if (res.success) {
      const qrcode = res.data?.qrcode?.base64;
      if (qrcode) {
        setQrCodeBase64(qrcode);
      } else if (res.data?.instance?.status === "open") {
        setConnectionState("open");
      } else {
        setErrorMsg("El servidor no devolvió un código QR. Reintente en un momento.");
      }
    } else {
      setErrorMsg(res.error || "Error al conectar con la pasarela.");
    }
    setLoading(false);
  };

  const handleDisconnect = async () => {
    if (!confirm("¿Estás seguro de que deseas desconectar y dar de baja el bot de WhatsApp? Dejará de responder de inmediato.")) {
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    const res = await deleteInstanceSession(commerce.slug, commerce.id);
    if (res.success) {
      setConnectionState("close");
      setQrCodeBase64(null);
    } else {
      setErrorMsg(res.error || "No se pudo desconectar el bot.");
    }
    setLoading(false);
  };

  const isFreePlan = !subscription || subscription.plan_type === "free" || subscription.status !== "active";
  const isBotEnabledPlan = !isFreePlan && subscription.plan_type !== "lite" && subscription.plan_type !== "bot_lite";

  const getPlanLabel = () => {
    if (isFreePlan) {
      return {
        name: "Baki Plan FREE",
        desc: "Gratis para siempre. Hasta 100 productos y 20 activos. WhatsApp Bot no disponible.",
        color: "from-gray-500/10 to-gray-600/5 border-outline/10 text-on-surface-variant"
      };
    }
    switch (subscription.plan_type) {
      case "lite":
      case "bot_lite":
        return {
          name: "Baki Plan LITE (S/. 59.00/mes)",
          desc: "Categorías, hasta 1,000 productos y 100 activos. Incluye BakiBot Lite gratis.",
          color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-500"
        };
      case "premium":
      case "bot_premium":
        return {
          name: "Baki Plan PREMIUM (S/. 199.00/mes) 🚀",
          desc: "Productos ilimitados, landings dedicadas y BakiBot Premium con Inteligencia Artificial.",
          color: "from-primary/10 to-orange-600/10 border-primary/20 text-primary"
        };
      case "vitalicio":
      case "founder":
        return {
          name: "Plan Socio Vitalicio / Fundador 🏆",
          desc: "Acceso Premium de 2 años (Baki Premium + BakiBot Premium ilimitado). ¡Socio fundador!",
          color: "from-purple-500/15 to-indigo-500/10 border-purple-500/30 text-purple-500"
        };
      default:
        return {
          name: `Plan ${subscription.plan_type.toUpperCase()}`,
          desc: "Suscripción activa en tu comercio.",
          color: "from-primary/10 to-orange-600/10 border-primary/20 text-primary"
        };
    }
  };

  const planInfo = getPlanLabel();

  return (
    <div className="flex-1 flex flex-col space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-on-surface">Configuración de Baki Bot</h1>
        <p className="text-sm text-on-surface-variant">
          Vincula tu WhatsApp a la Inteligencia Artificial de BakiBot para automatizar tus ventas.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Founder Special Offer Banner */}
      {isFreePlan && (
        <div className="p-6 bg-gradient-to-r from-purple-600/20 via-indigo-600/15 to-transparent border border-purple-500/30 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
          <h3 className="font-black text-sm text-purple-400 flex items-center gap-1.5">
            🏆 Oferta Especial para Socios Fundadores
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">
            ¡Premia tu confianza en Baki! Adquiere <strong>1 año de suscripción Baki Premium</strong> por <strong>S/. 2,000</strong> antes del lanzamiento oficial y te regalamos <strong>1 año adicional completamente GRATIS</strong>. Obtén 2 años completos de Baki Premium + BakiBot Premium con Inteligencia Artificial ilimitada para tus ventas.
          </p>
          <div>
            <a
              href={`/panel/${commerce.slug}/store`}
              className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Asegurar Plan Fundador
            </a>
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Plan and Global Switch */}
        <div className="md:col-span-1 space-y-6">
          {/* Plan Card */}
          <div className={`p-5 rounded-2xl border bg-gradient-to-br ${planInfo.color} space-y-3`}>
            <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
              Suscripción de Tienda
            </span>
            <h3 className="text-base font-black leading-tight">{planInfo.name}</h3>
            <p className="text-xs opacity-80 leading-relaxed">{planInfo.desc}</p>
          </div>

          {/* Toggle Card */}
          <div className="p-5 border border-outline/10 bg-card rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-on-surface">Estado del Bot</h4>
                <p className="text-xs text-on-surface-variant">Encendido / Apagado</p>
              </div>
              <button
                onClick={handleToggleBot}
                disabled={loading || isFreePlan}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  botEnabled && !isFreePlan
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container/80"
                } ${isFreePlan ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isFreePlan ? "Requiere suscripción Plan Lite o superior" : ""}
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[11px] text-on-surface-variant leading-relaxed">
              {isFreePlan ? (
                <span className="text-rose-500 font-semibold block">⚠️ Requiere actualizar al Plan Lite para encender el bot.</span>
              ) : (
                "Si apagas este switch, el bot dejará de responder a nuevos mensajes en WhatsApp de forma global para esta tienda."
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Connection Status & QR Code */}
        <div className="md:col-span-2 space-y-6">
          {/* Connection Status Card */}
          <div className="p-6 border border-outline/10 bg-card rounded-2xl space-y-6">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Conexión con WhatsApp
            </h3>

            {connectionState === "open" ? (
              // Connected State
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-500 flex items-center gap-1.5">
                      Bot Conectado y En Línea <Wifi className="w-4 h-4 animate-pulse" />
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Tu número de WhatsApp está sincronizado correctamente y respondiendo de forma automática.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" /> Desconectar Cuenta (Dar de baja)
                  </button>
                </div>
              </div>
            ) : (
              // Disconnected State
              isFreePlan ? (
                // Locked State for Free Plan
                <div className="space-y-5">
                  <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                    <WifiOff className="w-8 h-8 text-rose-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-rose-500">
                        Dispositivo Bloqueado (Plan Incompatible)
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Tu plan actual (*Plan Gratis*) no permite vincular bots de WhatsApp.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Para poder escanear el código QR y sincronizar tu WhatsApp con el bot conversacional de BakiBot, necesitas actualizar al menos al **Plan Lite** de BakiBot.
                  </p>
                  <div>
                    <a
                      href={`/panel/${commerce.slug}/store`}
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 text-xs font-bold rounded-xl shadow-md transition-all"
                    >
                      Actualizar Plan en Ajustes
                    </a>
                  </div>
                </div>
              ) : (
                // Normal Disconnected State
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <WifiOff className="w-8 h-8 text-amber-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-500">
                        Bot Desconectado
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Necesitas vincular un dispositivo móvil escaneando el código QR para que el bot pueda recibir y contestar los mensajes.
                      </p>
                    </div>
                  </div>

                  {qrCodeBase64 ? (
                    <div className="flex flex-col items-center justify-center p-6 border border-dashed border-outline/10 bg-surface-container/10 rounded-2xl space-y-4">
                      <span className="text-xs font-bold text-on-surface-variant">
                        Escanea este código QR desde tu WhatsApp móvil:
                      </span>
                      <div className="p-3 bg-white rounded-xl shadow-md border border-outline/5">
                        <img
                          src={qrCodeBase64}
                          alt="WhatsApp QR Code"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Esperando escaneo desde tu celular...
                      </span>
                      <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="px-4 py-2 border border-outline/15 hover:bg-surface-container text-xs font-bold rounded-xl transition-all"
                      >
                        Regenerar QR
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleConnect}
                      disabled={loading}
                      className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Generar Código QR para Sincronizar
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Warnings and Best Practices Banner */}
      <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-4">
        <h4 className="font-black text-sm text-amber-500 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" /> Recomendaciones Críticas Contra Baneos (Anti-Ban)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-on-surface-variant">
          <div className="space-y-3">
            <div>
              <strong className="text-on-surface block mb-0.5">📱 Usa un chip exclusivo:</strong>
              Evita vincular tu número personal. Las respuestas rápidas y constantes del bot pueden interrumpir tus conversaciones normales y resultar incómodas.
            </div>
            <div>
              <strong className="text-on-surface block mb-0.5">⏳ Chip con antigüedad (+3 meses):</strong>
              Es sumamente importante que el número tenga al menos **3 meses de actividad real** y chats previos. WhatsApp suspende inmediatamente los chips recién comprados que empiezan a enviar automatizaciones de golpe.
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <strong className="text-on-surface block mb-0.5">🚫 Prohibido el Spam / Envío Masivo:</strong>
              El bot está diseñado exclusivamente para **ventas entrantes (inbound)**. Nunca lo utilices para mandar mensajes publicitarios masivos a bases de datos (outbound), ya que WhatsApp cancelará tu cuenta de forma definitiva.
            </div>
            <div>
              <strong className="text-on-surface block mb-0.5">⚙️ Protección de Retardos Activa:</strong>
              BakiBot tiene configurados retrasos de simulación de escritura (1.2 segundos por mensaje) y pausas de 12 horas automáticas si el administrador escribe manualmente, simulando un comportamiento 100% humano.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
