import { NextResponse } from "next/server";
import { getAppMode, isClerkConfigured, isStripeConfigured, isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  const mode = getAppMode();

  return NextResponse.json({
    status: "ok",
    mode,
    service: "vexride",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    integrations: {
      clerk: isClerkConfigured(),
      supabase: isSupabaseConfigured(),
      stripe: isStripeConfigured(),
    },
  });
}
