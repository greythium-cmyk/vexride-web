"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/components/dashboard/dashboard-context";

export function SupabaseFallbackBanner() {
  const { dataError, source, reload, loading } = useDashboard();

  if (!dataError || source === "supabase") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-[#1E293B] to-[#1E293B] p-4 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
          <Database className="size-4 text-amber-400" aria-hidden />
        </div>
        <div>
          <p className="flex items-center gap-2 font-medium text-amber-200">
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
            Modo demostración activo
          </p>
          <p className="mt-0.5 text-sm text-slate-400">
            {dataError}. Configura Clerk y Supabase para datos en vivo y Realtime.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
        onClick={() => void reload()}
        disabled={loading}
      >
        <RefreshCw className={cn("size-4", loading && "animate-spin")} aria-hidden />
        Reintentar conexión
      </Button>
    </motion.div>
  );
}
