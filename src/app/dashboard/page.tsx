"use client";

import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Loader2 } from "lucide-react";

function DashboardFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-[#14B8A6]" aria-hidden />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<DashboardFallback />}>
        <DashboardContent />
      </Suspense>
    </DashboardShell>
  );
}
