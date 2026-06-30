"use client";

import {
  Calendar,
  Car,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { MatchBreakdownChart } from "@/components/dashboard/ui/match-breakdown";

function MapPlaceholder({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0F172A]">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative flex h-36 flex-col items-center justify-center gap-2 p-4">
        <Navigation className="size-8 text-[#14B8A6]/50" aria-hidden />
        <div className="text-center">
          <p className="text-xs text-slate-500">Vista de ruta</p>
          <p className="mt-1 text-sm font-medium text-white">
            {from} → {to}
          </p>
        </div>
        <div className="absolute left-4 top-4 size-2 rounded-full bg-[#14B8A6] shadow-lg shadow-teal-500/50" />
        <div className="absolute bottom-4 right-4 size-2 rounded-full bg-[#22D3EE] shadow-lg shadow-cyan-500/50" />
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <path
            d="M 40 40 Q 120 80 200 100"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function TripDetailModal() {
  const { selectedTrip, setSelectedTrip, setChatCompanion } = useDashboard();

  if (!selectedTrip) return null;

  const trip = selectedTrip;

  return (
    <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#1E293B] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Detalles del viaje</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback
                className={
                  trip.driver.premium
                    ? "bg-[#22D3EE]/20 text-lg font-bold text-[#22D3EE]"
                    : "bg-[#14B8A6]/20 text-lg font-bold text-[#14B8A6]"
                }
              >
                {trip.driver.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">{trip.driver.name}</span>
                {trip.driver.premium && (
                  <Star className="size-4 text-[#22D3EE]" fill="currentColor" aria-label="Premium" />
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Star className="size-3.5 text-amber-400" fill="currentColor" aria-hidden />
                {trip.driver.rating} · Conductor verificado
              </div>
            </div>
            <StatusBadge status={trip.status} pulse={trip.status === "in-progress"} />
          </div>

          <MapPlaceholder from={trip.route.from} to={trip.route.to} />

          <MatchBreakdownChart
            breakdown={trip.matchBreakdown}
            totalScore={trip.matchScore}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Calendar className="size-4 text-slate-400" aria-hidden />
              <p className="mt-2 text-sm font-medium text-white">{trip.date}</p>
              <p className="text-xs text-slate-500">Fecha</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Clock className="size-4 text-slate-400" aria-hidden />
              <p className="mt-2 text-sm font-medium text-white">{trip.time}</p>
              <p className="text-xs text-slate-500">
                {trip.estimatedDuration ? `~${trip.estimatedDuration}` : "Salida"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Users className="size-4 text-slate-400" aria-hidden />
              <p className="mt-2 text-sm font-medium text-white">{trip.passengers}</p>
              <p className="text-xs text-slate-500">Pasajeros</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Car className="size-4 text-slate-400" aria-hidden />
              <p className="mt-2 text-sm font-medium text-white truncate">
                {trip.vehicle ?? "—"}
              </p>
              <p className="text-xs text-slate-500">Vehículo</p>
            </div>
          </div>

          {trip.pickupPoint && (
            <div className="flex items-start gap-2 rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#14B8A6]" aria-hidden />
              <div>
                <p className="font-medium text-white">Punto de encuentro</p>
                <p className="text-slate-400">{trip.pickupPoint}</p>
              </div>
            </div>
          )}

          <Separator className="bg-white/10" />

          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-gradient-vex font-semibold text-[#0F172A] hover:opacity-90"
              onClick={() => {
                setSelectedTrip(null);
                setChatCompanion({ name: trip.driver.name, avatar: trip.driver.avatar });
              }}
            >
              <MessageCircle className="size-4" aria-hidden />
              Chat
            </Button>
            <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
              <Phone className="size-4" aria-hidden />
              Llamar
            </Button>
            <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
              <Share2 className="size-4" aria-hidden />
              Compartir
            </Button>
            <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
              <XCircle className="size-4" aria-hidden />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
