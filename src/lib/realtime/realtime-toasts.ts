import { toast } from "sonner";
import { Car, Users, Bell, Zap } from "lucide-react";
import { createElement } from "react";

export type LiveEventType = "trip" | "match" | "notification";

export interface LiveEventPayload {
  type: LiveEventType;
  title: string;
  description?: string;
}

const icons = {
  trip: Car,
  match: Users,
  notification: Bell,
};

export function showRealtimeToast(event: LiveEventPayload) {
  const Icon = icons[event.type];
  toast(event.title, {
    description: event.description,
    icon: createElement(Icon, { className: "size-4 text-[#14B8A6]" }),
    duration: 4000,
    classNames: {
      toast:
        "border border-white/10 bg-[#1E293B] text-white shadow-xl shadow-teal-500/10",
      description: "text-slate-400",
    },
  });
}

export function showDemoSimulatedToast() {
  toast("Cambio realtime simulado", {
    description: "Se aplicó una actualización de demostración al dashboard.",
    icon: createElement(Zap, { className: "size-4 text-amber-400" }),
    duration: 3000,
    classNames: {
      toast:
        "border border-amber-500/20 bg-[#1E293B] text-white shadow-xl shadow-amber-500/10",
      description: "text-slate-400",
    },
  });
}

export function showRefreshToast() {
  toast.success("Dashboard actualizado", {
    description: "Datos sincronizados correctamente.",
    duration: 2500,
    classNames: {
      toast: "border border-[#14B8A6]/20 bg-[#1E293B] text-white",
      description: "text-slate-400",
    },
  });
}

export function showSupabaseErrorToast(message: string) {
  toast.error("Error de conexión", {
    description: message,
    duration: 5000,
    classNames: {
      toast: "border border-red-500/20 bg-[#1E293B] text-white",
      description: "text-slate-400",
    },
  });
}
