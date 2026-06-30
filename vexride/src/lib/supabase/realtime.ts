import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { Trip, MatchSuggestion } from "@/lib/types/dashboard";

type DB = SupabaseClient<Database>;

export interface RealtimeCallbacks {
  onTripChange?: (trip: Trip) => void;
  onMatchChange?: (match: MatchSuggestion) => void;
  onNotification?: (payload: unknown) => void;
}

/**
 * Subscribe to realtime updates for trips, matches, and notifications.
 * Requires Supabase Realtime enabled on tables (see schema.sql).
 */
export function subscribeToDashboardRealtime(
  supabase: DB,
  userId: string,
  callbacks: RealtimeCallbacks
): RealtimeChannel {
  const channel = supabase
    .channel(`dashboard:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "trips",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        if (payload.new && callbacks.onTripChange) {
          callbacks.onTripChange(payload.new as unknown as Trip);
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "matches",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        if (payload.new && callbacks.onMatchChange) {
          callbacks.onMatchChange(payload.new as unknown as MatchSuggestion);
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callbacks.onNotification?.(payload.new);
      }
    )
    .subscribe();

  return channel;
}

export function unsubscribeChannel(
  supabase: DB,
  channel: RealtimeChannel
): void {
  supabase.removeChannel(channel);
}
