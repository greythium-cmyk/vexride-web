"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Gift, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PRO_STRIPE_CHECKOUT_URL,
  STRIPE_CHECKOUT_LINK_PROPS,
  STRIPE_PLAN_LINK_STYLE,
} from "@/lib/subscription/plans";

export function LaunchOffer() {
  const [copied, setCopied] = useState(false);
  const promoCode = "LAUNCH50";
  const spotsRemaining = 73;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="oferta" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[#14B8A6]/30 bg-gradient-to-br from-[#14B8A6]/20 via-[#1E293B] to-[#22D3EE]/10 p-8 lg:p-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#22D3EE]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-[#14B8A6]/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge className="mb-4 bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/30">
                <Gift className="size-3.5" />
                Oferta de Lanzamiento
              </Badge>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                50% OFF en plan Pro
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Los primeros{" "}
                <strong className="text-white">100 usuarios</strong> obtienen{" "}
                <strong className="text-[#22D3EE]">50% de descuento</strong> en
                el plan Pro durante los primeros{" "}
                <strong className="text-white">3 meses</strong>.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Cupos disponibles</span>
                    <span className="font-semibold text-[#14B8A6]">
                      {spotsRemaining} de 100
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-vex transition-all"
                      style={{ width: `${((100 - spotsRemaining) / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "Vex AI prioritario 24/7 incluido",
                  "IA predictiva avanzada sin límites",
                  "Gamificación y estadísticas detalladas",
                  "Modo Trabajo completo durante viajes",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/20">
                      <Check className="size-3 text-[#14B8A6]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#0F172A]/60 p-8 backdrop-blur-xl">
              <Sparkles className="size-10 text-[#22D3EE]" />
              <p className="mt-4 text-center text-sm text-slate-400">
                Usa este código al registrarte
              </p>

              <div className="mt-4 flex w-full max-w-xs items-center gap-2">
                <div className="flex-1 rounded-xl border border-dashed border-[#14B8A6]/50 bg-[#14B8A6]/5 px-6 py-4 text-center">
                  <span className="text-2xl font-bold tracking-widest text-gradient">
                    {promoCode}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="shrink-0 border-white/10 hover:bg-white/5"
                  onClick={handleCopy}
                  aria-label="Copiar código"
                >
                  {copied ? (
                    <Check className="size-5 text-[#14B8A6]" />
                  ) : (
                    <Copy className="size-5" />
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <div className="text-sm text-slate-500 line-through">$69/mes</div>
                <div className="text-4xl font-bold text-white">
                  $34.50
                  <span className="text-lg font-normal text-slate-400">/mes</span>
                </div>
                <div className="mt-1 text-sm text-[#14B8A6]">
                  durante los primeros 3 meses
                </div>
              </div>

              <a
                href={PRO_STRIPE_CHECKOUT_URL}
                style={STRIPE_PLAN_LINK_STYLE}
                {...STRIPE_CHECKOUT_LINK_PROPS}
              >
                Reclamar mi descuento
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
