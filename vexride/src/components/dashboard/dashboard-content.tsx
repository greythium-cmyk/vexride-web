"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PullToRefresh } from "@/components/dashboard/pull-to-refresh";
import { RealtimeSyncBanner } from "@/components/dashboard/realtime-sync-banner";
import { SupabaseFallbackBanner } from "@/components/dashboard/supabase-fallback-banner";
import { WelcomeStats } from "@/components/dashboard/welcome-stats";
import { ActiveTrips } from "@/components/dashboard/active-trips";
import { AvailableMatches } from "@/components/dashboard/available-matches";
import { VexAIPanel } from "@/components/dashboard/vex-ai-panel";
import { StatsHistory } from "@/components/dashboard/stats-history";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { showRefreshToast } from "@/lib/realtime/realtime-toasts";
import { useSubscription } from "@/hooks/use-subscription";
import { normalizePlanId, type PlanId } from "@/lib/subscription/plans";

export function DashboardContent() {
  const { reload } = useDashboard();
  const { simulateSubscription } = useSubscription({ planName: "Free" });
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const plan = searchParams.get("plan");
    if (checkout === "success" && plan) {
      const planId = normalizePlanId(plan) as PlanId;
      simulateSubscription(planId);
      toast.success("¡Suscripción activada!", { description: `Plan ${planId} confirmado.` });
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams, simulateSubscription]);

  const handleRefresh = async () => {
    await reload();
    showRefreshToast();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="mx-auto max-w-7xl space-y-8">
        <SupabaseFallbackBanner />
        <RealtimeSyncBanner />
        <WelcomeStats />

        <div className="grid gap-8 xl:grid-cols-5">
          <div className="space-y-8 xl:col-span-3">
            <ActiveTrips />
            <AvailableMatches />
          </div>
          <div className="xl:col-span-2 xl:sticky xl:top-24 xl:self-start">
            <VexAIPanel />
          </div>
        </div>

        <StatsHistory />
        <SettingsSection />
      </div>
    </PullToRefresh>
  );
}
