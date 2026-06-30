"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";
import type { Database } from "@/lib/supabase/types";
import { isClerkConfigured, isSupabaseConfigured } from "@/lib/env";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!browserClient) {
    browserClient = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return browserClient;
}

/** Authenticated Supabase client via Clerk JWT — only when both are configured. */
export function useSupabaseClient() {
  const { session } = useSession();

  return useMemo(() => {
    if (!isSupabaseConfigured() || !isClerkConfigured()) return null;

    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: async (url, options = {}) => {
            const token = await session?.getToken({ template: "supabase" });
            const headers = new Headers(options.headers);
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return fetch(url, { ...options, headers });
          },
        },
      }
    );
  }, [session]);
}
