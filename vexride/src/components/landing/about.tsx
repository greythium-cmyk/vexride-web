"use client";

import { motion } from "framer-motion";
import { Building2, Globe, Rocket, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    icon: Building2,
    title: "Greythium Incorporated",
    description:
      "Empresa fundada y registrada en el Estado de Nueva York, con un historial de productos exitosos como PitchAutopsy.com.",
  },
  {
    icon: Rocket,
    title: "Nueva era de movilidad",
    description:
      "Vexride es la apuesta principal de Greythium en movilidad inteligente y productividad para profesionales urbanos.",
  },
  {
    icon: Users,
    title: "Comunidad de confianza",
    description:
      "Conectamos conductores y pasajeros con matching inteligente, balance justo y seguridad premium.",
  },
  {
    icon: Globe,
    title: "Impacto sostenible",
    description:
      "Reducimos la huella de carbono de los traslados laborales con carpools optimizados por IA predictiva.",
  },
];

export function About() {
  return (
    <section id="nosotros" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#14B8A6]/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge className="mb-4 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6]">
            Quiénes somos
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tecnología de movilidad con visión{" "}
            <span className="text-gradient">global</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            <strong className="text-white">Vexride</strong> es la división
            tecnológica de{" "}
            <strong className="text-white">Greythium Incorporated</strong>,
            empresa con sede en Nueva York. Tras el éxito de productos como{" "}
            <span className="text-[#22D3EE]">PitchAutopsy.com</span>, Greythium
            lanza Vexride como su plataforma principal de movilidad inteligente
            y productividad para el mundo laboral moderno.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 transition-all hover:border-[#14B8A6]/30 hover:bg-[#1E293B]/80"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-vex shadow-lg shadow-teal-500/20 transition-transform group-hover:scale-110">
                <item.icon className="size-6 text-[#0F172A]" />
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 lg:p-12"
        >
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-white lg:text-3xl">
                Dos categorías de conductores, una experiencia premium
              </h3>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Vexride ofrece matching para conductores regulares y una
                experiencia exclusiva{" "}
                <span className="font-semibold text-[#22D3EE]">
                  Premium Driver / Luxury Ride
                </span>{" "}
                para vehículos de lujo, con tarifas superiores y prioridad en
                el matching.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                <div className="text-3xl font-bold text-gradient">Regular</div>
                <div className="mt-2 text-sm text-slate-400">
                  Conductores normales con balance justo y flexibilidad
                  inteligente
                </div>
              </div>
              <div className="rounded-2xl border border-[#22D3EE]/30 bg-[#22D3EE]/5 p-5 text-center glow-cyan">
                <div className="text-3xl font-bold text-[#22D3EE]">Luxury</div>
                <div className="mt-2 text-sm text-slate-400">
                  Premium Driver con matching prioritario y tarifas elevadas
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
