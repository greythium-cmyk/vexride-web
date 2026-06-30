import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { DashboardData, MonthlyStat } from "@/lib/types/dashboard";
import {
  mapTrip,
  mapMatch,
  mapNotification,
  mapCompanionMessage,
  companionChannelKey,
  formatRelativeTime,
  type CompanionMessage,
} from "@/lib/supabase/mappers";

type DB = SupabaseClient<Database>;

/** Resolve Supabase profile UUID from Clerk user id. */
export async function fetchProfileId(
  supabase: DB,
  clerkUserId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .single();

  return data?.id ?? null;
}

/** Fetch full dashboard payload for authenticated user. Returns null if no profile. */
export async function fetchDashboardData(
  supabase: DB,
  clerkUserId: string
): Promise<(DashboardData & { profileId: string }) | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", clerkUserId)
    .single();

  if (!profile) return null;

  const userId = profile.id;

  const [tripsRes, matchesRes, statsRes, notifRes] = await Promise.all([
    supabase.from("trips").select("*").eq("user_id", userId).order("trip_date"),
    supabase
      .from("matches")
      .select("*")
      .eq("user_id", userId)
      .eq("joined", false)
      .order("created_at", { ascending: false }),
    supabase.from("user_stats").select("*").eq("user_id", userId).order("month"),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const trips = (tripsRes.data ?? []).map(mapTrip);
  const matches = (matchesRes.data ?? []).map(mapMatch);
  const monthlyStats: MonthlyStat[] = (statsRes.data ?? []).map((s) => ({
    month: s.month,
    savings: Number(s.savings),
    trips: s.trips,
  }));

  const totalSavings = monthlyStats.reduce((a, s) => a + s.savings, 0);
  const totalTrips = monthlyStats.reduce((a, s) => a + s.trips, 0);
  const totalCo2 = (statsRes.data ?? []).reduce(
    (a, s) => a + Number(s.co2_saved),
    0
  );

  const notifications = (notifRes.data ?? []).map(mapNotification);
  const nextTrip = trips[0];

  return {
    profileId: userId,
    user: {
      name: profile.full_name,
      email: profile.email,
      avatar: profile.avatar_initials,
      plan: profile.plan,
      rating: Number(profile.rating),
    },
    quickStats: {
      monthlySavings: monthlyStats.at(-1)?.savings ?? 0,
      co2Saved: Number((statsRes.data ?? []).at(-1)?.co2_saved ?? 0),
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
      avgRating: Number(profile.rating),
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

/** Load companion chat history for a driver channel. */
export async function fetchCompanionMessages(
  supabase: DB,
  profileId: string,
  companionAvatar: string
): Promise<CompanionMessage[]> {
  const channel = companionChannelKey(companionAvatar);
  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", profileId)
    .eq("channel", channel)
    .order("created_at", { ascending: true })
    .limit(100);

  return (data ?? []).map(mapCompanionMessage);
}

/** Persist a companion chat message (triggers realtime INSERT). */
export async function sendCompanionMessage(
  supabase: DB,
  profileId: string,
  companionAvatar: string,
  content: string,
  role: "user" | "assistant"
): Promise<CompanionMessage | null> {
  const channel = companionChannelKey(companionAvatar);
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      user_id: profileId,
      role,
      content,
      channel,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.warn("[Vexride] sendCompanionMessage failed:", error);
    return null;
  }

  return mapCompanionMessage(data);
}

export { formatRelativeTime };
