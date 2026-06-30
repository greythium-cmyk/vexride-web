"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MonthlyStat } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

interface ProfessionalBarChartProps {
  data: MonthlyStat[];
  dataKey: "savings" | "trips";
  valuePrefix?: string;
  gradientFrom: string;
  gradientTo: string;
  ariaLabel: string;
}

export function ProfessionalBarChart({
  data,
  dataKey,
  valuePrefix = "",
  gradientFrom,
  gradientTo,
  ariaLabel,
}: ProfessionalBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d[dataKey]), 1);

  return (
    <div
      className="relative pt-2"
      role="img"
      aria-label={ariaLabel}
    >
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0F172A] px-3 py-1.5 text-xs shadow-xl"
            style={{
              left: `${((hoveredIndex + 0.5) / data.length) * 100}%`,
            }}
          >
            <span className="font-semibold text-white">
              {valuePrefix}
              {data[hoveredIndex][dataKey]}
            </span>
            <span className="ml-1 text-slate-400">{data[hoveredIndex].month}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-44 items-end justify-between gap-1.5 sm:gap-2">
        {data.map((item, i) => {
          const heightPct = (item[dataKey] / max) * 100;
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={item.month}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <motion.button
                type="button"
                initial={{ height: 0 }}
                whileInView={{ height: `${heightPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={() => setHoveredIndex(null)}
                className={cn(
                  "relative w-full max-w-10 min-h-[4px] rounded-t-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50",
                  isHovered && "scale-105 shadow-lg shadow-teal-500/20"
                )}
                style={{
                  background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
                }}
                aria-label={`${item.month}: ${valuePrefix}${item[dataKey]}`}
              />
              <span
                className={cn(
                  "text-[10px] transition-colors sm:text-xs",
                  isHovered ? "font-medium text-[#14B8A6]" : "text-slate-500"
                )}
              >
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
