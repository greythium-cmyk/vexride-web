"use client";

import dynamic from "next/dynamic";
import { Navigation } from "lucide-react";

const TripMapDynamic = dynamic(
  () => import("@/components/dashboard/trip-map").then((m) => m.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-36 items-center justify-center rounded-xl border border-white/10 bg-[#0F172A]">
        <Navigation className="size-6 animate-pulse text-[#14B8A6]/50" aria-hidden />
      </div>
    ),
  }
);

interface TripRouteMapProps {
  from: string;
  to: string;
  pickupPoint?: string;
  liveLocation?: { lat?: number; lng?: number; label?: string };
}

export function TripRouteMap(props: TripRouteMapProps) {
  return <TripMapDynamic {...props} />;
}
