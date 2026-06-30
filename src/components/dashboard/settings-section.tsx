"use client";

import { UserProfile } from "@clerk/nextjs";
import { Settings, Bell, Shield, CreditCard, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { isClerkConfigured } from "@/lib/env";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export function SettingsSection() {
  const { data, source } = useDashboard();
  const { planLabel, openBillingPortal, startCheckout, isPaid } = useSubscription({
    planName: data.user.plan,
  });
  const [billingLoading, setBillingLoading] = useState(false);

  const handleBilling = async () => {
    setBillingLoading(true);
    try {
      if (isPaid) {
        const result = await openBillingPortal();
        if (result?.demo) {
          toast.info("Portal de facturación disponible con Stripe configurado");
        }
      } else {
        const result = await startCheckout("pro");
        if (result && "demo" in result && result.demo) {
          toast.success("Plan Pro activado en demo");
        }
      }
    } catch {
      toast.error("No se pudo abrir facturación");
    } finally {
      setBillingLoading(false);
    }
  };

  const settingsItems = [
    { icon: Bell, label: "Notificaciones", desc: "Push, email y recordatorios de viaje", action: null },
    { icon: Shield, label: "Seguridad", desc: "Verificación y contactos de emergencia", action: null },
    {
      icon: CreditCard,
      label: "Facturación",
      desc: `Plan ${planLabel} — gestionar suscripción`,
      action: handleBilling,
    },
  ];

  return (
    <section id="configuracion" className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Settings className="size-5 text-slate-400" aria-hidden />
        <div>
          <h2 className="font-semibold text-white">Configuración</h2>
          <p className="text-sm text-slate-400">Preferencias de cuenta y viaje</p>
        </div>
        <Badge className="ml-auto border-white/10 bg-white/5 text-slate-400">
          {source === "supabase" ? "Datos en vivo" : "Modo demo"}
        </Badge>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {settingsItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action ?? undefined}
            disabled={item.action ? billingLoading : false}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-[#14B8A6]/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50 disabled:opacity-60"
          >
            {billingLoading && item.action ? (
              <Loader2 className="size-5 animate-spin text-[#14B8A6]" aria-hidden />
            ) : (
              <item.icon className="size-5 text-[#14B8A6]" aria-hidden />
            )}
            <p className="mt-2 font-medium text-white">{item.label}</p>
            <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
          </button>
        ))}
      </div>

      {!isPaid && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-[#14B8A6]">Desbloquea Vexride Pro</p>
            <p className="text-sm text-slate-400">Vex AI prioritario, Premium Drivers y estadísticas avanzadas.</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-gradient-vex px-4 text-sm font-semibold text-[#0F172A] hover:opacity-90"
          >
            Ver planes
          </Link>
        </div>
      )}

      {isClerkConfigured() ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[#0F172A] border-0 shadow-none",
                navbar: "border-white/10",
                navbarButton: "text-slate-300",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-400",
                profileSectionTitle: "text-white",
                formFieldInput: "border-white/10 bg-white/5 text-white",
              },
            }}
          />
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
          Configura Clerk en <code className="text-[#14B8A6]">.env.local</code> para gestionar tu perfil de usuario.
        </p>
      )}
    </section>
  );
}
