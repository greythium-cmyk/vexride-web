import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  DashboardData,
  Trip,
  MatchSuggestion,
  MonthlyStat,
  Notification,
  TripStatus,
} from "@/lib/types/dashboard";

type DB = SupabaseClient<Database>;

function mapTrip(row: Database["public"]["Tables"]["trips"]["Row"]): Trip {
  return {
    id: row.id,
    driver: {
      name: row.driver_name,
      avatar: row.driver_avatar,
      rating: row.driver_rating,
      premium: row.driver_premium,
    },
    route: { from: row.route_from, to: row.route_to },
    date: row.trip_date,
    time: row.trip_time,
    status: row.status as TripStatus,
    passengers: row.passengers,
    matchScore: row.match_score,
    vehicle: row.vehicle ?? undefined,
  };
}

function mapMatch(row: Database["public"]["Tables"]["matches"]["Row"]): MatchSuggestion {
  return {
    id: row.id,
    driver: {
      name: row.driver_name,
      avatar: row.driver_avatar,
      rating: row.driver_rating,
      premium: row.driver_premium,
    },
    route: { from: row.route_from, to: row.route_to },
    time: row.match_time,
    matchScore: row.match_score,
    savings: row.savings,
    co2Saved: row.co2_saved,
  };
}

/** Fetch full dashboard payload for authenticated user. Returns null if empty/error. */
export async function fetchDashboardData(
  supabase: DB,
  clerkUserId: string
): Promise<DashboardData | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", clerkUserId)
    .single();

  if (!profile) return null;

  const userId = profile.id;

  const [tripsRes, matchesRes, statsRes, notifRes] = await Promise.all([
    supabase.from("trips").select("*").eq("user_id", userId).order("trip_date"),
    supabase.from("matches").select("*").eq("user_id", userId).eq("joined", false),
    supabase.from("user_stats").select("*").eq("user_id", userId).order("month"),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const trips = (tripsRes.data ?? []).map(mapTrip);
  const matches = (matchesRes.data ?? []).map(mapMatch);
  const monthlyStats: MonthlyStat[] = (statsRes.data ?? []).map((s) => ({
    month: s.month,
    savings: s.savings,
    trips: s.trips,
  }));

  const totalSavings = monthlyStats.reduce((a, s) => a + s.savings, 0);
  const totalTrips = monthlyStats.reduce((a, s) => a + s.trips, 0);
  const totalCo2 = (statsRes.data ?? []).reduce((a, s) => a + s.co2_saved, 0);

  const notifications: Notification[] = (notifRes.data ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    time: formatRelativeTime(n.created_at),
    unread: n.unread,
  }));

  const nextTrip = trips[0];

  return {
    user: {
      name: profile.full_name,
      email: profile.email,
      avatar: profile.avatar_initials,
      plan: profile.plan,
      rating: profile.rating,
    },
    quickStats: {
      monthlySavings: monthlyStats.at(-1)?.savings ?? 0,
      co2Saved: (statsRes.data ?? []).at(-1)?.co2_saved ?? 0,
      weeklyMatches: matches.length,
      nextTrip: nextTrip
        ? {
            time: `${nextTrip.date}, ${nextTrip.time}`,
            route: `${nextTrip.route.from} → ${nextTrip.route.to}`,
            driver: nextTrip.driver.name,
          }
        : { time: "—", route: "—", driver: "—" },
    },
    activeTrips: trips,
    availableMatches: matches,
    monthlyStats,
    historySummary: {
      totalTrips,
      totalSavings,
      totalCo2,
      avgRating: profile.rating,
    },
    notifications,
  };
}

/** Join a match — persists to Supabase when connected. */
export async function joinMatchInDb(
  supabase: DB,
  matchId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("matches")
    .update({ joined: true })
    .eq("id", matchId);

  return !error;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.floor(hours / 24)} d`;
}
