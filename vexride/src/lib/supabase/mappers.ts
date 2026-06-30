import type { Database } from "@/lib/supabase/types";
import type {
  Trip,
  MatchSuggestion,
  Notification,
  TripStatus,
} from "@/lib/types/dashboard";

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.floor(hours / 24)} d`;
}

export function mapTrip(row: Database["public"]["Tables"]["trips"]["Row"]): Trip {
  const extended = row as Database["public"]["Tables"]["trips"]["Row"] & {
    location_label?: string | null;
    driver_lat?: number | null;
    driver_lng?: number | null;
  };

  return {
    id: row.id,
    driver: {
      name: row.driver_name,
      avatar: row.driver_avatar,
      rating: Number(row.driver_rating),
      premium: row.driver_premium,
    },
    route: { from: row.route_from, to: row.route_to },
    date: row.trip_date,
    time: row.trip_time,
    status: row.status as TripStatus,
    passengers: row.passengers,
    matchScore: row.match_score,
    vehicle: row.vehicle ?? undefined,
    pickupPoint: extended.location_label ?? undefined,
    liveLocation:
      extended.location_label || extended.driver_lat
        ? {
            label: extended.location_label ?? "En ruta",
            lat: extended.driver_lat ?? undefined,
            lng: extended.driver_lng ?? undefined,
          }
        : undefined,
  };
}

export function mapMatch(
  row: Database["public"]["Tables"]["matches"]["Row"]
): MatchSuggestion {
  return {
    id: row.id,
    driver: {
      name: row.driver_name,
      avatar: row.driver_avatar,
      rating: Number(row.driver_rating),
      premium: row.driver_premium,
    },
    route: { from: row.route_from, to: row.route_to },
    time: row.match_time,
    matchScore: row.match_score,
    savings: row.savings,
    co2Saved: row.co2_saved,
  };
}

export function mapNotification(
  row: Database["public"]["Tables"]["notifications"]["Row"]
): Notification {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    time: formatRelativeTime(row.created_at),
    unread: row.unread,
  };
}

export interface CompanionMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  createdAt: string;
}

export function mapCompanionMessage(
  row: Database["public"]["Tables"]["chat_messages"]["Row"]
): CompanionMessage {
  return {
    id: row.id,
    from: row.role === "user" ? "me" : "them",
    text: row.content,
    time: new Date(row.created_at).toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    createdAt: row.created_at,
  };
}

export function companionChannelKey(avatar: string): string {
  return `companion:${avatar}`;
}
