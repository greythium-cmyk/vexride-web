import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/lib/supabase/types";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Server-side Supabase client authenticated via Clerk JWT (supabase template).
 * Use in Server Components, Route Handlers, and Server Actions.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseConfigured()) return null;

  const { getToken, userId } = await auth();
  const token = await getToken({ template: "supabase" });

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      },
    }
  );
}

export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
