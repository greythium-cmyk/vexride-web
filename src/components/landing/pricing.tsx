"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useSubscription } from "@/hooks/use-subscription";
import { STARTER_STRIPE_CHECKOUT_URL, type PlanId } from "@/lib/subscription/plans";
import { toast } from "sonner";

const plans: Array<{
  planId: PlanId;
  name: string;
  price: string;
  period: string;
  priceNote?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  icon: typeof Sparkles;
  checkoutUrl?: string;
}> = [
  {
    planId: "free",
    name: "Freemium",
    price: "Gratis",
    period: "",
    description:
      "Ideal para probar la plataforma y descubrir el poder del carpooling inteligente.",
    features: [
      "Matches básicos limitados",
      "Vex AI básico",
      "Funciones esenciales de matching",
      "Perfil de usuario estándar",
      "Soporte por email",
    ],
    cta: "Comenzar gratis",
    popular: false,
    icon: Sparkles,
  },
  {
    planId: "starter",
    name: "Starter",
    price: "$29",
    period: "/mes",
    description:
      "Para profesionales que necesitan matches ilimitados y sincronización completa.",
    features: [
      "Matches ilimitados",
      "Sincronización completa con calendario",
      "Modo Trabajo básico",
      "Vex AI estándar",
      "Notificaciones inteligentes",
      "Historial de viajes",
    ],
    cta: "Elegir Starter",
    popular: false,
    icon: Sparkles,
    checkoutUrl: STARTER_STRIPE_CHECKOUT_URL,
  },
  {
    planId: "pro",
    name: "Pro",
    price: "$69",
    period: "/mes",
    description:
      "La experiencia completa con IA predictiva avanzada y Vex AI prioritario 24/7.",
    features: [
      "Todo ilimitado",
      "Vex AI prioritario 24/7",
      "IA predictiva avanzada",
      "Gamificación completa",
      "Estadísticas detalladas",
      "Modo Trabajo premium",
      "Anti-cancelaciones + reemplazo automático",
      "Acceso Premium Driver matching",
    ],
    cta: "Elegir Pro",
    popular: true,
    icon: Crown,
  },
  {
    planId: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "/mes",
    priceNote: "o custom",
    description:
      "Solución corporativa con panel administrativo, reportes ESG y soporte dedicado.",
    features: [
      "Todo lo del plan Pro",
      "Panel administrativo para empresas",
      "Reportes ESG y sostenibilidad",
      "Onboarding personalizado",
      "Soporte dedicado 24/7",
      "Integraciones corporativas",
      "SLA garantizado",
      "Facturación centralizada",
    ],
    cta: "Contactar ventas",
    popular: false,
    icon: Building,
  },
];

export function Pricing() {
  const router = useRouter();
  const { startCheckout, simulateSubscription } = useSubscription({ planName: "Free" });
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const handlePlanSelect = async (planId: PlanId) => {
    if (planId === "free") {
      router.push("/sign-up");
      return;
    }

    setLoadingPlan(planId);
    try {
      const result = await startCheckout(planId);
      if (result && "demo" in result && result.demo) {
        simulateSubscription(planId);
        toast.success(`¡Plan ${planId} activado!`, {
          description: "Suscripción simulada en modo demo.",
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo iniciar el checkout"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="precios" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14B8A6]/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge className="mb-4 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6]">
            Precios
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Planes claros,{" "}
            <span className="text-gradient">valor real</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Elige el plan que se adapte a tu rutina laboral. Escala cuando lo
            necesites, sin sorpresas.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 pb-12 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "h-full",
                plan.popular && "pt-4 lg:-mt-4 lg:mb-4 lg:pt-0"
              )}
            >
              <Card
                className={cn(
                  "relative flex h-full flex-col justify-between border-white/10 bg-[#1E293B]/50 backdrop-blur-sm transition-all hover:border-[#14B8A6]/30",
                  plan.popular &&
                    "overflow-visible border-[#14B8A6]/40 bg-[#1E293B]/80 shadow-xl shadow-teal-500/10 glow-teal"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-vex px-3 py-0.5 font-semibold text-[#0F172A]">
                      Más popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2">
                    <plan.icon
                      className={cn(
                        "size-5",
                        plan.popular ? "text-[#22D3EE]" : "text-[#14B8A6]"
                      )}
                    />
                    <CardTitle className="text-lg text-white">
                      {plan.name}
                    </CardTitle>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-slate-400">
                        {plan.period}
                      </span>
                    )}
                    {"priceNote" in plan && plan.priceNote && (
                      <span className="ml-1 text-sm text-slate-500">
                        {plan.priceNote}
                      </span>
                    )}
                  </div>
                  <CardDescription className="mt-2 text-slate-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <Check
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            plan.popular ? "text-[#22D3EE]" : "text-[#14B8A6]"
                          )}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto shrink-0">
                  {plan.checkoutUrl ? (
                    <Button
                      className={cn(
                        "w-full font-semibold",
                        plan.popular
                          ? "bg-gradient-vex text-[#0F172A] shadow-lg shadow-teal-500/20 hover:opacity-90"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                      render={
                        <a
                          href={plan.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      className={cn(
                        "w-full font-semibold",
                        plan.popular
                          ? "bg-gradient-vex text-[#0F172A] shadow-lg shadow-teal-500/20 hover:opacity-90"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                      disabled={loadingPlan === plan.planId}
                      onClick={() => void handlePlanSelect(plan.planId)}
                    >
                      {loadingPlan === plan.planId && (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      )}
                      {plan.cta}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-slate-500"
        >
          Greythium Incorporated se reserva el derecho de modificar precios con
          aviso de 30 días.
        </motion.p>
      </div>
    </section>
  );
}
