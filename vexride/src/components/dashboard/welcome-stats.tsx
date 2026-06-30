"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Leaf,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { quickStats, currentUser } from "@/lib/mock-data";

const statCards = [
  {
    label: "Ahorro mensual",
    value: `$${quickStats.monthlySavings}`,
    sub: "estimado",
    icon: DollarSign,
    color: "text-[#14B8A6]",
    bg: "bg-[#14B8A6]/10",
    trend: "+23% vs mes anterior",
  },
  {
    label: "CO₂ evitado",
    value: `${quickStats.co2Saved} kg`,
    sub: "este mes",
    icon: Leaf,
    color: "text-[#22D3EE]",
    bg: "bg-[#22D3EE]/10",
    trend: "Equivalente a 3 árboles",
  },
  {
    label: "Matches esta semana",
    value: String(quickStats.weeklyMatches),
    sub: "confirmados",
    icon: Users,
    color: "text-[#14B8A6]",
    bg: "bg-[#14B8A6]/10",
    trend: "2 Premium Drivers",
  },
  {
    label: "Próximo viaje",
    value: quickStats.nextTrip.time,
    sub: quickStats.nextTrip.route,
    icon: MapPin,
    color: "text-[#22D3EE]",
    bg: "bg-[#22D3EE]/10",
    trend: `Con ${quickStats.nextTrip.driver}`,
  },
];

export function WelcomeStats() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">{greeting},</p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {currentUser.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
              <Calendar className="size-4" />
              Martes, 30 de junio 2026
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 px-4 py-2">
            <TrendingUp className="size-4 text-[#14B8A6]" />
            <span className="text-sm text-slate-300">
              Racha de <strong className="text-white">12 días</strong> consecutivos
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5 transition-all hover:border-[#14B8A6]/30 hover:bg-[#1E293B]/80"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.sub}</p>
            <p className="mt-2 text-[11px] text-[#14B8A6]">{stat.trend}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
