/**
 * Mock data — used as fallback when Supabase is not configured or empty.
 * Types live in @/lib/types/dashboard.
 */
export type {
  TripStatus,
  Trip,
  MatchSuggestion,
  ChatMessage,
  MonthlyStat,
  QuickStats,
  HistorySummary,
  DashboardUser,
  Notification,
  DashboardData,
  MatchBreakdown,
} from "@/lib/types/dashboard";

export {
  statusLabels,
  statusColors,
} from "@/lib/types/dashboard";

import type {
  Trip,
  MatchSuggestion,
  ChatMessage,
  MonthlyStat,
  DashboardUser,
  Notification,
} from "@/lib/types/dashboard";

export const currentUser: DashboardUser = {
  name: "Alex Rivera",
  email: "alex.rivera@email.com",
  avatar: "AR",
  plan: "Pro",
  rating: 4.8,
};

export const quickStats = {
  monthlySavings: 247,
  co2Saved: 18.4,
  weeklyMatches: 5,
  nextTrip: {
    time: "Mañana, 8:15 AM",
    route: "Brooklyn → Manhattan",
    driver: "María G.",
  },
};

export const activeTrips: Trip[] = [
  {
    id: "trip-1",
    driver: { name: "María G.", avatar: "MG", rating: 4.9, premium: false },
    route: { from: "Brooklyn Heights", to: "Midtown Manhattan" },
    date: "Mañana, 30 Jun",
    time: "8:15 AM",
    status: "confirmed",
    passengers: 3,
    matchScore: 97,
    vehicle: "Toyota Camry 2023",
    estimatedDuration: "35 min",
    pickupPoint: "Corner Henry & Atlantic Ave",
    matchBreakdown: { schedule: 99, route: 96, preferences: 94, history: 98 },
  },
  {
    id: "trip-2",
    driver: { name: "Carlos R.", avatar: "CR", rating: 4.95, premium: true },
    route: { from: "Queens", to: "Financial District" },
    date: "Vie, 4 Jul",
    time: "8:20 AM",
    status: "pending",
    passengers: 2,
    matchScore: 99,
    vehicle: "Mercedes E-Class 2024",
    estimatedDuration: "42 min",
    pickupPoint: "Queens Blvd Station",
    matchBreakdown: { schedule: 100, route: 98, preferences: 97, history: 99 },
  },
  {
    id: "trip-3",
    driver: { name: "Ana L.", avatar: "AL", rating: 4.7, premium: false },
    route: { from: "Jersey City", to: "SoHo" },
    date: "Lun, 7 Jul",
    time: "8:30 AM",
    status: "confirmed",
    passengers: 4,
    matchScore: 94,
    vehicle: "Honda Accord 2022",
    estimatedDuration: "38 min",
    pickupPoint: "Grove Street PATH",
    matchBreakdown: { schedule: 92, route: 95, preferences: 91, history: 96 },
  },
];

export const availableMatches: MatchSuggestion[] = [
  {
    id: "match-1",
    driver: { name: "Diego M.", avatar: "DM", rating: 4.85, premium: false },
    route: { from: "Park Slope", to: "Union Square" },
    time: "8:10 AM",
    matchScore: 96,
    savings: "$12",
    co2Saved: "2.1 kg",
  },
  {
    id: "match-2",
    driver: { name: "Sofia K.", avatar: "SK", rating: 4.92, premium: true },
    route: { from: "Williamsburg", to: "Wall Street" },
    time: "8:25 AM",
    matchScore: 98,
    savings: "$18",
    co2Saved: "2.8 kg",
  },
  {
    id: "match-3",
    driver: { name: "James T.", avatar: "JT", rating: 4.6, premium: false },
    route: { from: "Astoria", to: "Chelsea" },
    time: "8:05 AM",
    matchScore: 91,
    savings: "$9",
    co2Saved: "1.6 kg",
  },
  {
    id: "match-4",
    driver: { name: "Laura P.", avatar: "LP", rating: 4.88, premium: false },
    route: { from: "Bushwick", to: "Flatiron" },
    time: "8:18 AM",
    matchScore: 93,
    savings: "$11",
    co2Saved: "1.9 kg",
  },
];

export const vexAIInitialMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "¡Hola Alex! Soy Vex AI. Tienes 2 viajes confirmados esta semana y 4 matches disponibles. ¿En qué puedo ayudarte?",
    timestamp: "09:00",
  },
];

export const vexAIChatHistory: ChatMessage[] = [
  ...vexAIInitialMessages,
  {
    id: "msg-2",
    role: "user",
    content: "¿Cuál es mi próximo viaje?",
    timestamp: "Ayer, 18:30",
  },
  {
    id: "msg-3",
    role: "assistant",
    content:
      "Tu próximo viaje es mañana a las 8:15 AM con María G. Ruta: Brooklyn Heights → Midtown. Match al 97%.",
    timestamp: "Ayer, 18:30",
  },
];

export const monthlyStats: MonthlyStat[] = [
  { month: "Ene", savings: 120, trips: 8 },
  { month: "Feb", savings: 145, trips: 10 },
  { month: "Mar", savings: 168, trips: 12 },
  { month: "Abr", savings: 190, trips: 14 },
  { month: "May", savings: 215, trips: 16 },
  { month: "Jun", savings: 247, trips: 18 },
];

export const historySummary = {
  totalTrips: 78,
  totalSavings: 1085,
  totalCo2: 142.6,
  avgRating: 4.8,
};

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Match confirmado",
    message: "María G. confirmó el viaje de mañana",
    time: "Hace 5 min",
    unread: true,
  },
  {
    id: "n2",
    title: "Nuevo match sugerido",
    message: "Sofia K. — 98% compatibilidad",
    time: "Hace 1 h",
    unread: true,
  },
  {
    id: "n3",
    title: "Recordatorio",
    message: "Tu viaje es mañana a las 8:15 AM",
    time: "Hace 3 h",
    unread: false,
  },
];

export const navItems = [
  { id: "inicio", label: "Inicio", href: "/dashboard", icon: "Home" as const },
  {
    id: "viajes",
    label: "Mis Viajes",
    href: "/dashboard#viajes",
    icon: "Car" as const,
  },
  {
    id: "matches",
    label: "Matches",
    href: "/dashboard#matches",
    icon: "Users" as const,
  },
  {
    id: "vex-ai",
    label: "Vex AI",
    href: "/dashboard#vex-ai",
    icon: "Bot" as const,
  },
  {
    id: "estadisticas",
    label: "Estadísticas",
    href: "/dashboard#estadisticas",
    icon: "BarChart3" as const,
  },
  {
    id: "configuracion",
    label: "Configuración",
    href: "/dashboard#configuracion",
    icon: "Settings" as const,
  },
];
