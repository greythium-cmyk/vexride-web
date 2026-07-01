import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import {
  linkStripeCustomerToClerkUser,
} from "@/lib/stripe/link-subscription";
import { updateProfileByStripeCustomer } from "@/lib/stripe/subscription-db";
import { normalizePlanId, type PlanId } from "@/lib/subscription/plans";
import { isStripeConfigured } from "@/lib/env";

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return new Response("Stripe not configured", { status: 503 });
  }

  const stripe = getStripe()!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret missing", { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe webhook] Signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const planId = normalizePlanId(session.metadata?.planId) as PlanId;
        const clerkUserId = session.metadata?.clerkUserId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (clerkUserId && clerkUserId !== "anonymous") {
          await linkStripeCustomerToClerkUser(clerkUserId, "", {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            planId,
            subscriptionStatus: "active",
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const planId = normalizePlanId(sub.metadata?.planId) as PlanId;
        const customerId = sub.customer as string;
        const active = sub.status === "active" || sub.status === "trialing";

        await updateProfileByStripeCustomer(customerId, {
          plan: active ? planId : "free",
          stripeSubscriptionId: active ? sub.id : null,
          subscriptionStatus: sub.status,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[Stripe webhook] Handler error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
