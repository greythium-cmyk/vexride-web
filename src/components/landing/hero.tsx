"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Calendar,
  MapPin,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "98%", label: "Precisión de matching" },
  { value: "24/7", label: "Vex AI activo" },
  { value: "3x", label: "Menos cancelaciones" },
];

const floatingCards = [
  {
    icon: Calendar,
    title: "Calendario sincronizado",
    desc: "Match automático con tu agenda",
    position: "top-8 -left-4 lg:-left-12",
    delay: 0.2,
  },
  {
    icon: MapPin,
    title: "Ubicación en vivo",
    desc: "Rutas optimizadas en tiempo real",
    position: "top-1/3 -right-4 lg:-right-8",
    delay: 0.4,
  },
  {
    icon: Shield,
    title: "Seguridad premium",
    desc: "Verificación y gamificación",
    position: "bottom-16 -left-2 lg:-left-6",
    delay: 0.6,
  },
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 grid-pattern" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[800px] -translate-x-1/2 rounded-full bg-[#14B8A6]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-0 size-[500px] rounded-full bg-[#22D3EE]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <Badge className="mb-6 border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-[#22D3EE]">
              <Sparkles className="size-3.5" />
              División tecnológica de Greythium Incorporated
            </Badge>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              El carpooling{" "}
              <span className="text-gradient">más inteligente</span> para tu
              traslado laboral
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0 mx-auto">
              Vexride usa IA avanzada para organizar automáticamente carpools
              basados en tu calendario, ubicación en tiempo real y preferencias
              personales. Menos estrés, más productividad.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-vex text-base font-semibold text-[#0F172A] shadow-xl shadow-teal-500/30 hover:opacity-90"
                render={<Link href="#oferta" />}
              >
                Obtener acceso anticipado
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/10 px-8 text-base text-slate-300 hover:bg-white/5 hover:text-white"
                render={<Link href="#como-funciona" />}
              >
                Ver cómo funciona
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gradient sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-square max-h-[520px] w-full">
              <div className="absolute inset-4 rounded-3xl bg-gradient-vex opacity-20 blur-2xl" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1E293B]/80 p-6 shadow-2xl backdrop-blur-xl glow-teal">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#14B8A6]" />
                    <span className="text-xs font-medium text-slate-400">
                      Vex AI — Activo
                    </span>
                  </div>
                  <Badge className="bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20">
                    <Brain className="size-3" />
                    Predictivo
                  </Badge>
                </div>

                <div className="flex-1 space-y-3">
                  {[
                    {
                      name: "María G.",
                      route: "Brooklyn → Manhattan",
                      time: "8:15 AM",
                      match: "97%",
                      premium: false,
                    },
                    {
                      name: "Carlos R. ★ Premium",
                      route: "Queens → Midtown",
                      time: "8:20 AM",
                      match: "99%",
                      premium: true,
                    },
                    {
                      name: "Ana L.",
                      route: "Jersey City → FiDi",
                      time: "8:25 AM",
                      match: "94%",
                      premium: false,
                    },
                  ].map((ride, i) => (
                    <motion.div
                      key={ride.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className={`flex items-center justify-between rounded-xl border p-4 ${
                        ride.premium
                          ? "border-[#22D3EE]/30 bg-[#22D3EE]/5"
                          : "border-white/5 bg-white/5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {ride.name}
                          </span>
                          {ride.premium && (
                            <Star
                              className="size-3.5 text-[#22D3EE]"
                              fill="currentColor"
                            />
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400">
                          {ride.route} · {ride.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#14B8A6]">
                          {ride.match}
                        </div>
                        <div className="text-[10px] text-slate-500">match</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-3">
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-[#14B8A6]">
                      Vex AI:
                    </span>{" "}
                    Carpools organizados para mañana. 3 matches confirmados,
                    0 cancelaciones previstas.
                  </p>
                </div>
              </div>

              {floatingCards.map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay + 0.8, duration: 0.5 }}
                  className={`absolute hidden lg:block ${card.position}`}
                >
                  <div className="glass flex items-center gap-3 rounded-2xl p-3 shadow-xl">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#14B8A6]/20">
                      <card.icon className="size-5 text-[#14B8A6]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {card.title}
                      </div>
                      <div className="text-xs text-slate-400">{card.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
