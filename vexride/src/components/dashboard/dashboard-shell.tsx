"use client";

import { useState } from "react";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { TripDetailModal } from "@/components/dashboard/trip-detail-modal";
import { CompanionChatModal } from "@/components/dashboard/companion-chat-modal";
import { NewCarpoolModal } from "@/components/dashboard/new-carpool-modal";
import { FloatingActionButton } from "@/components/dashboard/floating-action-button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#0F172A]">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div className="lg:pl-64">
          <TopNavbar onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 pb-24 lg:p-6">{children}</main>
        </div>

        <FloatingActionButton />
        <TripDetailModal />
        <CompanionChatModal />
        <NewCarpoolModal />
      </div>
    </DashboardProvider>
  );
}
