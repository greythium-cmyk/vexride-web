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
  PRO_STRIPE_CHECKOUT_URL,
  STARTER_STRIPE_CHECKOUT_URL,
  STRIPE_PLAN_LINK_STYLE,
  type PlanId,
} from "@/lib/subscription/plans";

const plans: Array<{
  planId: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  icon: typeof Sparkles;
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
    popular: false,
    icon: Sparkles,
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
    popular: true,
    icon: Crown,
  },
  {
    planId: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "/mes",
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
    popular: false,
    icon: Building,
  },
];

export function Pricing() {
  return (
    <section id="precios" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14B8A6]/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
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
        </div>

        <div className="relative z-10 mt-16 grid gap-6 pb-12 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
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
                  <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
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

                {plan.planId === "free" && (
                  <a href="/sign-up">Comenzar gratis</a>
                )}
                {plan.planId === "starter" && (
                  <a href={STARTER_STRIPE_CHECKOUT_URL} style={STRIPE_PLAN_LINK_STYLE}>
                    Elegir Starter
                  </a>
                )}
                {plan.planId === "pro" && (
                  <a
                    href={PRO_STRIPE_CHECKOUT_URL}
                    style={{
                      display: "block",
                      padding: "16px",
                      background: "#00ffff",
                      color: "#000",
                      textAlign: "center",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Elegir Pro
                  </a>
                )}
                {plan.planId === "enterprise" && (
                  <a
                    href={ENTERPRISE_STRIPE_CHECKOUT_URL}
                    style={{
                      display: "block",
                      padding: "16px",
                      background: "#00ffff",
                      color: "#000",
                      textAlign: "center",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Elegir Enterprise
                  </a>
                )}
              </Card>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          Greythium Incorporated se reserva el derecho de modificar precios con
          aviso de 30 días.
        </p>
      </div>
    </section>
  );
}
