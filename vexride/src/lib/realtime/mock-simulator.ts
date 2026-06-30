import type { Dispatch, SetStateAction } from "react";
import type { DashboardData, MatchSuggestion, Notification } from "@/lib/types/dashboard";
import {
  mockUpdateTrip,
  mockAddMatch,
  mockAddNotification,
} from "@/lib/realtime/dashboard-handlers";

type SetData = Dispatch<SetStateAction<DashboardData>>;
type OnHighlight = (type: "trip" | "match" | "notification", id: string) => void;

const DEMO_MATCHES: MatchSuggestion[] = [
  {
    id: "demo-match-rt-1",
    driver: { name: "Elena V.", avatar: "EV", rating: 4.91, premium: false },
    route: { from: "DUMBO", to: "Times Square" },
    time: "8:22 AM",
    matchScore: 95,
    savings: "$14",
    co2Saved: "2.3 kg",
  },
  {
    id: "demo-match-rt-2",
    driver: { name: "Marcus W.", avatar: "MW", rating: 4.88, premium: true },
    route: { from: "Long Island City", to: "Hudson Yards" },
    time: "8:12 AM",
    matchScore: 97,
    savings: "$16",
    co2Saved: "2.5 kg",
  },
];

const LOCATION_UPDATES = [
  "Atlantic Ave & Hicks St",
  "Brooklyn Bridge approach",
  "FDR Drive — mile 2",
  "Midtown tunnel exit",
];

/**
 * Simulates Supabase Realtime in demo mode with periodic updates.
 */
export function startMockRealtimeSimulator(
  setData: SetData,
  onHighlight: OnHighlight
): () => void {
  let matchIndex = 0;
  let locIndex = 0;
  let tick = 0;

  const interval = setInterval(() => {
    tick += 1;

    setData((prev) => {
      if (prev.activeTrips.length === 0) return prev;

      const trip = prev.activeTrips[tick % prev.activeTrips.length];
      const statuses = ["confirmed", "in-progress", "pending"] as const;
      const nextStatus = statuses[tick % statuses.length];

      let next = mockUpdateTrip(prev, trip.id, {
        matchScore: Math.min(99, trip.matchScore + (tick % 2 === 0 ? 1 : 0)),
        status: nextStatus,
        liveLocation: {
          label: LOCATION_UPDATES[locIndex % LOCATION_UPDATES.length],
        },
      });

      locIndex += 1;
      onHighlight("trip", trip.id);
      return next;
    });

    // New match every 3 ticks (~45s)
    if (tick % 3 === 0 && matchIndex < DEMO_MATCHES.length) {
      const match = DEMO_MATCHES[matchIndex];
      matchIndex += 1;
      setData((prev) => mockAddMatch(prev, match));
      onHighlight("match", match.id);
    }

    // Notification every 4 ticks (~60s)
    if (tick % 4 === 0) {
      const id = `demo-notif-${Date.now()}`;
      const notification: Notification = {
        id,
        title: "Actualización en vivo",
        message: "Vexride detectó un cambio en tu ruta (modo demo)",
        time: "Ahora",
        unread: true,
      };
      setData((prev) => mockAddNotification(prev, notification));
      onHighlight("notification", id);
    }
  }, 15000);

  return () => clearInterval(interval);
}
