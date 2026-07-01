import { Check, Crown, Sparkles, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ENTERPRISE_STRIPE_CHECKOUT_URL,
  PLANS,
  PRO_STRIPE_CHECKOUT_URL,
  STARTER_STRIPE_CHECKOUT_URL,
  STRIPE_PLAN_LINK_STYLE,
} from "@/lib/subscription/plans";

const icons = {
  free: Sparkles,
  starter: Sparkles,
  pro: Crown,
  enterprise: Building,
};

interface PricingPlansProps {
  className?: string;
  showTitle?: boolean;
}

export function PricingPlans({ className, showTitle = true }: PricingPlansProps) {
  return (
    <section className={cn("py-4", className)}>
      {showTitle && (
        <div className="mb-10 text-center">
          <Badge className="mb-4 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6]">
            Planes y precios
          </Badge>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Elige tu plan Vexride
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Escala desde demo gratuita hasta Enterprise. Usa código{" "}
            <span className="font-mono text-[#14B8A6]">LAUNCH50</span> en checkout.
          </p>
        </div>
      )}

      <div className="grid gap-6 pb-12 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => {
          const Icon = icons[plan.id];

          return (
            <div key={plan.id} className={cn("h-full", plan.popular && "pt-4")}>
              <Card
                className={cn(
                  "relative flex h-full flex-col justify-between border-white/10 bg-[#1E293B]/60 backdrop-blur",
                  plan.popular &&
                    "overflow-visible border-[#14B8A6]/40 shadow-lg shadow-teal-500/10"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 border-[#14B8A6]/30 bg-gradient-vex text-[#0F172A]">
                    Más popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon className="size-5 text-[#14B8A6]" aria-hidden />
                  </div>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-2">
                    <span className="text-3xl font-bold text-white">{plan.priceLabel}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check className="mt-0.5 size-4 shrink-0 text-[#14B8A6]" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {plan.id === "free" && (
                  <a href="/sign-up">Comenzar gratis</a>
                )}
                {plan.id === "starter" && (
                  <a href={STARTER_STRIPE_CHECKOUT_URL} style={STRIPE_PLAN_LINK_STYLE}>
                    Elegir Starter
                  </a>
                )}
                {plan.id === "pro" && (
                  <a href={PRO_STRIPE_CHECKOUT_URL} style={STRIPE_PLAN_LINK_STYLE}>
                    Elegir Pro
                  </a>
                )}
                {plan.id === "enterprise" && (
                  <a
                    href={ENTERPRISE_STRIPE_CHECKOUT_URL}
                    style={STRIPE_PLAN_LINK_STYLE}
                  >
                    Elegir Enterprise
                  </a>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
