"use client";

import {
  Calendar,
  Car,
  Clock,
  MapPin,
  MessageCircle,
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
import { TripRouteMap } from "@/components/dashboard/trip-route-map";
import { PlanGate } from "@/components/subscription/plan-gate";
import { useSubscription } from "@/hooks/use-subscription";

export function TripDetailModal() {
  const { selectedTrip, setSelectedTrip, setChatCompanion, data } = useDashboard();
  const { hasFeature } = useSubscription({ planName: data.user.plan });

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

          <TripRouteMap
            from={trip.route.from}
            to={trip.route.to}
            pickupPoint={trip.pickupPoint}
            liveLocation={trip.liveLocation}
          />

          <PlanGate
            allowed={hasFeature("match_breakdown")}
            requiredPlan="starter"
            featureLabel="Desglose de match IA"
          >
            <MatchBreakdownChart
              breakdown={trip.matchBreakdown}
              totalScore={trip.matchScore}
            />
          </PlanGate>

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
