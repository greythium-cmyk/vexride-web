export type TripStatus = "confirmed" | "pending" | "in-progress" | "completed";

export interface Driver {
  name: string;
  avatar: string;
  rating: number;
  premium: boolean;
}

export interface Route {
  from: string;
  to: string;
}

export interface Trip {
  id: string;
  driver: Driver;
  route: Route;
  date: string;
  time: string;
  status: TripStatus;
  passengers: number;
  matchScore: number;
  vehicle?: string;
  matchBreakdown?: MatchBreakdown;
  estimatedDuration?: string;
  pickupPoint?: string;
  liveLocation?: {
    label: string;
    lat?: number;
    lng?: number;
  };
}

export interface MatchBreakdown {
  schedule: number;
  route: number;
  preferences: number;
  history: number;
}

export interface MatchSuggestion {
  id: string;
  driver: Driver;
  route: Route;
  time: string;
  matchScore: number;
  savings: string;
  co2Saved: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface MonthlyStat {
  month: string;
  savings: number;
  trips: number;
}

export interface QuickStats {
  monthlySavings: number;
  co2Saved: number;
  weeklyMatches: number;
  nextTrip: {
    time: string;
    route: string;
    driver: string;
  };
}

export interface HistorySummary {
  totalTrips: number;
  totalSavings: number;
  totalCo2: number;
  avgRating: number;
}

export interface DashboardUser {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  rating: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface DashboardData {
  user: DashboardUser;
  quickStats: QuickStats;
  activeTrips: Trip[];
  availableMatches: MatchSuggestion[];
  monthlyStats: MonthlyStat[];
  historySummary: HistorySummary;
  notifications: Notification[];
}

export type DataSource = "mock" | "supabase";

export const statusLabels: Record<TripStatus, string> = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  "in-progress": "En curso",
  completed: "Completado",
};

export const statusColors: Record<TripStatus, string> = {
  confirmed: "bg-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/30",
  pending: "bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/30",
  "in-progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};
