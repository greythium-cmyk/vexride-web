"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEMO_PLAN_STORAGE_KEY,
  getPlan,
  normalizePlanId,
  planHasFeature,
  planMeetsMinimum,
  type PlanFeature,
  type PlanId,
} from "@/lib/subscription/plans";
import { isStripeClientConfigured } from "@/lib/env";
import { loadStripe } from "@stripe/stripe-js";

interface UseSubscriptionOptions {
  planName: string;
}

export function useSubscription({ planName }: UseSubscriptionOptions) {
  const [demoPlanOverride, setDemoPlanOverride] = useState<PlanId | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_PLAN_STORAGE_KEY);
    if (stored) setDemoPlanOverride(normalizePlanId(stored));
  }, []);

  const planId = useMemo(() => {
    if (demoPlanOverride) return demoPlanOverride;
    return normalizePlanId(planName);
  }, [demoPlanOverride, planName]);

  const plan = useMemo(() => getPlan(planId), [planId]);

  const hasFeature = useCallback(
    (feature: PlanFeature) => planHasFeature(planId, feature),
    [planId]
  );

  const meetsMinimum = useCallback(
    (required: PlanId) => planMeetsMinimum(planId, required),
    [planId]
  );

  const isPro = planId === "pro" || planId === "enterprise";
  const isPaid = planId !== "free";

  const simulateSubscription = useCallback((targetPlan: PlanId = "pro") => {
    localStorage.setItem(DEMO_PLAN_STORAGE_KEY, targetPlan);
    setDemoPlanOverride(targetPlan);
    window.dispatchEvent(new CustomEvent("vexride:plan-updated", { detail: targetPlan }));
  }, []);

  const resetDemoPlan = useCallback(() => {
    localStorage.removeItem(DEMO_PLAN_STORAGE_KEY);
    setDemoPlanOverride(null);
  }, []);

  const startCheckout = useCallback(async (targetPlan: PlanId) => {
    if (targetPlan === "free") return;

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: targetPlan }),
    });
    const data = (await res.json()) as { url?: string; demo?: boolean; planId?: PlanId };

    if (data.demo) {
      simulateSubscription(data.planId ?? targetPlan);
      return { demo: true as const, planId: data.planId ?? targetPlan };
    }

    if (data.url) {
      if (isStripeClientConfigured()) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (stripe) {
          window.location.href = data.url;
          return { redirect: true as const };
        }
      }
      window.location.href = data.url;
      return { redirect: true as const };
    }

    throw new Error("Checkout failed");
  }, [simulateSubscription]);

  const openBillingPortal = useCallback(async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = (await res.json()) as { url?: string; demo?: boolean };
    if (data.demo) return { demo: true as const };
    if (data.url) {
      window.location.href = data.url;
      return { redirect: true as const };
    }
    throw new Error("Portal unavailable");
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<PlanId>).detail;
      if (detail) setDemoPlanOverride(detail);
    };
    window.addEventListener("vexride:plan-updated", handler);
    return () => window.removeEventListener("vexride:plan-updated", handler);
  }, []);

  return {
    planId,
    plan,
    planLabel: plan.name,
    isPro,
    isPaid,
    hasFeature,
    meetsMinimum,
    simulateSubscription,
    resetDemoPlan,
    startCheckout,
    openBillingPortal,
    isDemoOverride: demoPlanOverride !== null,
  };
}
