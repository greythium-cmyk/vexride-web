"use client";

import {
  Calendar,
  Car,
  Clock,
  MapPin,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { statusLabels, statusColors } from "@/lib/mock-data";

export function TripDetailModal() {
  const { selectedTrip, setSelectedTrip, setChatCompanion } = useDashboard();

  if (!selectedTrip) return null;

  const trip = selectedTrip;

  return (
    <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
      <DialogContent className="border-white/10 bg-[#1E293B] sm:max-w-md">
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
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">
                  {trip.driver.name}
                </span>
                {trip.driver.premium && (
                  <Star className="size-4 text-[#22D3EE]" fill="currentColor" />
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Star className="size-3.5 text-amber-400" fill="currentColor" />
                {trip.driver.rating} · Conductor
              </div>
            </div>
            <Badge
              className={`ml-auto border ${statusColors[trip.status]}`}
            >
              {statusLabels[trip.status]}
            </Badge>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#14B8A6]" />
              <div>
                <p className="text-sm font-medium text-white">
                  {trip.route.from}
                </p>
                <div className="my-2 ml-1.5 h-6 w-px bg-gradient-to-b from-[#14B8A6] to-[#22D3EE]" />
                <p className="text-sm font-medium text-white">
                  {trip.route.to}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Calendar className="size-4 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-white">{trip.date}</p>
              <p className="text-xs text-slate-500">Fecha</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Clock className="size-4 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-white">{trip.time}</p>
              <p className="text-xs text-slate-500">Hora de salida</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Users className="size-4 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-white">
                {trip.passengers}
              </p>
              <p className="text-xs text-slate-500">Pasajeros</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Car className="size-4 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-[#14B8A6]">
                {trip.matchScore}%
              </p>
              <p className="text-xs text-slate-500">Match score</p>
            </div>
          </div>

          {trip.vehicle && (
            <p className="text-sm text-slate-400">
              Vehículo:{" "}
              <span className="text-white">{trip.vehicle}</span>
            </p>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gradient-vex font-semibold text-[#0F172A] hover:opacity-90"
              onClick={() => {
                setSelectedTrip(null);
                setChatCompanion({
                  name: trip.driver.name,
                  avatar: trip.driver.avatar,
                });
              }}
            >
              <MessageCircle className="size-4" />
              Chatear con conductor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
