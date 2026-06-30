"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import type { MatchBreakdown } from "@/lib/types/dashboard";

const defaultBreakdown: MatchBreakdown = {
  schedule: 98,
  route: 95,
  preferences: 92,
  history: 96,
};

interface MatchBreakdownChartProps {
  breakdown?: MatchBreakdown;
  totalScore: number;
}

const factors: { key: keyof MatchBreakdown; label: string }[] = [
  { key: "schedule", label: "Horario" },
  { key: "route", label: "Ruta" },
  { key: "preferences", label: "Preferencias" },
  { key: "history", label: "Historial" },
];

export function MatchBreakdownChart({
  breakdown = defaultBreakdown,
  totalScore,
}: MatchBreakdownChartProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Match breakdown</h4>
        <span className="text-lg font-bold text-gradient">{totalScore}%</span>
      </div>
      <div className="space-y-3">
        {factors.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-400">{f.label}</span>
              <span className="font-medium text-[#14B8A6]">
                {breakdown[f.key]}%
              </span>
            </div>
            <Progress value={breakdown[f.key]} className="[&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-white/10 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-[#14B8A6] [&_[data-slot=progress-indicator]]:to-[#22D3EE]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
