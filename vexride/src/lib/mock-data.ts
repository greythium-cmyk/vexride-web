export type TripStatus = "confirmed" | "pending" | "in-progress" | "completed";

export interface Trip {
  id: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
    premium: boolean;
  };
  route: {
    from: string;
    to: string;
  };
  date: string;
  time: string;
  status: TripStatus;
  passengers: number;
  matchScore: number;
  vehicle?: string;
}

export interface MatchSuggestion {
  id: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
    premium: boolean;
  };
  route: {
    from: string;
    to: string;
  };
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
}

export interface MonthlyStat {
  month: string;
  savings: number;
  trips: number;
}

export const currentUser = {
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

export const vexAIResponses: Record<string, string> = {
  default:
    "Entendido. Estoy analizando tu calendario y rutas habituales para encontrar la mejor opción. ¿Quieres que busque un Premium Driver?",
  viaje:
    "Tu próximo viaje es mañana a las 8:15 AM con María G. Ruta: Brooklyn Heights → Midtown. Match al 97%. ¿Activo Modo Trabajo?",
  match:
    "Encontré 4 matches disponibles para esta semana. El mejor es Sofia K. (98% match, Premium Driver) a las 8:25 AM. ¿Te uno?",
  ahorro:
    "Este mes has ahorrado $247 y reducido 18.4 kg de CO₂. ¡Vas 23% mejor que el mes pasado!",
};

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

export const notifications = [
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
