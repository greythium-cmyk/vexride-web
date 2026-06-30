"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "vexride_launch_seen";

export function LaunchBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          className="fixed bottom-24 right-4 z-50 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-[#14B8A6]/30 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] p-5 shadow-2xl shadow-teal-500/20 lg:bottom-8"
          role="dialog"
          aria-labelledby="launch-title"
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 hover:bg-white/5 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>

          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-vex shadow-lg shadow-teal-500/20">
            <Rocket className="size-5 text-[#0F172A]" aria-hidden />
          </div>

          <h3 id="launch-title" className="mt-3 text-lg font-bold text-white">
            ¡Vexride está listo!
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Producto completo con Realtime, Stripe, mapas y PWA. Comparte el demo o conecta
            producción en minutos.
          </p>

          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <Sparkles className="size-3 text-[#14B8A6]" aria-hidden />
              Modo demo sin configuración
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="size-3 text-[#22D3EE]" aria-hidden />
              Deploy 1-click en Vercel
            </li>
          </ul>

          <div className="mt-4 flex gap-2">
            <Link
              href="/pricing"
              onClick={dismiss}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#22D3EE] text-sm font-semibold text-[#0F172A] hover:opacity-90"
            >
              Ver planes
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
