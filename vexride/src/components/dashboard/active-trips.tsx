"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import {
  activeTrips,
  statusLabels,
  statusColors,
  type Trip,
} from "@/lib/mock-data";

function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const { setSelectedTrip, setChatCompanion } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5 transition-all hover:border-[#14B8A6]/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback
              className={
                trip.driver.premium
                  ? "bg-[#22D3EE]/20 text-[#22D3EE] font-semibold"
                  : "bg-[#14B8A6]/20 text-[#14B8A6] font-semibold"
              }
            >
              {trip.driver.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {trip.driver.name}
              </span>
              {trip.driver.premium && (
                <Star className="size-3.5 text-[#22D3EE]" fill="currentColor" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Star className="size-3 text-amber-400" fill="currentColor" />
              {trip.driver.rating}
              {trip.vehicle && (
                <span className="ml-1 text-slate-500">· {trip.vehicle}</span>
              )}
            </div>
          </div>
        </div>
        <Badge
          className={`border ${statusColors[trip.status]}`}
        >
          {statusLabels[trip.status]}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <div className="flex-1">
          <p className="font-medium text-white">{trip.route.from}</p>
          <div className="my-1 flex items-center gap-1 text-slate-500">
            <div className="h-4 w-px bg-gradient-to-b from-[#14B8A6] to-[#22D3EE]" />
          </div>
          <p className="font-medium text-white">{trip.route.to}</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-slate-600" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          {trip.date} · {trip.time}
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3.5" />
          {trip.passengers} pasajeros
        </span>
        <span className="font-semibold text-[#14B8A6]">
          {trip.matchScore}% match
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
          onClick={() => setSelectedTrip(trip)}
        >
          Ver detalles
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/10 text-slate-300 hover:bg-white/5"
          onClick={() =>
            setChatCompanion({
              name: trip.driver.name,
              avatar: trip.driver.avatar,
            })
          }
        >
          <MessageCircle className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export function ActiveTrips() {
  return (
    <section id="viajes">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Viajes activos / Próximos
          </h2>
          <p className="text-sm text-slate-400">
            {activeTrips.length} viajes programados
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {activeTrips.map((trip, i) => (
          <TripCard key={trip.id} trip={trip} index={i} />
        ))}
      </div>
    </section>
  );
}
