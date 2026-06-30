"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppToaster } from "@/components/providers/app-toaster";
import { PwaRegister } from "@/components/pwa-register";
import { isClerkConfigured } from "@/lib/env";

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
    card: "bg-[#1E293B] border border-white/10",
    headerTitle: "text-white",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButton: "border-white/10 bg-white/5 text-white",
    formFieldInput: "border-white/10 bg-white/5 text-white",
    footerActionLink: "text-[#14B8A6]",
  },
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  const inner = (
    <>
      <TooltipProvider delay={300}>{children}</TooltipProvider>
      <AppToaster />
      <PwaRegister />
    </>
  );

  if (!isClerkConfigured()) {
    return inner;
  }

  return (
    <ClerkProvider
      appearance={clerkAppearance}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {inner}
    </ClerkProvider>
  );
}
