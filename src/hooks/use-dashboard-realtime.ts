"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { DashboardData, DataSource } from "@/lib/types/dashboard";
import {
  subscribeDashboardRealtime,
  unsubscribeChannel,
  type RealtimeEvent,
} from "@/lib/supabase/realtime";
import {
  applyTripChange,
  applyMatchChange,
  applyNotificationChange,
} from "@/lib/realtime/dashboard-handlers";
import {
  startMockRealtimeSimulator,
  triggerDemoRealtimeChange,
} from "@/lib/realtime/mock-simulator";
import { createDebouncer } from "@/lib/realtime/debounce";
import { realtimeLogger } from "@/lib/realtime/logger";
import { showRealtimeToast, showSupabaseErrorToast } from "@/lib/realtime/realtime-toasts";
import { mapTrip, mapMatch, mapNotification } from "@/lib/supabase/mappers";

export type RealtimeStatus =
  | "idle"
  | "syncing"
  | "connecting"
  | "connected"
  | "demo"
  | "error";

interface UseDashboardRealtimeOptions {
  supabase: SupabaseClient<Database> | null;
  profileId: string | null;
  source: DataSource;
  loading: boolean;
  setData: Dispatch<SetStateAction<DashboardData>>;
}

type TripRow = Database["public"]["Tables"]["trips"]["Row"];
type MatchRow = Database["public"]["Tables"]["matches"]["Row"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

type QueuedEvent =
  | { kind: "trip"; row: TripRow; event: RealtimeEvent }
  | { kind: "match"; row: MatchRow; event: RealtimeEvent }
  | { kind: "notification"; row: NotificationRow; event: RealtimeEvent };

const HIGHLIGHT_MS = 4500;
const DEBOUNCE_MS = 280;

function toastForEvent(item: QueuedEvent) {
  if (item.kind === "trip") {
    const trip = mapTrip(item.row);
    showRealtimeToast({
      type: "trip",
      title: item.event === "DELETE" ? "Viaje eliminado" : "Viaje actualizado",
      description:
        item.event === "DELETE"
          ? "Un viaje fue removido de tu panel"
          : `${trip.route.from} → ${trip.route.to}${
              trip.liveLocation?.label ? ` · ${trip.liveLocation.label}` : ""
            }`,
    });
    return;
  }
  if (item.kind === "match") {
    const match = mapMatch(item.row);
    showRealtimeToast({
      type: "match",
      title: item.event === "DELETE" ? "Match removido" : "Nuevo match disponible",
      description: `${match.driver.name} · ${match.route.from} → ${match.route.to}`,
    });
    return;
  }
  const notification = mapNotification(item.row);
  showRealtimeToast({
    type: "notification",
    title: notification.title,
    description: notification.message,
  });
}

export function useDashboardRealtime({
  supabase,
  profileId,
  source,
  loading,
  setData,
}: UseDashboardRealtimeOptions) {
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>("idle");
  const [syncing, setSyncing] = useState(false);
  const [updatedTripIds, setUpdatedTripIds] = useState<Set<string>>(new Set());
  const [newMatchIds, setNewMatchIds] = useState<Set<string>>(new Set());
  const [newNotificationIds, setNewNotificationIds] = useState<Set<string>>(
    new Set()
  );

  const highlightTimeout = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  const eventQueue = useRef<QueuedEvent[]>([]);
  const flushProcessor = useRef<ReturnType<typeof createDebouncer<() => void>> | null>(
    null
  );

  const flashHighlight = useCallback(
    (type: "trip" | "match" | "notification", id: string) => {
      const setters = {
        trip: setUpdatedTripIds,
        match: setNewMatchIds,
        notification: setNewNotificationIds,
      };
      const setter = setters[type];
      setter((prev) => new Set(prev).add(id));

      const key = `${type}:${id}`;
      const existing = highlightTimeout.current.get(key);
      if (existing) clearTimeout(existing);

      highlightTimeout.current.set(
        key,
        setTimeout(() => {
          setter((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          highlightTimeout.current.delete(key);
        }, HIGHLIGHT_MS)
      );
    },
    []
  );

  const processLiveEvent = useCallback(
    (type: "trip" | "match" | "notification", payload: { title: string; description?: string }) => {
      showRealtimeToast({ type, ...payload });
    },
    []
  );

  const flushEvents = useCallback(() => {
    const batch = eventQueue.current.splice(0);
    if (batch.length === 0) return;

    setData((prev) => {
      let next = prev;
      const highlights: Array<{
        type: "trip" | "match" | "notification";
        id: string;
      }> = [];

      for (const item of batch) {
        if (item.kind === "trip") {
          if (item.event === "DELETE" && !item.row.id) continue;
          const result = applyTripChange(next, item.row, item.event);
          next = result.data;
          if (result.tripId) highlights.push({ type: "trip", id: result.tripId });
        } else if (item.kind === "match") {
          const result = applyMatchChange(next, item.row, item.event);
          next = result.data;
          if (result.matchId && result.isNew) {
            highlights.push({ type: "match", id: result.matchId });
          }
        } else {
          const result = applyNotificationChange(next, item.row, item.event);
          next = result.data;
          if (result.notificationId && item.event === "INSERT") {
            highlights.push({ type: "notification", id: result.notificationId });
          }
        }
      }

      queueMicrotask(() => {
        for (const h of highlights) flashHighlight(h.type, h.id);
        for (const item of batch) toastForEvent(item);
      });

      return next;
    });

    realtimeLogger.info("dashboard", `Processed ${batch.length} batched realtime event(s)`);
  }, [setData, flashHighlight]);

  const enqueueEvent = useCallback(
    (item: QueuedEvent) => {
      eventQueue.current.push(item);
      flushProcessor.current?.push();
    },
    []
  );

  useEffect(() => {
    flushProcessor.current = createDebouncer(flushEvents, DEBOUNCE_MS);
    return () => {
      flushProcessor.current?.cancel();
      flushProcessor.current = null;
    };
  }, [flushEvents]);

  const triggerDemoChange = useCallback(() => {
    if (source !== "mock") return;
    realtimeLogger.info("demo", "Manual demo realtime change triggered");
    triggerDemoRealtimeChange(setData, flashHighlight);
  }, [source, setData, flashHighlight, processLiveEvent]);

  // Initial sync phase after data load
  useEffect(() => {
    if (loading) {
      setSyncing(true);
      setRealtimeStatus("syncing");
      return;
    }

    const timer = setTimeout(() => setSyncing(false), 600);
    return () => clearTimeout(timer);
  }, [loading]);

  // Supabase live subscriptions
  useEffect(() => {
    if (loading || source !== "supabase" || !supabase || !profileId) return;

    setRealtimeStatus("connecting");
    realtimeLogger.info("dashboard", "Subscribing to Supabase Realtime", { profileId });

    const channel = subscribeDashboardRealtime(supabase, profileId, {
      onStatus: (status) => {
        realtimeLogger.info("dashboard", `Channel status: ${status}`);
        if (status === "connected") setRealtimeStatus("connected");
        if (status === "error") {
          setRealtimeStatus("error");
          showSupabaseErrorToast("No se pudo mantener la conexión en vivo. Reintentando…");
          realtimeLogger.error("dashboard", "Realtime channel error");
        }
        if (status === "closed") setRealtimeStatus("idle");
      },
      onTrip: (row, event) => {
        enqueueEvent({ kind: "trip", row, event });
      },
      onMatch: (row, event) => {
        enqueueEvent({ kind: "match", row, event });
      },
      onNotification: (row, event) => {
        enqueueEvent({ kind: "notification", row, event });
      },
    });

    return () => {
      realtimeLogger.info("dashboard", "Unsubscribing from Supabase Realtime");
      flushProcessor.current?.flush();
      unsubscribeChannel(supabase, channel);
    };
  }, [loading, source, supabase, profileId, enqueueEvent]);

  // Demo mode simulated realtime
  useEffect(() => {
    if (loading || source !== "mock") return;

    setRealtimeStatus("demo");
    realtimeLogger.info("demo", "Starting mock realtime simulator (~15s interval)");
    const stop = startMockRealtimeSimulator(setData, flashHighlight, processLiveEvent);
    return () => {
      realtimeLogger.info("demo", "Stopping mock realtime simulator");
      stop();
    };
  }, [loading, source, setData, flashHighlight, processLiveEvent]);

  useEffect(() => {
    return () => {
      highlightTimeout.current.forEach((t) => clearTimeout(t));
      flushProcessor.current?.cancel();
    };
  }, []);

  return {
    syncing,
    realtimeStatus,
    updatedTripIds,
    newMatchIds,
    newNotificationIds,
    triggerDemoChange,
  };
}
