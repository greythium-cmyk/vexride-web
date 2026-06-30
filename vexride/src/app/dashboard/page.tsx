"use client";

import { Settings } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { WelcomeStats } from "@/components/dashboard/welcome-stats";
import { ActiveTrips } from "@/components/dashboard/active-trips";
import { AvailableMatches } from "@/components/dashboard/available-matches";
import { VexAIPanel } from "@/components/dashboard/vex-ai-panel";
import { StatsHistory } from "@/components/dashboard/stats-history";

function SettingsSection() {
  return (
    <section id="configuracion" className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6">
      <div className="flex items-center gap-3">
        <Settings className="size-5 text-slate-400" />
        <div>
          <h2 className="font-semibold text-white">Configuración</h2>
          <p className="text-sm text-slate-400">
            Preferencias de viaje, notificaciones y cuenta — próximamente con Clerk.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <WelcomeStats />

        <div className="grid gap-8 xl:grid-cols-5">
          <div className="space-y-8 xl:col-span-3">
            <ActiveTrips />
            <AvailableMatches />
          </div>
          <div className="xl:col-span-2">
            <VexAIPanel />
          </div>
        </div>

        <StatsHistory />
        <SettingsSection />
      </div>
    </DashboardShell>
  );
}
