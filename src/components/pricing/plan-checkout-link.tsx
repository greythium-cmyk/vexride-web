import Link from "next/link";
import { cn } from "@/lib/utils";
import { getClientStripeCheckoutUrl, type PlanId } from "@/lib/subscription/plans";

interface PlanCheckoutLinkProps {
  planId: PlanId;
  popular?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PlanCheckoutLink({
  planId,
  popular = false,
  children,
  className,
}: PlanCheckoutLinkProps) {
  const classNames = cn(
    "inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
    popular
      ? "bg-gradient-vex text-[#0F172A] shadow-lg shadow-teal-500/20 hover:opacity-90"
      : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    className
  );

  if (planId === "free") {
    return (
      <Link href="/sign-up" className={classNames}>
        {children}
      </Link>
    );
  }

  const checkoutUrl = getClientStripeCheckoutUrl(planId) ?? "#precios";

  if (checkoutUrl.startsWith("http")) {
    return (
      <Link
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link href={checkoutUrl} className={classNames}>
      {children}
    </Link>
  );
}
