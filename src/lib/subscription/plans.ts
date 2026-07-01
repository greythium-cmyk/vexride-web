import { isRealEnvValue } from "@/lib/env";

export type PlanId = "free" | "starter" | "pro" | "enterprise";

export type PlanFeature =
  | "unlimited_matches"
  | "vex_ai_priority"
  | "premium_drivers"
  | "match_breakdown"
  | "advanced_stats"
  | "calendar_sync";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceLabel: string;
  priceMonthly: number;
  period: string;
  description: string;
  features: string[];
  stripePriceEnvKey?: string;
  popular?: boolean;
  featureFlags: PlanFeature[];
}

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Freemium",
    priceLabel: "Gratis",
    priceMonthly: 0,
    period: "",
    description: "Ideal para probar la plataforma y descubrir el carpooling inteligente.",
    features: [
      "Matches básicos limitados",
      "Vex AI básico",
      "Funciones esenciales de matching",
      "Perfil de usuario estándar",
    ],
    featureFlags: [],
  },
  {
    id: "starter",
    name: "Starter",
    priceLabel: "$29",
    priceMonthly: 29,
    period: "/mes",
    description: "Para profesionales que necesitan matches ilimitados y sincronización completa.",
    features: [
      "Matches ilimitados",
      "Sincronización con calendario",
      "Vex AI estándar",
      "Historial de viajes",
    ],
    stripePriceEnvKey: "STRIPE_PRICE_STARTER",
    featureFlags: ["unlimited_matches", "calendar_sync", "match_breakdown"],
  },
  {
    id: "pro",
    name: "Pro",
    priceLabel: "$69",
    priceMonthly: 69,
    period: "/mes",
    description: "Experiencia completa con IA predictiva y Vex AI prioritario 24/7.",
    features: [
      "Todo ilimitado",
      "Vex AI prioritario 24/7",
      "IA predictiva avanzada",
      "Premium Driver matching",
      "Estadísticas detalladas",
    ],
    stripePriceEnvKey: "STRIPE_PRICE_PRO",
    popular: true,
    featureFlags: [
      "unlimited_matches",
      "calendar_sync",
      "match_breakdown",
      "vex_ai_priority",
      "premium_drivers",
      "advanced_stats",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceLabel: "$199",
    priceMonthly: 199,
    period: "/mes",
    description: "Solución corporativa con panel admin, reportes ESG y soporte dedicado.",
    features: [
      "Todo en Pro",
      "Panel administrativo",
      "Reportes ESG",
      "Soporte dedicado",
      "SLA empresarial",
    ],
    stripePriceEnvKey: "STRIPE_PRICE_ENTERPRISE",
    featureFlags: [
      "unlimited_matches",
      "calendar_sync",
      "match_breakdown",
      "vex_ai_priority",
      "premium_drivers",
      "advanced_stats",
    ],
  },
];

const PLAN_RANK: Record<PlanId, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

export function normalizePlanId(plan: string | null | undefined): PlanId {
  const key = (plan ?? "free").toLowerCase().trim();
  if (key === "freemium" || key === "free") return "free";
  if (key === "starter") return "starter";
  if (key === "pro") return "pro";
  if (key === "enterprise") return "enterprise";
  return "free";
}

export function getPlan(id: PlanId): PlanDefinition {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function planHasFeature(planId: PlanId, feature: PlanFeature): boolean {
  return getPlan(planId).featureFlags.includes(feature);
}

export function planMeetsMinimum(current: PlanId, required: PlanId): boolean {
  return PLAN_RANK[current] >= PLAN_RANK[required];
}

export function getStripePriceId(planId: PlanId): string | null {
  const plan = getPlan(planId);
  if (!plan.stripePriceEnvKey) return null;

  const envKeys = [
    plan.stripePriceEnvKey,
    plan.stripePriceEnvKey.replace(
      /^STRIPE_PRICE_/,
      "NEXT_PUBLIC_STRIPE_PRICE_"
    ),
  ];

  for (const key of envKeys) {
    const value = process.env[key]?.trim();
    if (isRealEnvValue(value)) return value!;
  }

  return null;
}

export const DEMO_PLAN_STORAGE_KEY = "vexride_demo_plan";

export const STARTER_STRIPE_CHECKOUT_URL =
  "https://buy.stripe.com/00w14n8dy1JMdOE2ligUM05";

const CLIENT_CHECKOUT_ENV_KEYS: Partial<Record<PlanId, string>> = {
  starter: "NEXT_PUBLIC_STRIPE_CHECKOUT_URL_STARTER",
  pro: "NEXT_PUBLIC_STRIPE_CHECKOUT_URL_PRO",
  enterprise: "NEXT_PUBLIC_STRIPE_CHECKOUT_URL_ENTERPRISE",
};

/** Direct Stripe Payment Link for client-side fallback (guest / demo checkout). */
export function getClientStripeCheckoutUrl(planId: PlanId): string | null {
  if (planId === "starter") return STARTER_STRIPE_CHECKOUT_URL;

  const envKey = CLIENT_CHECKOUT_ENV_KEYS[planId];
  if (!envKey) return null;

  const value = process.env[envKey]?.trim();
  return isRealEnvValue(value) ? value! : null;
}
