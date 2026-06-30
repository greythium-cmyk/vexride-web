"use client";

import { motion } from "framer-motion";
import {
  Award,
  Car,
  DollarSign,
  Leaf,
  Star,
  TrendingUp,
} from "lucide-react";
import { historySummary, monthlyStats } from "@/lib/mock-data";

function BarChart({
  data,
  dataKey,
  color,
}: {
  data: typeof monthlyStats;
  dataKey: "savings" | "trips";
  color: string;
}) {
  const max = Math.max(...data.map((d) => d[dataKey]));

  return (
    <div className="flex h-40 items-end justify-between gap-2 pt-4">
      {data.map((item, i) => {
        const height = (item[dataKey] / max) * 100;
        return (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`w-full max-w-8 rounded-t-lg ${color}`}
              style={{ minHeight: 4 }}
            />
            <span className="text-[10px] text-slate-500">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StatsHistory() {
  const summaryCards = [
    {
      icon: Car,
      label: "Viajes completados",
      value: historySummary.totalTrips,
      color: "text-[#14B8A6]",
      bg: "bg-[#14B8A6]/10",
    },
    {
      icon: DollarSign,
      label: "Ahorro total",
      value: `$${historySummary.totalSavings}`,
      color: "text-[#22D3EE]",
      bg: "bg-[#22D3EE]/10",
    },
    {
      icon: Leaf,
      label: "CO₂ evitado",
      value: `${historySummary.totalCo2} kg`,
      color: "text-[#14B8A6]",
      bg: "bg-[#14B8A6]/10",
    },
    {
      icon: Star,
      label: "Rating promedio",
      value: historySummary.avgRating,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <section id="estadisticas">
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="size-5 text-[#14B8A6]" />
        <div>
          <h2 className="text-lg font-semibold text-white">
            Estadísticas e Historial
          </h2>
          <p className="text-sm text-slate-400">Tu impacto en los últimos 6 meses</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-4"
          >
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${card.bg}`}
            >
              <card.icon className={`size-4 ${card.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-slate-400">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white">Ahorro mensual ($)</h3>
            <Award className="size-4 text-[#14B8A6]" />
          </div>
          <BarChart
            data={monthlyStats}
            dataKey="savings"
            color="bg-gradient-to-t from-[#14B8A6] to-[#14B8A6]/40"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white">Viajes completados</h3>
            <Car className="size-4 text-[#22D3EE]" />
          </div>
          <BarChart
            data={monthlyStats}
            dataKey="trips"
            color="bg-gradient-to-t from-[#22D3EE] to-[#22D3EE]/40"
          />
        </motion.div>
      </div>
    </section>
  );
}
