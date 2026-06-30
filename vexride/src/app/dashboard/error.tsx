"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { realtimeLogger } from "@/lib/realtime/logger";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    realtimeLogger.error("dashboard-error", error.message, {
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#1E293B]/80 p-8 text-center shadow-xl"
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
          <AlertTriangle className="size-7 text-red-400" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-white">Algo salió mal</h1>
        <p className="mt-2 text-sm text-slate-400">
          No pudimos cargar el dashboard. Si usas Supabase, verifica tu conexión y
          variables de entorno.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-3 rounded-lg bg-black/30 p-3 text-left font-mono text-xs text-red-300/80">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-vex font-semibold text-[#0F172A] hover:opacity-90"
          >
            <RefreshCw className="size-4" aria-hidden />
            Reintentar
          </Button>
          <Link
            href="/"
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5"
          >
            <Home className="size-4" aria-hidden />
            Ir al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
