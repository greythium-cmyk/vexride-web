"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Radio, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { cn } from "@/lib/utils";

const statusConfig = {
  syncing: {
    label: "Sincronizando datos…",
    icon: Loader2,
    className: "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]",
    spin: true,
  },
  connecting: {
    label: "Conectando en vivo…",
    icon: Loader2,
    className: "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]",
    spin: true,
  },
  connected: {
    label: "En vivo",
    icon: Radio,
    className: "border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6]",
    spin: false,
  },
  demo: {
    label: "Demo en vivo (simulado)",
    icon: Wifi,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    spin: false,
  },
  error: {
    label: "Realtime desconectado",
    icon: WifiOff,
    className: "border-red-500/30 bg-red-500/10 text-red-400",
    spin: false,
  },
  idle: {
    label: "",
    icon: Radio,
    className: "",
    spin: false,
  },
} as const;

export function RealtimeSyncBanner() {
  const { syncing, realtimeStatus, source } = useDashboard();

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={cn(
          "mb-6 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm",
          config.className
        )}
        role="status"
        aria-live="polite"
      >
        <Icon
          className={cn("size-4 shrink-0", config.spin && "animate-spin")}
          aria-hidden
        />
        <span className="font-medium">{config.label}</span>
        {source === "mock" && realtimeStatus === "demo" && (
          <span className="text-xs opacity-80">
            — Los cambios se simulan cada ~15s
          </span>
        )}
        {realtimeStatus === "connected" && (
          <span className="ml-auto flex items-center gap-1.5 text-xs opacity-80">
            <span className="size-1.5 animate-pulse rounded-full bg-[#14B8A6]" />
            Supabase Realtime
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
