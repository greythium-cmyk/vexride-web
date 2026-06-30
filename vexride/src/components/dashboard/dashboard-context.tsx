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
  source: DataSource;
  dataError: string | null;
  reload: () => void;
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

function useDashboardDataInternal(clerkUser: ReturnType<typeof useUser>["user"], clerkLoaded: boolean) {
  const supabase = useSupabaseClient();
  const [data, setData] = useState<DashboardData>(MOCK_DATA);
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
        if (remote && remote.activeTrips.length > 0) {
          setData({ ...remote, user: clerkProfile ?? remote.user });
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
    setSource("mock");
    setLoading(false);
  }, [supabase, clerkUser]);

  useEffect(() => {
    if (!clerkLoaded) return;
    void loadData();
  }, [clerkLoaded, loadData]);

  const persistJoinMatch = useCallback(
    async (matchId: string) => {
      if (source === "supabase" && supabase) {
        await joinMatchInDb(supabase, matchId);
      }
    },
    [source, supabase]
  );

  return { data, loading: loading || !clerkLoaded, source, error, reload: loadData, persistJoinMatch };
}

function DashboardProviderInner({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data, loading, source, error, reload, persistJoinMatch } =
    useDashboardDataInternal(clerkUser, clerkLoaded);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [chatCompanion, setChatCompanion] = useState<{
    name: string;
    avatar: string;
  } | null>(null);
  const [joinedMatchIds, setJoinedMatchIds] = useState<Set<string>>(new Set());
  const [showNewCarpoolModal, setShowNewCarpoolModal] = useState(false);
  const [newCarpoolMode, setNewCarpoolMode] = useState<"search" | "offer">("search");
  const [carpoolStep, setCarpoolStep] = useState(0);

  const joinMatch = useCallback(
    (match: MatchSuggestion) => {
      setJoinedMatchIds((prev) => new Set(prev).add(match.id));
      void persistJoinMatch(match.id);
    },
    [persistJoinMatch]
  );

  const value = useMemo(
    () => ({
      data,
      loading,
      source,
      dataError: error,
      reload,
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
    }),
    [
      data,
      loading,
      source,
      error,
      reload,
      selectedTrip,
      chatCompanion,
      joinedMatchIds,
      joinMatch,
      showNewCarpoolModal,
      newCarpoolMode,
      carpoolStep,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

/** Demo provider — no Clerk hooks, instant mock data. */
function DashboardProviderMock({ children }: { children: ReactNode }) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [chatCompanion, setChatCompanion] = useState<{
    name: string;
    avatar: string;
  } | null>(null);
  const [joinedMatchIds, setJoinedMatchIds] = useState<Set<string>>(new Set());
  const [showNewCarpoolModal, setShowNewCarpoolModal] = useState(false);
  const [newCarpoolMode, setNewCarpoolMode] = useState<"search" | "offer">("search");
  const [carpoolStep, setCarpoolStep] = useState(0);

  const joinMatch = useCallback((match: MatchSuggestion) => {
    setJoinedMatchIds((prev) => new Set(prev).add(match.id));
  }, []);

  const value = useMemo(
    () => ({
      data: MOCK_DATA,
      loading: false,
      source: "mock" as DataSource,
      dataError: null,
      reload: () => {},
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
    }),
    [
      selectedTrip,
      chatCompanion,
      joinedMatchIds,
      joinMatch,
      showNewCarpoolModal,
      newCarpoolMode,
      carpoolStep,
    ]
  );

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
