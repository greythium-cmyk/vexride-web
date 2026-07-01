import Link from "next/link";
import { Zap } from "lucide-react";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios — Vexride",
  description:
    "Planes Freemium, Starter, Pro y Enterprise. Suscripciones con Stripe y modo demo incluido.",
  openGraph: {
    title: "Precios — Vexride",
    description: "Elige el plan perfecto para tu commute inteligente.",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <header className="border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-vex">
              <Zap className="size-4 text-[#0F172A]" fill="currentColor" />
            </div>
            Vexride
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-gradient-vex px-3 py-1.5 text-sm font-semibold text-[#0F172A] hover:opacity-90"
            >
              Empezar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <PricingPlans />
        <p className="mt-8 text-center text-xs text-slate-500">
          Pagos procesados por Stripe. Modo demo disponible sin configuración.
        </p>
      </main>
    </div>
  );
}
