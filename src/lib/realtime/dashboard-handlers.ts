import type {
  DashboardData,
  Trip,
  MatchSuggestion,
  Notification,
} from "@/lib/types/dashboard";
import { mapTrip, mapMatch, mapNotification } from "@/lib/supabase/mappers";
import type { Database } from "@/lib/supabase/types";

type TripRow = Database["public"]["Tables"]["trips"]["Row"];
type MatchRow = Database["public"]["Tables"]["matches"]["Row"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

function buildNextTrip(trips: Trip[]): DashboardData["quickStats"]["nextTrip"] {
  const next = trips[0];
  if (!next) {
    return { time: "—", route: "—", driver: "—" };
  }
  return {
    time: `${next.date}, ${next.time}`,
    route: `${next.route.from} → ${next.route.to}`,
    driver: next.driver.name,
  };
}

/** Apply a trip INSERT/UPDATE from realtime payload. */
export function applyTripChange(
  data: DashboardData,
  row: TripRow,
  event: "INSERT" | "UPDATE" | "DELETE"
): { data: DashboardData; tripId?: string } {
  const trip = mapTrip(row);

  if (event === "DELETE") {
    const activeTrips = data.activeTrips.filter((t) => t.id !== row.id);
    return {
      data: {
        ...data,
        activeTrips,
        quickStats: { ...data.quickStats, nextTrip: buildNextTrip(activeTrips) },
      },
    };
  }

  const idx = data.activeTrips.findIndex((t) => t.id === trip.id);
  const activeTrips =
    idx >= 0
      ? data.activeTrips.map((t, i) => (i === idx ? trip : t))
      : [trip, ...data.activeTrips];

  return {
    data: {
      ...data,
      activeTrips,
      quickStats: { ...data.quickStats, nextTrip: buildNextTrip(activeTrips) },
    },
    tripId: trip.id,
  };
}

/** Apply a match change — skip joined matches in available list. */
export function applyMatchChange(
  data: DashboardData,
  row: MatchRow,
  event: "INSERT" | "UPDATE" | "DELETE"
): { data: DashboardData; matchId?: string; isNew?: boolean } {
  if (event === "DELETE" || row.joined) {
    const availableMatches = data.availableMatches.filter((m) => m.id !== row.id);
    return {
      data: {
        ...data,
        availableMatches,
        quickStats: {
          ...data.quickStats,
          weeklyMatches: availableMatches.length,
        },
      },
    };
  }

  const match = mapMatch(row);
  const idx = data.availableMatches.findIndex((m) => m.id === match.id);
  const isNew = event === "INSERT" || idx < 0;
  const availableMatches =
    idx >= 0
      ? data.availableMatches.map((m, i) => (i === idx ? match : m))
      : [match, ...data.availableMatches];

  return {
    data: {
      ...data,
      availableMatches,
      quickStats: {
        ...data.quickStats,
        weeklyMatches: availableMatches.length,
      },
    },
    matchId: match.id,
    isNew,
  };
}

/** Prepend or update a notification. */
export function applyNotificationChange(
  data: DashboardData,
  row: NotificationRow,
  event: "INSERT" | "UPDATE" | "DELETE"
): { data: DashboardData; notificationId?: string } {
  if (event === "DELETE") {
    return {
      data: {
        ...data,
        notifications: data.notifications.filter((n) => n.id !== row.id),
      },
    };
  }

  const notification = mapNotification(row);
  const idx = data.notifications.findIndex((n) => n.id === notification.id);
  const notifications =
    idx >= 0
      ? data.notifications.map((n, i) => (i === idx ? notification : n))
      : [notification, ...data.notifications].slice(0, 20);

  return { data: { ...data, notifications }, notificationId: notification.id };
}

/** Mock trip update for demo mode. */
export function mockUpdateTrip(
  data: DashboardData,
  tripId: string,
  patch: Partial<Pick<Trip, "status" | "matchScore">> & {
    liveLocation?: Trip["liveLocation"];
  }
): DashboardData {
  const activeTrips = data.activeTrips.map((t) =>
    t.id === tripId ? { ...t, ...patch } : t
  );
  return {
    ...data,
    activeTrips,
    quickStats: { ...data.quickStats, nextTrip: buildNextTrip(activeTrips) },
  };
}

/** Mock new match for demo mode. */
export function mockAddMatch(
  data: DashboardData,
  match: MatchSuggestion
): DashboardData {
  if (data.availableMatches.some((m) => m.id === match.id)) return data;
  const availableMatches = [match, ...data.availableMatches];
  return {
    ...data,
    availableMatches,
    quickStats: { ...data.quickStats, weeklyMatches: availableMatches.length },
  };
}

/** Mock notification for demo mode. */
export function mockAddNotification(
  data: DashboardData,
  notification: Notification
): DashboardData {
  return {
    ...data,
    notifications: [notification, ...data.notifications].slice(0, 20),
  };
}
