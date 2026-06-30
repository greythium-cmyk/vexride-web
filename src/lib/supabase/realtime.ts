import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { TripRow, MatchRow, NotificationRow } from "@/lib/supabase/types";
import {
  mapTrip,
  mapMatch,
  mapNotification,
  mapCompanionMessage,
  companionChannelKey,
  type CompanionMessage,
} from "@/lib/supabase/mappers";

type DB = SupabaseClient<Database>;

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE";

export interface DashboardRealtimeCallbacks {
  onTrip: (row: TripRow, event: RealtimeEvent) => void;
  onMatch: (row: MatchRow, event: RealtimeEvent) => void;
  onNotification: (row: NotificationRow, event: RealtimeEvent) => void;
  onStatus?: (status: "connecting" | "connected" | "error" | "closed") => void;
}

export interface CompanionChatCallbacks {
  onMessage: (message: CompanionMessage) => void;
  onStatus?: (status: "connecting" | "connected" | "error" | "closed") => void;
}

/** Subscribe to trips, matches, and notifications postgres_changes. */
export function subscribeDashboardRealtime(
  supabase: DB,
  profileId: string,
  callbacks: DashboardRealtimeCallbacks
): RealtimeChannel {
  callbacks.onStatus?.("connecting");

  const channel = supabase
    .channel(`dashboard-live:${profileId}`, {
      config: { broadcast: { self: false } },
    })
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "trips",
        filter: `user_id=eq.${profileId}`,
      },
      (payload) => {
        const event = payload.eventType as RealtimeEvent;
        const row = (event === "DELETE" ? payload.old : payload.new) as TripRow;
        if (row) callbacks.onTrip(row, event);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "matches",
        filter: `user_id=eq.${profileId}`,
      },
      (payload) => {
        const event = payload.eventType as RealtimeEvent;
        const row = (event === "DELETE" ? payload.old : payload.new) as MatchRow;
        if (row) callbacks.onMatch(row, event);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${profileId}`,
      },
      (payload) => {
        const event = payload.eventType as RealtimeEvent;
        const row = (event === "DELETE" ? payload.old : payload.new) as NotificationRow;
        if (row) callbacks.onNotification(row, event);
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") callbacks.onStatus?.("connected");
      if (status === "CHANNEL_ERROR") callbacks.onStatus?.("error");
      if (status === "CLOSED") callbacks.onStatus?.("closed");
    });

  return channel;
}

/** Subscribe to companion chat messages for a specific driver channel. */
export function subscribeCompanionChat(
  supabase: DB,
  profileId: string,
  companionAvatar: string,
  callbacks: CompanionChatCallbacks
): RealtimeChannel {
  const channelKey = companionChannelKey(companionAvatar);
  callbacks.onStatus?.("connecting");

  const channel = supabase
    .channel(`companion-chat:${profileId}:${companionAvatar}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `user_id=eq.${profileId}`,
      },
      (payload) => {
        const row = payload.new as Database["public"]["Tables"]["chat_messages"]["Row"];
        if (row?.channel === channelKey) {
          callbacks.onMessage(mapCompanionMessage(row));
        }
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") callbacks.onStatus?.("connected");
      if (status === "CHANNEL_ERROR") callbacks.onStatus?.("error");
    });

  return channel;
}

export function unsubscribeChannel(
  supabase: DB,
  channel: RealtimeChannel
): void {
  void supabase.removeChannel(channel);
}

// Re-export mappers for convenience
export { mapTrip, mapMatch, mapNotification, mapCompanionMessage, companionChannelKey };
