export type AppMode = "demo" | "production";

/** Returns true when Supabase URL + anon key are configured. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Returns true when Clerk publishable key is set. */
export function isClerkConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

/** Returns true when OpenAI (or compatible) key exists for Vex AI streaming. */
export function isVexAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/** Returns true when Stripe secret key is configured. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Returns true when Stripe publishable key is on the client. */
export function isStripeClientConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

/** Returns true when Google Maps API key is set. */
export function isGoogleMapsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

/**
 * App runtime mode for health checks and UI badges.
 * - demo: no Clerk + Supabase (fully offline mock experience)
 * - production: at least Clerk or Supabase configured
 */
export function getAppMode(): AppMode {
  if (isClerkConfigured() || isSupabaseConfigured()) {
    return "production";
  }
  return "demo";
}
