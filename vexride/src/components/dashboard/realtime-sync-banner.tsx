"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Wifi,
  WifiOff,
  Loader2,
  Sparkles,
  Signal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { cn } from "@/lib/utils";

const statusConfig = {
  syncing: {
    label: "Sincronizando datos",
    sublabel: "Preparando tu panel…",
    icon: Loader2,
    gradient: "from-[#22D3EE]/15 via-[#1E293B] to-[#1E293B]",
    border: "border-[#22D3EE]/25",
    text: "text-[#22D3EE]",
    dot: "bg-[#22D3EE]",
    spin: true,
  },
  connecting: {
    label: "Conectando en vivo",
    sublabel: "Estableciendo canal Realtime…",
    icon: Signal,
    gradient: "from-[#22D3EE]/15 via-[#1E293B] to-[#1E293B]",
    border: "border-[#22D3EE]/25",
    text: "text-[#22D3EE]",
    dot: "bg-[#22D3EE]",
    spin: true,
  },
  connected: {
    label: "Conectado en vivo",
    sublabel: "Supabase Realtime activo",
    icon: Radio,
    gradient: "from-[#14B8A6]/15 via-emerald-500/5 to-[#1E293B]",
    border: "border-[#14B8A6]/30",
    text: "text-[#14B8A6]",
    dot: "bg-[#14B8A6]",
    spin: false,
  },
  demo: {
    label: "Demo en vivo",
    sublabel: "Simulación local · cambios cada ~15s",
    icon: Wifi,
    gradient: "from-amber-500/12 via-[#1E293B] to-[#1E293B]",
    border: "border-amber-500/25",
    text: "text-amber-300",
    dot: "bg-amber-400",
    spin: false,
  },
  error: {
    label: "Realtime desconectado",
    sublabel: "Revisa tu conexión o configuración de Supabase",
    icon: WifiOff,
    gradient: "from-red-500/10 via-[#1E293B] to-[#1E293B]",
    border: "border-red-500/25",
    text: "text-red-400",
    dot: "bg-red-400",
    spin: false,
  },
  idle: {
    label: "",
    sublabel: "",
    icon: Radio,
    gradient: "",
    border: "",
    text: "",
    dot: "",
    spin: false,
  },
} as const;

export function RealtimeSyncBanner() {
  const { syncing, realtimeStatus, source, triggerDemoChange } = useDashboard();

  const show =
    syncing ||
    realtimeStatus === "connecting" ||
    realtimeStatus === "connected" ||
    realtimeStatus === "demo" ||
    realtimeStatus === "error";

  const key = syncing
    ? "syncing"
    : realtimeStatus in statusConfig
      ? (realtimeStatus as keyof typeof statusConfig)
      : "idle";

  if (!show || key === "idle") return null;

  const config = statusConfig[key];
  const Icon = config.icon;
  const showDemoButton = source === "mock" && realtimeStatus === "demo";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={cn(
          "mb-6 flex flex-col gap-3 rounded-2xl border bg-gradient-to-r p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between",
          config.border,
          config.gradient
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl border bg-black/20",
              config.border
            )}
          >
            <Icon
              className={cn("size-4", config.text, config.spin && "animate-spin")}
              aria-hidden
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("font-semibold", config.text)}>{config.label}</span>
              {realtimeStatus === "connected" && (
                <Sparkles className="size-3.5 text-[#22D3EE] opacity-80" aria-hidden />
              )}
            </div>
            <p className="text-xs text-slate-400">{config.sublabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          {realtimeStatus === "connected" && (
            <span className="flex items-center gap-1.5 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-2.5 py-1 text-xs text-[#14B8A6]">
              <span className={cn("size-1.5 animate-pulse rounded-full", config.dot)} />
              Live
            </span>
          )}

          {showDemoButton && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-amber-500/30 bg-amber-500/5 text-amber-200 hover:bg-amber-500/15"
              onClick={triggerDemoChange}
            >
              <Zap className="size-3.5" aria-hidden />
              Simular cambio realtime
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
