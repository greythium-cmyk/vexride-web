import type { DashboardData } from "@/lib/types/dashboard";

export interface VexAIContext {
  userName?: string;
  data?: Pick<
    DashboardData,
    "quickStats" | "activeTrips" | "availableMatches"
  >;
}

export type ResponseCategory =
  | "viaje"
  | "match"
  | "ahorro"
  | "seguridad"
  | "conductor"
  | "default";

/** Classify user input into response category via keyword matching. */
export function classifyMessage(input: string): ResponseCategory {
  const lower = input.toLowerCase();

  if (
    /viaje|próximo|salida|programad|mañana|horario/.test(lower)
  ) {
    return "viaje";
  }
  if (/match|unir|sugerenc|disponib|compatib/.test(lower)) {
    return "match";
  }
  if (/ahorro|ahorr|co2|co₂|carbono|gasto|dinero/.test(lower)) {
    return "ahorro";
  }
  if (/segur|verific|confian|proteg|identidad/.test(lower)) {
    return "seguridad";
  }
  if (/conductor|driver|premium|luxury|vehículo|auto/.test(lower)) {
    return "conductor";
  }
  return "default";
}

/** Build contextual mock/API fallback response from dashboard state. */
export function buildVexAIResponse(
  input: string,
  ctx: VexAIContext
): string {
  const category = classifyMessage(input);
  const name = ctx.userName?.split(" ")[0] ?? "Alex";
  const stats = ctx.data?.quickStats;
  const trips = ctx.data?.activeTrips ?? [];
  const matches = ctx.data?.availableMatches ?? [];
  const next = trips[0];

  switch (category) {
    case "viaje":
      if (next) {
        return `${name}, tu próximo viaje es **${next.date} a las ${next.time}** con ${next.driver.name}. Ruta: ${next.route.from} → ${next.route.to}. Match al **${next.matchScore}%**. ¿Activo Modo Trabajo para este viaje?`;
      }
      return `No tienes viajes programados aún, ${name}. ¿Quieres que busque matches para mañana?`;

    case "match":
      if (matches.length === 0) {
        return "No hay matches disponibles en este momento. Puedo buscar nuevas rutas si me indicas origen y destino.";
      }
      const best = [...matches].sort((a, b) => b.matchScore - a.matchScore)[0];
      return `Encontré **${matches.length} matches** disponibles. El mejor: **${best.driver.name}** (${best.matchScore}% compatibilidad) — ${best.route.from} → ${best.route.to} a las ${best.time}. Ahorro estimado: ${best.savings}. ¿Te uno?`;

    case "ahorro":
      if (stats) {
        return `Este mes has ahorrado **$${stats.monthlySavings}** y evitado **${stats.co2Saved} kg de CO₂**. Vas **23% mejor** que el mes pasado. ¡Excelente impacto, ${name}!`;
      }
      return "Aún no tengo datos de ahorro. Conecta tu calendario para empezar a trackear tu impacto.";

    case "seguridad":
      return "Vexride incluye **verificación de identidad**, ratings verificados, monitoreo en tiempo real y sistema anti-cancelaciones. Todos los conductores pasan revisión. ¿Quieres ver el perfil de seguridad de tu próximo conductor?";

    case "conductor":
      const premium = matches.find((m) => m.driver.premium);
      if (premium) {
        return `Tienes acceso a **Premium Drivers**. ${premium.driver.name} (★ ${premium.driver.rating}) ofrece Luxury Ride con matching prioritario. Tarifa estimada +40% vs conductor regular. ¿Reservo?`;
      }
      return "Puedo buscar conductores Premium / Luxury Ride con vehículos de alta gama y matching prioritario. ¿Para qué fecha?";

    default:
      return `Entendido, ${name}. Estoy analizando tu calendario y rutas habituales. Puedo ayudarte con viajes, matches, ahorro, seguridad o conductores premium. ¿Qué prefieres?`;
  }
}

export const VEX_AI_SUGGESTED_PROMPTS = [
  { label: "Próximo viaje", prompt: "¿Cuál es mi próximo viaje?", icon: "MapPin" },
  { label: "Matches", prompt: "Muéstrame matches disponibles", icon: "Users" },
  { label: "Ahorro", prompt: "¿Cuánto he ahorrado este mes?", icon: "DollarSign" },
  { label: "Seguridad", prompt: "¿Cómo funciona la seguridad?", icon: "Shield" },
  { label: "Premium", prompt: "Buscar Premium Driver", icon: "Star" },
] as const;

export const VEX_AI_SYSTEM_PROMPT = `Eres Vex AI, el asistente inteligente de Vexride (Greythium Incorporated).
Ayudas a usuarios con carpooling laboral: matches, viajes, ahorro, CO₂, seguridad y conductores premium.
Responde en español, de forma concisa, amigable y profesional. Usa datos del usuario cuando estén disponibles.
Nunca inventes información crítica de seguridad de viajes reales.`;
