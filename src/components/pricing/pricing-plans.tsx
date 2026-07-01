"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Building, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PLANS, getClientStripeCheckoutUrl, type PlanId } from "@/lib/subscription/plans";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";

const icons = {
  free: Sparkles,
  starter: Sparkles,
  pro: Crown,
  enterprise: Building,
};

interface PricingPlansProps {
  currentPlanName?: string;
  className?: string;
  showTitle?: boolean;
}

export function PricingPlans({
  currentPlanName = "Free",
  className,
  showTitle = true,
}: PricingPlansProps) {
  const { planId, startCheckout, simulateSubscription } = useSubscription({
    planName: currentPlanName,
  });
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const handleSelect = async (id: PlanId) => {
    if (id === "free") return;
    setLoadingPlan(id);
    try {
      const result = await startCheckout(id);
      if (result && "demo" in result && result.demo) {
        simulateSubscription(id);
        toast.success(`¡Plan ${id} activado!`, {
          description: "Suscripción simulada en modo demo.",
        });
      }
    } catch {
      toast.error("No se pudo iniciar el checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

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
        {PLANS.map((plan, i) => {
          const Icon = icons[plan.id];
          const isCurrent = planId === plan.id;
          const isLoading = loadingPlan === plan.id;

          const directCheckoutUrl = getClientStripeCheckoutUrl(plan.id);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn("h-full", plan.popular && "pt-4")}
            >
              <Card
                className={cn(
                  "relative flex h-full flex-col justify-between border-white/10 bg-[#1E293B]/60 backdrop-blur",
                  plan.popular &&
                    "overflow-visible border-[#14B8A6]/40 shadow-lg shadow-teal-500/10",
                  isCurrent && "ring-1 ring-[#14B8A6]/40"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-[#14B8A6]/30 bg-gradient-vex text-[#0F172A]">
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
                <CardFooter className="shrink-0">
                  {directCheckoutUrl && plan.id === "starter" ? (
                    <Button
                      className={cn(
                        "w-full font-semibold",
                        plan.popular
                          ? "bg-gradient-vex text-[#0F172A] hover:opacity-90"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                      render={
                        <a
                          href={directCheckoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      Elegir {plan.name}
                    </Button>
                  ) : (
                    <Button
                      className={cn(
                        "w-full font-semibold",
                        plan.popular
                          ? "bg-gradient-vex text-[#0F172A] hover:opacity-90"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                      disabled={isCurrent || plan.id === "free" || isLoading}
                      onClick={() => void handleSelect(plan.id)}
                    >
                      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
                      {isCurrent
                        ? "Plan actual"
                        : plan.id === "free"
                          ? "Incluido"
                          : `Elegir ${plan.name}`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
