"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Clock,
  MessageSquare,
  Mic,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  {
    icon: Clock,
    title: "Disponible 24/7",
    description:
      "Vex AI nunca duerme. Resuelve dudas, reprograma viajes y optimiza rutas a cualquier hora.",
  },
  {
    icon: TrendingUp,
    title: "IA predictiva avanzada",
    description:
      "Aprende de tus patrones de movilidad y anticipa necesidades antes de que las expreses.",
  },
  {
    icon: MessageSquare,
    title: "Asistente conversacional",
    description:
      "Chatea naturalmente para modificar horarios, encontrar conductores premium o resolver incidencias.",
  },
  {
    icon: Mic,
    title: "Comandos por voz",
    description:
      "Controla tu experiencia manos libres mientras conduces o te preparas para el día.",
  },
];

const chatMessages = [
  {
    role: "user" as const,
    text: "¿Tengo carpool mañana a las 8 AM?",
  },
  {
    role: "ai" as const,
    text: "Sí, María confirmó el match al 97%. Ruta: Brooklyn → Manhattan, salida 8:15 AM. ¿Activo Modo Trabajo?",
  },
  {
    role: "user" as const,
    text: "Sí, y busca un Premium Driver para el viernes",
  },
  {
    role: "ai" as const,
    text: "Listo. Reservé Luxury Ride con Carlos R. (★ 4.9) para el viernes 8:20 AM. Matching prioritario aplicado.",
  },
];

export function VexAI() {
  return (
    <section id="vex-ai" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 size-[600px] -translate-y-1/2 rounded-full bg-[#14B8A6]/10 blur-3xl" />
        <div className="absolute right-0 top-0 size-[400px] rounded-full bg-[#22D3EE]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6]">
              <Bot className="size-3.5" />
              Vex AI 24/7
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Tu copiloto inteligente,{" "}
              <span className="text-gradient">siempre activo</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Vex AI es el corazón de la plataforma. Un asistente de inteligencia
              artificial que gestiona tus carpools, predice necesidades y resuelve
              problemas en tiempo real — las 24 horas del día, los 7 días de la
              semana.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-white/10 bg-[#1E293B]/50 p-4"
                >
                  <cap.icon className="size-5 text-[#22D3EE]" />
                  <h4 className="mt-2 font-semibold text-white">{cap.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {cap.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-vex opacity-10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1E293B]/90 shadow-2xl backdrop-blur-xl glow-teal">
              <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-vex">
                  <Sparkles className="size-5 text-[#0F172A]" />
                </div>
                <div>
                  <div className="font-semibold text-white">Vex AI</div>
                  <div className="flex items-center gap-1.5 text-xs text-[#14B8A6]">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#14B8A6]" />
                    En línea — Prioridad Pro
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#14B8A6]/20 text-white"
                          : "border border-white/10 bg-white/5 text-slate-300"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/10 px-6 py-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <input
                    type="text"
                    placeholder="Pregúntale a Vex AI..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                    readOnly
                  />
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-vex">
                    <Sparkles className="size-4 text-[#0F172A]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
