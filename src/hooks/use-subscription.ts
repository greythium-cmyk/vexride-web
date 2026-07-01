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

    const raw = await res.text();
    let data: {
      url?: string;
      demo?: boolean;
      planId?: PlanId;
      error?: string;
    } = {};

    if (raw) {
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        throw new Error("Respuesta inválida del servidor de checkout");
      }
    }

    if (res.status === 401) {
      const returnUrl = window.location.href;
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`;
      return { authRequired: true as const };
    }

    if (!res.ok) {
      throw new Error(data.error ?? "No se pudo iniciar el checkout");
    }

    if (data.demo) {
      simulateSubscription(data.planId ?? targetPlan);
      return { demo: true as const, planId: data.planId ?? targetPlan };
    }

    if (data.url) {
      window.location.href = data.url;
      return { redirect: true as const };
    }

    throw new Error(data.error ?? "No se pudo iniciar el checkout");
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
