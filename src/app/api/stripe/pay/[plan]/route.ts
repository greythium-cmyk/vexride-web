import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { getProfileByClerkId } from "@/lib/stripe/subscription-db";
import { getStripePriceId, type PlanId } from "@/lib/subscription/plans";
import { buildStripeCheckoutSuccessUrl } from "@/lib/stripe/checkout-urls";
import { isClerkConfigured, isStripeConfigured } from "@/lib/env";

const PAID_PLANS: PlanId[] = ["starter", "pro", "enterprise"];

export async function GET(
  _req: Request,
  context: { params: Promise<{ plan: string }> }
) {
  const { plan } = await context.params;
  const planId = plan.toLowerCase() as PlanId;

  if (!PAID_PLANS.includes(planId)) {
    return NextResponse.redirect(new URL("/pricing", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }

  if (!isStripeConfigured()) {
    return NextResponse.redirect(new URL("/pricing?checkout=demo", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }

  const priceId = getStripePriceId(planId);
  if (!priceId) {
    return NextResponse.redirect(new URL("/pricing?checkout=unavailable", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }

  let userId: string | null = null;
  let email: string | undefined;

  if (isClerkConfigured()) {
    try {
      const session = await auth();
      userId = session.userId ?? null;
      email = session.sessionClaims?.email as string | undefined;
    } catch {
      // Guest checkout when Clerk middleware is disabled.
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
    const isGuest = !userId;
    const successUrl = buildStripeCheckoutSuccessUrl(appUrl, planId, isGuest);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
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

    if (!checkoutSession.url) {
      return NextResponse.redirect(`${appUrl}/pricing?checkout=error`);
    }

    return NextResponse.redirect(checkoutSession.url);
  } catch (error) {
    console.error("[Stripe pay redirect]", { planId, priceId, error });
    return NextResponse.redirect(`${appUrl}/pricing?checkout=error`);
  }
}
