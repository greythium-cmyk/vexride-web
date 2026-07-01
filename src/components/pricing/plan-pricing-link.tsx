import Link from "next/link";
import { cn } from "@/lib/utils";
import { PLAN_CHECKOUT_LINKS, type PlanId } from "@/lib/subscription/plans";

interface PlanPricingLinkProps {
  planId: PlanId;
  popular?: boolean;
}

export function PlanPricingLink({ planId, popular = false }: PlanPricingLinkProps) {
  const { href, label, external } = PLAN_CHECKOUT_LINKS[planId];

  return (
    <Link
      href={href}
      className={cn(
        "relative z-20 block w-full rounded-lg py-3 text-center text-sm font-semibold no-underline",
        popular
          ? "bg-gradient-vex text-[#0F172A] shadow-lg shadow-teal-500/10"
          : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </Link>
  );
}
