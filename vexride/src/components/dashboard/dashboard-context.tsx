"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Trip, MatchSuggestion } from "@/lib/mock-data";

interface DashboardContextValue {
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
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [chatCompanion, setChatCompanion] = useState<{
    name: string;
    avatar: string;
  } | null>(null);
  const [joinedMatchIds, setJoinedMatchIds] = useState<Set<string>>(
    new Set()
  );
  const [showNewCarpoolModal, setShowNewCarpoolModal] = useState(false);
  const [newCarpoolMode, setNewCarpoolMode] = useState<"search" | "offer">(
    "search"
  );

  const joinMatch = useCallback((match: MatchSuggestion) => {
    setJoinedMatchIds((prev) => new Set(prev).add(match.id));
  }, []);

  return (
    <DashboardContext.Provider
      value={{
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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
