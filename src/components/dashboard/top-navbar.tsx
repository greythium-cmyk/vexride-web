"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Bell, Menu, Search, ChevronDown, Database, Radio } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { isClerkConfigured } from "@/lib/env";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { data, source, realtimeStatus, newNotificationIds } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = data.notifications.filter((n) => n.unread).length;
  const hasNewPulse = newNotificationIds.size > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2.5 text-slate-400 hover:bg-white/5 lg:hidden focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="size-5" />
        </button>

        <div className="relative hidden flex-1 max-w-md sm:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden />
          <Input
            placeholder="Buscar viajes, matches, rutas..."
            className="h-10 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus-visible:border-[#14B8A6]/50 focus-visible:ring-[#14B8A6]/20"
            aria-label="Buscar en el dashboard"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Badge
                  variant="outline"
                  className="hidden border-white/10 text-slate-500 sm:flex"
                />
              }
            >
              <Database className="size-3" />
              {source === "supabase"
                ? realtimeStatus === "connected"
                  ? "Live"
                  : "Sync"
                : "Demo"}
            </TooltipTrigger>
            <TooltipContent>
              {source === "supabase"
                ? realtimeStatus === "connected"
                  ? "Supabase Realtime conectado"
                  : "Conectando a Supabase Realtime…"
                : "Demo en vivo simulado — configura Supabase para datos reales"}
            </TooltipContent>
          </Tooltip>

          {realtimeStatus === "connected" && (
            <span className="hidden items-center gap-1 text-[10px] text-[#14B8A6] sm:flex">
              <Radio className="size-3 animate-pulse" aria-hidden />
              RT
            </span>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className={cn(
                "relative rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50",
                hasNewPulse && "animate-pulse"
              )}
              aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ""}`}
              aria-expanded={showNotifications}
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-[#14B8A6] text-[10px] font-bold text-[#0F172A]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} aria-hidden />
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#1E293B] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="border-b border-white/10 px-4 py-3">
                    <h3 className="font-semibold text-white">Notificaciones</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {data.notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5",
                          (n.unread || newNotificationIds.has(n.id)) && "bg-[#14B8A6]/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white">{n.title}</p>
                          {n.unread && <span className="size-2 shrink-0 rounded-full bg-[#14B8A6]" aria-label="No leída" />}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">{n.message}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {isClerkConfigured() ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-9 ring-2 ring-white/10",
                },
              }}
            />
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50"
                aria-expanded={showProfile}
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-gradient-vex text-xs font-bold text-[#0F172A]">
                    {data.user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-white leading-none">{data.user.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Plan {data.user.plan}</p>
                </div>
                <ChevronDown className="hidden size-4 text-slate-500 sm:block" />
              </button>

              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} aria-hidden />
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#1E293B] shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="font-medium text-white">{data.user.name}</p>
                      <p className="text-xs text-slate-400">{data.user.email}</p>
                      <Badge className="mt-2 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6]">
                        ★ {data.user.rating} rating
                      </Badge>
                    </div>
                    <div className="p-2">
                      <Link href="/dashboard#configuracion" onClick={() => setShowProfile(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                        Configuración
                      </Link>
                      <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                        Volver al sitio
                      </Link>
                      <Link href="/sign-in" className="block rounded-lg px-3 py-2 text-sm text-[#14B8A6] hover:bg-white/5">
                        Iniciar sesión
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
