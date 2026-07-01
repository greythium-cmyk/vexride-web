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

function resolveStripePaymentLink(
  envValue: string | undefined,
  fallbackPath: string
): string {
  const trimmed = envValue?.trim();
  if (trimmed && trimmed.startsWith("https://buy.stripe.com/")) {
    return trimmed;
  }
  return fallbackPath;
}

/** Stripe Payment Links — set NEXT_PUBLIC_* in Vercel, or use /api/stripe/pay/* fallback. */
export const PRO_STRIPE_CHECKOUT_URL = resolveStripePaymentLink(
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL_PRO,
  "/api/stripe/pay/pro"
);

export const ENTERPRISE_STRIPE_CHECKOUT_URL = resolveStripePaymentLink(
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL_ENTERPRISE,
  "/api/stripe/pay/enterprise"
);

export const STRIPE_PLAN_LINK_STYLE = {
  display: "block",
  padding: "16px",
  background: "#00ffff",
  color: "#000",
  textAlign: "center" as const,
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
};

/** Guest checkout success URL for Stripe Payment Links (configure in Stripe Dashboard). */
export const GUEST_CHECKOUT_SIGNUP_SUCCESS_URL =
  "/sign-up?session_id={CHECKOUT_SESSION_ID}";

export const PLAN_CHECKOUT_LINKS: Record<
  PlanId,
  { href: string; label: string; external?: boolean }
> = {
  free: { href: "/sign-up", label: "Comenzar gratis" },
  starter: {
    href:
      process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL_STARTER ??
      STARTER_STRIPE_CHECKOUT_URL,
    label: "Elegir Starter",
    external: true,
  },
  pro: {
    href: PRO_STRIPE_CHECKOUT_URL,
    label: "Elegir Pro",
    external: true,
  },
  enterprise: {
    href: ENTERPRISE_STRIPE_CHECKOUT_URL,
    label: "Elegir Enterprise",
    external: true,
  },
};

export const PLAN_ANCHOR_STYLE = { display: "block", cursor: "pointer" } as const;

export function getPlanAnchorHref(planId: PlanId): string {
  if (planId === "free") return "/sign-up";

  if (planId === "starter") {
    return (
      process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL_STARTER ??
      STARTER_STRIPE_CHECKOUT_URL
    );
  }

  if (planId === "pro") {
    return PRO_STRIPE_CHECKOUT_URL;
  }

  return ENTERPRISE_STRIPE_CHECKOUT_URL;
}

/** @deprecated Use getPlanAnchorHref — kept for checkout hook fallback */
export function getClientStripeCheckoutUrl(planId: PlanId): string | null {
  if (planId === "free") return null;
  const href = getPlanAnchorHref(planId);
  return href.startsWith("#") ? null : href;
}
