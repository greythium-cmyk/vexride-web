"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1E293B]/30 px-6 py-12 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-vex/10 ring-1 ring-[#14B8A6]/20">
        <Icon className="size-7 text-[#14B8A6]" aria-hidden />
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <Button
          className="mt-6 bg-gradient-vex font-semibold text-[#0F172A] hover:opacity-90"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
