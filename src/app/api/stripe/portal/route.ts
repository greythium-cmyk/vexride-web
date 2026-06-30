import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { getProfileByClerkId } from "@/lib/stripe/subscription-db";
import { isClerkConfigured, isStripeConfigured } from "@/lib/env";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ demo: true, message: "Portal no disponible en demo" });
  }

  if (!isClerkConfigured()) {
    return NextResponse.json({ error: "Auth required" }, { status: 401 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileByClerkId(userId);
  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account" }, { status: 404 });
  }

  const stripe = getStripe()!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const portal = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/dashboard#configuracion`,
  });

  return NextResponse.json({ url: portal.url });
}
