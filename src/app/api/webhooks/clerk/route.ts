import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { linkPendingStripeByEmail } from "@/lib/stripe/link-subscription";

/**
 * Clerk webhook — syncs user.created / user.updated to Supabase profiles.
 * Configure in Clerk Dashboard → Webhooks → POST /api/webhooks/clerk
 */
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!WEBHOOK_SECRET || !supabaseUrl || !serviceKey) {
    return new Response("Webhook not configured", { status: 503 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address ?? "";
    const fullName =
      [first_name, last_name].filter(Boolean).join(" ") || "Usuario Vexride";
    const initials =
      first_name && last_name
        ? `${first_name[0]}${last_name[0]}`
        : fullName.slice(0, 2).toUpperCase();

    const { error } = await supabase.from("profiles").upsert(
      [
        {
          clerk_id: id,
          email,
          full_name: fullName,
          avatar_initials: initials,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "clerk_id" }
    );

    if (error) {
      console.error("[Clerk webhook] Profile upsert failed:", error);
      return new Response("Database error", { status: 500 });
    }

    if (evt.type === "user.created" && email) {
      await linkPendingStripeByEmail(id, email);
    }
  }

  return new Response("OK", { status: 200 });
}
