"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import type {
  Trip,
  MatchSuggestion,
  DashboardData,
  DataSource,
} from "@/lib/types/dashboard";
import { useSupabaseClient } from "@/lib/supabase/client";
import { fetchDashboardData, joinMatchInDb } from "@/lib/supabase/queries";
import { isSupabaseConfigured, isClerkConfigured } from "@/lib/env";
import { useDashboardRealtime, type RealtimeStatus } from "@/hooks/use-dashboard-realtime";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import {
  currentUser,
  quickStats,
  activeTrips,
  availableMatches,
  monthlyStats,
  historySummary,
  notifications,
} from "@/lib/mock-data";

const MOCK_DATA: DashboardData = {
  user: currentUser,
  quickStats,
  activeTrips,
  availableMatches,
  monthlyStats,
  historySummary,
  notifications,
};

interface DashboardContextValue {
  data: DashboardData;
  loading: boolean;
  syncing: boolean;
  source: DataSource;
  dataError: string | null;
  realtimeStatus: RealtimeStatus;
  profileId: string | null;
  supabase: SupabaseClient<Database> | null;
  updatedTripIds: Set<string>;
  newMatchIds: Set<string>;
  newNotificationIds: Set<string>;
  reload: () => Promise<void>;
  triggerDemoChange: () => void;
  selectedTrip: Trip | null;
  setSelectedTrip: (trip: Trip | null) => void;
  chatCompanion: { name: string; avatar: string } | null;
  setChatCompanion: (
    companion: { name: string; avatar: string } | null
  ) => void;
  joinedMatchIds: Set<string>;
  joinMatch: (match: MatchSuggestion) => void;
  showNewCarpoolModal: boolean;
  setShowNewCarpoolModal: (show: boolean) => void;
  newCarpoolMode: "search" | "offer";
  setNewCarpoolMode: (mode: "search" | "offer") => void;
  carpoolStep: number;
  setCarpoolStep: (step: number) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

function useSharedDashboardState(
  data: DashboardData,
  setData: React.Dispatch<React.SetStateAction<DashboardData>>,
  loading: boolean,
  source: DataSource,
  error: string | null,
  reload: () => Promise<void>,
  profileId: string | null,
  supabase: SupabaseClient<Database> | null,
  persistJoinMatch: (id: string) => void
) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [chatCompanion, setChatCompanion] = useState<{
    name: string;
    avatar: string;
  } | null>(null);
  const [joinedMatchIds, setJoinedMatchIds] = useState<Set<string>>(new Set());
  const [showNewCarpoolModal, setShowNewCarpoolModal] = useState(false);
  const [newCarpoolMode, setNewCarpoolMode] = useState<"search" | "offer">("search");
  const [carpoolStep, setCarpoolStep] = useState(0);

  const {
    syncing,
    realtimeStatus,
    updatedTripIds,
    newMatchIds,
    newNotificationIds,
    triggerDemoChange,
  } = useDashboardRealtime({
    supabase,
    profileId,
    source,
    loading,
    setData,
  });

  const joinMatch = useCallback(
    (match: MatchSuggestion) => {
      setJoinedMatchIds((prev) => new Set(prev).add(match.id));
      persistJoinMatch(match.id);
    },
    [persistJoinMatch]
  );

  // Keep selected trip in sync with realtime updates
  useEffect(() => {
    if (!selectedTrip) return;
    const updated = data.activeTrips.find((t) => t.id === selectedTrip.id);
    if (updated) setSelectedTrip(updated);
  }, [data.activeTrips, selectedTrip]);

  return {
    data,
    loading,
    syncing,
    source,
    dataError: error,
    realtimeStatus,
    profileId,
    supabase,
    updatedTripIds,
    newMatchIds,
    newNotificationIds,
    reload,
    triggerDemoChange,
    selectedTrip,
    setSelectedTrip,
    chatCompanion,
    setChatCompanion,
    joinedMatchIds,
    joinMatch,
    showNewCarpoolModal,
    setShowNewCarpoolModal,
    newCarpoolMode,
    setNewCarpoolMode,
    carpoolStep,
    setCarpoolStep,
  };
}

function DashboardProviderInner({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const supabase = useSupabaseClient();
  const [data, setData] = useState<DashboardData>(MOCK_DATA);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<DataSource>("mock");
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const clerkProfile = clerkUser
      ? {
          name: clerkUser.fullName ?? currentUser.name,
          email:
            clerkUser.primaryEmailAddress?.emailAddress ?? currentUser.email,
          avatar:
            clerkUser.firstName && clerkUser.lastName
              ? `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`
              : currentUser.avatar,
          plan: currentUser.plan,
          rating: currentUser.rating,
        }
      : null;

    if (isSupabaseConfigured() && supabase && clerkUser?.id) {
      try {
        const remote = await fetchDashboardData(supabase, clerkUser.id);
        if (remote) {
          const { profileId: pid, ...dashboard } = remote;
          setData({ ...dashboard, user: clerkProfile ?? dashboard.user });
          setProfileId(pid);
          setSource("supabase");
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("[Vexride] Supabase fetch failed, using mock data:", e);
        setError("Usando datos de demostración");
      }
    }

    setData({ ...MOCK_DATA, user: clerkProfile ?? MOCK_DATA.user });
    setProfileId(null);
    setSource("mock");
    setLoading(false);
  }, [supabase, clerkUser]);

  useEffect(() => {
    if (!clerkLoaded) return;
    void loadData();
  }, [clerkLoaded, loadData]);

  const persistJoinMatch = useCallback(
    (matchId: string) => {
      if (source === "supabase" && supabase) {
        void joinMatchInDb(supabase, matchId);
      }
    },
    [source, supabase]
  );

  const shared = useSharedDashboardState(
    data,
    setData,
    loading || !clerkLoaded,
    source,
    error,
    loadData,
    profileId,
    supabase,
    persistJoinMatch
  );

  const value = useMemo(() => shared, [shared]);

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

function DashboardProviderMock({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>(MOCK_DATA);

  const shared = useSharedDashboardState(
    data,
    setData,
    false,
    "mock",
    null,
    async () => {},
    null,
    null,
    () => {}
  );

  const value = useMemo(() => shared, [shared]);

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  if (isClerkConfigured()) {
    return <DashboardProviderInner>{children}</DashboardProviderInner>;
  }
  return <DashboardProviderMock>{children}</DashboardProviderMock>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
