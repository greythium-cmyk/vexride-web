"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  Bot,
  Car,
  Home,
  Settings,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/mock-data";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { isClerkConfigured } from "@/lib/env";
import { useSubscription } from "@/hooks/use-subscription";

const iconMap = { Home, Car, Users, Bot, BarChart3, Settings };

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data, source } = useDashboard();
  const { planLabel, isPro } = useSubscription({ planName: data.user.plan });

  const content = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50 rounded-lg">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-vex shadow-lg shadow-teal-500/20">
            <Zap className="size-5 text-[#0F172A]" fill="currentColor" />
          </div>
          <div>
            <span className="text-base font-bold text-white">Vexride</span>
            <Badge className="ml-2 border-[#14B8A6]/30 bg-[#14B8A6]/10 px-1.5 py-0 text-[10px] text-[#14B8A6]">
              {planLabel}
            </Badge>
          </div>
        </Link>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {source === "mock" && (
        <div className="mx-3 mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[10px] text-amber-400">
          Modo demo — conecta Supabase para datos en vivo
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navegación principal">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = item.href === "/dashboard" && pathname === "/dashboard";

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50",
                isActive
                  ? "bg-gradient-vex text-[#0F172A] shadow-lg shadow-teal-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-4">
          <p className="text-xs font-medium text-[#14B8A6]">Plan {planLabel} activo</p>
          <p className="mt-1 text-xs text-slate-400">
            {isPro ? "Vex AI prioritario 24/7" : "Actualiza a Pro para IA avanzada"}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-gradient-vex transition-all duration-700" />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">18 de 24 viajes este mes</p>
        </div>
        {isClerkConfigured() && (
          <div className="mt-3 flex items-center gap-2 px-1">
            <UserButton
              appearance={{
                elements: { avatarBox: "size-8" },
              }}
            />
            <span className="truncate text-xs text-slate-400">{data.user.email}</span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0B1120]/95 backdrop-blur-xl lg:flex">
        {content}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onMobileClose} aria-hidden />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0B1120] transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        {content}
      </aside>
    </>
  );
}
