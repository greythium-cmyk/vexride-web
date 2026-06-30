"use client";

import { motion } from "framer-motion";
import {
  CalendarSync,
  Cpu,
  RefreshCw,
  Route,
  ShieldCheck,
  Trophy,
  Wifi,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    icon: CalendarSync,
    title: "Conecta tu calendario",
    description:
      "Sincroniza Google Calendar, Outlook o Apple Calendar. Vexride detecta automáticamente tus horarios laborales.",
  },
  {
    step: "02",
    icon: Route,
    title: "IA encuentra tu match",
    description:
      "Nuestra IA predictiva analiza ubicación, rutas y preferencias para encontrar el carpool perfecto cada día.",
  },
  {
    step: "03",
    icon: Wifi,
    title: "Viaja con Modo Trabajo",
    description:
      "Activa el Modo Trabajo durante el viaje: Wi-Fi, productividad y tiempo optimizado antes de llegar a la oficina.",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Gana y mejora",
    description:
      "Acumula puntos con gamificación, mejora tu reputación y accede a beneficios exclusivos en la plataforma.",
  },
];

const features = [
  {
    icon: Cpu,
    title: "IA predictiva",
    description: "Anticipa necesidades de traslado con semanas de anticipación",
  },
  {
    icon: RefreshCw,
    title: "Anti-cancelaciones",
    description: "Reemplazo automático si alguien cancela, sin interrupciones",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad premium",
    description: "Verificación de identidad, ratings y monitoreo en tiempo real",
  },
  {
    icon: Zap,
    title: "Flexibilidad inteligente",
    description: "Horarios adaptativos según tu rutina y cambios de agenda",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge className="mb-4 border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]">
            Cómo funciona Vexride
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            De tu calendario al asiento,{" "}
            <span className="text-gradient">automáticamente</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Cuatro pasos simples para transformar tu traslado laboral en una
            experiencia inteligente, productiva y sin estrés.
          </p>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#14B8A6] via-[#22D3EE] to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative ${i % 2 === 1 ? "lg:mt-16" : ""}`}
              >
                <div className="flex gap-5 rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 transition-all hover:border-[#14B8A6]/30 lg:p-8">
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-vex shadow-lg shadow-teal-500/20">
                      <item.icon className="size-7 text-[#0F172A]" />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-[#14B8A6]">
                      PASO {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-white/5 bg-white/5 p-5 text-center transition-colors hover:border-[#14B8A6]/20 hover:bg-[#14B8A6]/5"
            >
              <feature.icon className="mx-auto size-8 text-[#14B8A6]" />
              <h4 className="mt-3 font-semibold text-white">{feature.title}</h4>
              <p className="mt-1 text-xs text-slate-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
