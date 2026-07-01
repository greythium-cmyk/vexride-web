import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { getProfileByClerkId } from "@/lib/stripe/subscription-db";
import { getPlan, getStripePriceId, type PlanId } from "@/lib/subscription/plans";
import { isClerkConfigured, isStripeConfigured } from "@/lib/env";

export async function POST(req: Request) {
  const body = (await req.json()) as { planId?: PlanId };
  const planId = body.planId;

  if (!planId || planId === "free") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({
      demo: true,
      planId,
      message: "Stripe no configurado — usa modo demo",
    });
  }

  const priceId = getStripePriceId(planId);
  if (!priceId) {
    return NextResponse.json(
      { error: `Price ID missing for ${planId}. Set ${getPlan(planId).stripePriceEnvKey} in env.` },
      { status: 503 }
    );
  }

  let userId: string | null = null;
  let email: string | undefined;

  if (isClerkConfigured()) {
    const session = await auth();
    userId = session.userId;
    email = session.sessionClaims?.email as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const stripe = getStripe()!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let customerId: string | undefined;
  if (userId) {
    const profile = await getProfileByClerkId(userId);
    customerId = profile?.stripe_customer_id ?? undefined;
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success&plan=${planId}`,
      cancel_url: `${appUrl}/pricing?checkout=canceled`,
      allow_promotion_codes: true,
      metadata: {
        planId,
        clerkUserId: userId ?? "anonymous",
      },
      subscription_data: {
        metadata: { planId, clerkUserId: userId ?? "anonymous" },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[Stripe checkout]", { planId, priceId, error });
    const message =
      error instanceof Error ? error.message : "Stripe checkout failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
