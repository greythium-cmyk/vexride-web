"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2, Zap } from "lucide-react";
import { isClerkConfigured } from "@/lib/env";

export function AuthLoadingGate({ children }: { children: React.ReactNode }) {
  const configured = isClerkConfigured();

  if (!configured) return <>{children}</>;

  return <AuthLoadingInner>{children}</AuthLoadingInner>;
}

function AuthLoadingInner({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0F172A]">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-vex shadow-lg shadow-teal-500/20">
          <Zap className="size-7 text-[#0F172A]" fill="currentColor" aria-hidden />
        </div>
        <Loader2 className="size-6 animate-spin text-[#14B8A6]" aria-hidden />
        <p className="text-sm text-slate-400">Cargando sesión…</p>
      </div>
    );
  }

  return <>{children}</>;
}
