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
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { ProfessionalBarChart } from "@/components/dashboard/ui/pro-chart";
import { StatCardSkeleton, ChartSkeleton } from "@/components/dashboard/ui/skeletons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function StatsHistory() {
  const { data, loading } = useDashboard();
  const { historySummary, monthlyStats } = data;

  const summaryCards = [
    {
      icon: Car,
      label: "Viajes completados",
      value: historySummary.totalTrips,
      color: "text-[#14B8A6]",
      bg: "bg-[#14B8A6]/10",
      tip: "Total histórico de carpools",
    },
    {
      icon: DollarSign,
      label: "Ahorro total",
      value: `$${historySummary.totalSavings}`,
      color: "text-[#22D3EE]",
      bg: "bg-[#22D3EE]/10",
      tip: "Ahorro acumulado vs transporte solo",
    },
    {
      icon: Leaf,
      label: "CO₂ evitado",
      value: `${historySummary.totalCo2} kg`,
      color: "text-[#14B8A6]",
      bg: "bg-[#14B8A6]/10",
      tip: "Impacto ambiental positivo",
    },
    {
      icon: Star,
      label: "Rating promedio",
      value: historySummary.avgRating,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      tip: "Tu reputación como pasajero",
    },
  ];

  if (loading) {
    return (
      <section id="estadisticas" aria-busy="true">
        <div className="mb-5 h-6 w-48 animate-pulse rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section id="estadisticas" aria-labelledby="stats-heading">
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="size-5 text-[#14B8A6]" aria-hidden />
        <div>
          <h2 id="stats-heading" className="text-lg font-semibold text-white">
            Estadísticas e Historial
          </h2>
          <p className="text-sm text-slate-400">Tu impacto en los últimos 6 meses</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, i) => (
          <Tooltip key={card.label}>
            <TooltipTrigger
              render={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-4 transition-colors hover:border-[#14B8A6]/20"
                />
              }
            >
              <div className={`flex size-9 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`size-4 ${card.color}`} aria-hidden />
              </div>
              <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-slate-400">{card.label}</p>
            </TooltipTrigger>
            <TooltipContent>{card.tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium text-white">Ahorro mensual ($)</h3>
            <Award className="size-4 text-[#14B8A6]" aria-hidden />
          </div>
          <ProfessionalBarChart
            data={monthlyStats}
            dataKey="savings"
            valuePrefix="$"
            gradientFrom="#14B8A6"
            gradientTo="rgba(20,184,166,0.35)"
            ariaLabel="Gráfico de ahorro mensual en dólares"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium text-white">Viajes completados</h3>
            <Car className="size-4 text-[#22D3EE]" aria-hidden />
          </div>
          <ProfessionalBarChart
            data={monthlyStats}
            dataKey="trips"
            gradientFrom="#22D3EE"
            gradientTo="rgba(34,211,238,0.35)"
            ariaLabel="Gráfico de viajes completados por mes"
          />
        </motion.div>
      </div>
    </section>
  );
}
