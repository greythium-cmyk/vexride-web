"use client";

import { Crown, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPlan, type PlanId } from "@/lib/subscription/plans";

interface PlanGateProps {
  allowed: boolean;
  requiredPlan?: PlanId;
  children: React.ReactNode;
  className?: string;
  featureLabel?: string;
}

export function PlanGate({
  allowed,
  requiredPlan = "pro",
  children,
  className,
  featureLabel = "Función premium",
}: PlanGateProps) {
  if (allowed) return <>{children}</>;

  const plan = getPlan(requiredPlan);

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none blur-[2px] opacity-50">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-[#14B8A6]/20 bg-[#0F172A]/80 p-4 text-center backdrop-blur-sm">
        <div className="mb-2 flex size-10 items-center justify-center rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/10">
          <Lock className="size-4 text-[#14B8A6]" aria-hidden />
        </div>
        <p className="text-sm font-medium text-white">{featureLabel}</p>
        <p className="mt-1 text-xs text-slate-400">
          Disponible en plan {plan.name} ({plan.priceLabel}
          {plan.period})
        </p>
        <Link
          href="/pricing"
          className="mt-3 inline-flex h-7 items-center gap-1 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#22D3EE] px-3 text-xs font-semibold text-[#0F172A] hover:opacity-90"
        >
          <Crown className="size-3.5" aria-hidden />
          Actualizar plan
        </Link>
      </div>
    </div>
  );
}
