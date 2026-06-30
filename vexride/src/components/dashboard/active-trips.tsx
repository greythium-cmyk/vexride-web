"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  MessageCircle,
  Star,
  Users,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { TripCardSkeleton } from "@/components/dashboard/ui/skeletons";
import { EmptyState } from "@/components/dashboard/ui/empty-state";
import type { Trip } from "@/lib/types/dashboard";

function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const { setSelectedTrip, setChatCompanion } = useDashboard();

  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5 transition-all hover:border-[#14B8A6]/30 hover:shadow-lg hover:shadow-teal-500/5"
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
              <span className="font-semibold text-white">{trip.driver.name}</span>
              {trip.driver.premium && (
                <Star className="size-3.5 text-[#22D3EE]" fill="currentColor" aria-label="Premium Driver" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Star className="size-3 text-amber-400" fill="currentColor" aria-hidden />
              {trip.driver.rating}
              {trip.vehicle && <span className="ml-1 text-slate-500">· {trip.vehicle}</span>}
            </div>
          </div>
        </div>
        <StatusBadge status={trip.status} pulse={trip.status === "in-progress"} />
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <div className="flex-1">
          <p className="font-medium text-white">{trip.route.from}</p>
          <div className="my-1 flex items-center gap-1 text-slate-500" aria-hidden>
            <div className="h-4 w-px bg-gradient-to-b from-[#14B8A6] to-[#22D3EE]" />
          </div>
          <p className="font-medium text-white">{trip.route.to}</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden />
          {trip.date} · {trip.time}
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3.5" aria-hidden />
          {trip.passengers} pasajeros
        </span>
        <span className="font-semibold text-[#14B8A6]">{trip.matchScore}% match</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-[#14B8A6]/50"
          onClick={() => setSelectedTrip(trip)}
        >
          Ver detalles
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/10 text-slate-300 hover:bg-white/5 focus-visible:ring-[#14B8A6]/50"
          onClick={() => setChatCompanion({ name: trip.driver.name, avatar: trip.driver.avatar })}
          aria-label={`Chatear con ${trip.driver.name}`}
        >
          <MessageCircle className="size-4" />
        </Button>
      </div>
    </motion.article>
  );
}

export function ActiveTrips() {
  const { data, loading, setShowNewCarpoolModal, setNewCarpoolMode } = useDashboard();
  const trips = data.activeTrips;

  return (
    <section id="viajes" aria-labelledby="viajes-heading">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 id="viajes-heading" className="text-lg font-semibold text-white">
            Viajes activos / Próximos
          </h2>
          <p className="text-sm text-slate-400">{trips.length} viajes programados</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1" aria-busy="true">
          {Array.from({ length: 2 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Car}
          title="Sin viajes programados"
          description="Busca un carpool o ofrece tu ruta para empezar a ahorrar tiempo y dinero."
          actionLabel="Buscar carpool"
          onAction={() => {
            setNewCarpoolMode("search");
            setShowNewCarpoolModal(true);
          }}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
          {trips.map((trip, i) => (
            <TripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
