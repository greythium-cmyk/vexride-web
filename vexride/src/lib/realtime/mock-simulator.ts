import type { Dispatch, SetStateAction } from "react";
import type { DashboardData, MatchSuggestion, Notification } from "@/lib/types/dashboard";
import {
  mockUpdateTrip,
  mockAddMatch,
  mockAddNotification,
} from "@/lib/realtime/dashboard-handlers";
import { showDemoSimulatedToast } from "@/lib/realtime/realtime-toasts";

type SetData = Dispatch<SetStateAction<DashboardData>>;
type OnHighlight = (type: "trip" | "match" | "notification", id: string) => void;
type OnLiveEvent = (
  type: "trip" | "match" | "notification",
  payload: { title: string; description?: string }
) => void;

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

let manualMatchIndex = 0;
let manualLocIndex = 0;

/**
 * Applies a single simulated realtime burst (for demo button or interval).
 */
export function applyMockRealtimeTick(
  setData: SetData,
  onHighlight: OnHighlight,
  onLiveEvent?: OnLiveEvent,
  options?: { includeMatch?: boolean; includeNotification?: boolean }
): void {
  const includeMatch = options?.includeMatch ?? manualMatchIndex % 3 === 0;
  const includeNotification = options?.includeNotification ?? true;

  setData((prev) => {
    if (prev.activeTrips.length === 0) return prev;

    const trip = prev.activeTrips[manualLocIndex % prev.activeTrips.length];
    const statuses = ["confirmed", "in-progress", "pending"] as const;
    const nextStatus = statuses[manualLocIndex % statuses.length];
    const location = LOCATION_UPDATES[manualLocIndex % LOCATION_UPDATES.length];

    manualLocIndex += 1;

    onHighlight("trip", trip.id);
    onLiveEvent?.("trip", {
      title: "Viaje actualizado",
      description: `${trip.route.from} → ${trip.route.to} · ${location}`,
    });

    return mockUpdateTrip(prev, trip.id, {
      matchScore: Math.min(99, trip.matchScore + 1),
      status: nextStatus,
      liveLocation: { label: location },
    });
  });

  if (includeMatch && manualMatchIndex < DEMO_MATCHES.length + 5) {
    const match =
      DEMO_MATCHES[manualMatchIndex % DEMO_MATCHES.length] ?? {
        ...DEMO_MATCHES[0],
        id: `demo-match-manual-${Date.now()}`,
      };
    manualMatchIndex += 1;
    setData((prev) => mockAddMatch(prev, match));
    onHighlight("match", match.id);
    onLiveEvent?.("match", {
      title: "Nuevo match disponible",
      description: `${match.driver.name} · ${match.route.from} → ${match.route.to}`,
    });
  }

  if (includeNotification) {
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
    onLiveEvent?.("notification", {
      title: notification.title,
      description: notification.message,
    });
  }
}

/** Manual trigger for demo presentations. */
export function triggerDemoRealtimeChange(
  setData: SetData,
  onHighlight: OnHighlight
): void {
  applyMockRealtimeTick(setData, onHighlight, undefined, {
    includeMatch: true,
    includeNotification: true,
  });
  showDemoSimulatedToast();
}

/**
 * Simulates Supabase Realtime in demo mode with periodic updates.
 */
export function startMockRealtimeSimulator(
  setData: SetData,
  onHighlight: OnHighlight,
  onLiveEvent?: OnLiveEvent
): () => void {
  let tick = 0;

  const interval = setInterval(() => {
    tick += 1;
    applyMockRealtimeTick(setData, onHighlight, onLiveEvent, {
      includeMatch: tick % 3 === 0,
      includeNotification: tick % 4 === 0,
    });
  }, 15000);

  return () => clearInterval(interval);
}
