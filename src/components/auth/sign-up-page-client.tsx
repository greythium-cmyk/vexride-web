"use client";

import { useEffect, useRef, useState } from "react";
import { SignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const clerkAppearance = {
  variables: {
    colorPrimary: "#14B8A6",
    colorBackground: "#0F172A",
    colorInputBackground: "#1E293B",
    colorText: "#F8FAFC",
    borderRadius: "0.75rem",
  },
  elements: {
    formButtonPrimary:
      "bg-gradient-to-r from-[#14B8A6] to-[#22D3EE] text-[#0F172A] font-semibold",
    card: "bg-[#1E293B] border border-white/10 shadow-2xl",
    headerTitle: "text-white",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButton: "border-white/10 bg-white/5 text-white",
    formFieldInput: "border-white/10 bg-white/5 text-white",
    footerActionLink: "text-[#14B8A6]",
  },
};

interface SignUpPageClientProps {
  sessionId?: string;
}

export function SignUpPageClient({ sessionId }: SignUpPageClientProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [linking, setLinking] = useState(false);
  const linkAttempted = useRef(false);

  const afterSignUpUrl = sessionId
    ? `/sign-up?session_id=${encodeURIComponent(sessionId)}`
    : "/dashboard";

  useEffect(() => {
    if (!sessionId || !isLoaded || !isSignedIn || linkAttempted.current) return;

    linkAttempted.current = true;
    setLinking(true);

    void (async () => {
      try {
        const res = await fetch("/api/stripe/link-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        });

        const data = (await res.json()) as { ok?: boolean; planId?: string; error?: string };

        if (!res.ok) {
          toast.error(data.error ?? "No se pudo vincular tu pago");
          router.replace("/dashboard");
          return;
        }

        toast.success("¡Pago vinculado!", {
          description: `Tu plan ${data.planId ?? "Pro"} está activo.`,
        });
        router.replace(`/dashboard?checkout=success&plan=${data.planId ?? "pro"}`);
      } catch {
        toast.error("Error al vincular la suscripción");
        router.replace("/dashboard");
      } finally {
        setLinking(false);
      }
    })();
  }, [sessionId, isLoaded, isSignedIn, router]);

  if (linking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0F172A] px-4 text-center">
        <Loader2 className="size-8 animate-spin text-[#14B8A6]" aria-hidden />
        <p className="text-slate-300">Vinculando tu pago con tu cuenta…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] px-4 py-8">
      {sessionId && (
        <p className="mb-6 max-w-md text-center text-sm text-slate-400">
          Completa tu registro con el{" "}
          <span className="font-medium text-[#14B8A6]">mismo correo</span> que
          usaste en Stripe para activar tu plan.
        </p>
      )}
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl={afterSignUpUrl}
        forceRedirectUrl={afterSignUpUrl}
      />
    </div>
  );
}
