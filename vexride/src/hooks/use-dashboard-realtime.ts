"use client";

import { useEffect, useRef, useState, useCallback, type Dispatch, type SetStateAction } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { DashboardData, DataSource } from "@/lib/types/dashboard";
import {
  subscribeDashboardRealtime,
  unsubscribeChannel,
} from "@/lib/supabase/realtime";
import {
  applyTripChange,
  applyMatchChange,
  applyNotificationChange,
} from "@/lib/realtime/dashboard-handlers";
import { startMockRealtimeSimulator } from "@/lib/realtime/mock-simulator";

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
        }, 4000)
      );
    },
    []
  );

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

    const channel = subscribeDashboardRealtime(supabase, profileId, {
      onStatus: (status) => {
        if (status === "connected") setRealtimeStatus("connected");
        if (status === "error") setRealtimeStatus("error");
        if (status === "closed") setRealtimeStatus("idle");
      },
      onTrip: (row, event) => {
        if (event === "DELETE" && !row.id) return;
        setData((prev) => {
          const result = applyTripChange(prev, row, event);
          if (result.tripId) flashHighlight("trip", result.tripId);
          return result.data;
        });
      },
      onMatch: (row, event) => {
        setData((prev) => {
          const result = applyMatchChange(prev, row, event);
          if (result.matchId && result.isNew) {
            flashHighlight("match", result.matchId);
          }
          return result.data;
        });
      },
      onNotification: (row, event) => {
        setData((prev) => {
          const result = applyNotificationChange(prev, row, event);
          if (result.notificationId && event === "INSERT") {
            flashHighlight("notification", result.notificationId);
          }
          return result.data;
        });
      },
    });

    return () => {
      unsubscribeChannel(supabase, channel);
    };
  }, [loading, source, supabase, profileId, setData, flashHighlight]);

  // Demo mode simulated realtime
  useEffect(() => {
    if (loading || source !== "mock") return;

    setRealtimeStatus("demo");
    const stop = startMockRealtimeSimulator(setData, flashHighlight);
    return stop;
  }, [loading, source, setData, flashHighlight]);

  useEffect(() => {
    return () => {
      highlightTimeout.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return {
    syncing,
    realtimeStatus,
    updatedTripIds,
    newMatchIds,
    newNotificationIds,
  };
}
