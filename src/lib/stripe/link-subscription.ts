import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { updateProfileSubscription } from "@/lib/stripe/subscription-db";
import { normalizePlanId, type PlanId } from "@/lib/subscription/plans";
import { isStripeConfigured } from "@/lib/env";

function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

async function resolveCheckoutSessionEmail(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<string | null> {
  if (session.customer_details?.email) {
    return session.customer_details.email;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  if (!customerId) return null;

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return customer.email ?? null;
}

export async function linkStripeCustomerToClerkUser(
  clerkUserId: string,
  clerkEmail: string,
  data: {
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    planId: PlanId;
    subscriptionStatus?: string;
  }
): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;

  const linked = await updateProfileSubscription(clerkUserId, {
    plan: data.planId,
    stripeCustomerId: data.stripeCustomerId,
    stripeSubscriptionId: data.stripeSubscriptionId,
    subscriptionStatus: data.subscriptionStatus ?? "active",
  });

  if (!linked) return false;

  try {
    await stripe.customers.update(data.stripeCustomerId, {
      metadata: { clerkUserId },
    });
    await stripe.subscriptions.update(data.stripeSubscriptionId, {
      metadata: { planId: data.planId, clerkUserId },
    });
  } catch (error) {
    console.error("[Stripe] Metadata update after link failed:", error);
  }

  return true;
}

export async function linkCheckoutSessionToClerkUser(
  clerkUserId: string,
  clerkEmail: string,
  sessionId: string
): Promise<{ ok: true; planId: PlanId } | { ok: false; error: string }> {
  if (!isStripeConfigured()) {
    return { ok: false, error: "Stripe no configurado" };
  }

  const stripe = getStripe()!;
  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });
  } catch {
    return { ok: false, error: "Sesión de checkout no encontrada" };
  }

  if (session.status !== "complete") {
    return { ok: false, error: "El pago aún no está completado" };
  }

  const sessionEmail = await resolveCheckoutSessionEmail(stripe, session);
  if (!sessionEmail) {
    return { ok: false, error: "No se encontró el correo del pago" };
  }

  if (!emailsMatch(sessionEmail, clerkEmail)) {
    return {
      ok: false,
      error: "El correo de registro debe coincidir con el del pago en Stripe",
    };
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  const subscriptionRaw = session.subscription;
  const subscriptionId =
    typeof subscriptionRaw === "string"
      ? subscriptionRaw
      : subscriptionRaw?.id;

  if (!customerId || !subscriptionId) {
    return { ok: false, error: "Datos de suscripción incompletos" };
  }

  const planId = normalizePlanId(session.metadata?.planId) as PlanId;
  const subscriptionStatus =
    typeof subscriptionRaw === "object" && subscriptionRaw && "status" in subscriptionRaw
      ? subscriptionRaw.status
      : "active";

  const linked = await linkStripeCustomerToClerkUser(clerkUserId, clerkEmail, {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    planId,
    subscriptionStatus,
  });

  if (!linked) {
    return { ok: false, error: "No se pudo vincular la suscripción al perfil" };
  }

  return { ok: true, planId };
}

/** Links an active Stripe subscription to a new Clerk user by matching email. */
export async function linkPendingStripeByEmail(
  clerkUserId: string,
  email: string
): Promise<boolean> {
  if (!isStripeConfigured() || !email.trim()) return false;

  const stripe = getStripe()!;
  const customers = await stripe.customers.list({ email: email.trim(), limit: 5 });

  for (const customer of customers.data) {
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 5,
    });

    const activeSub = subs.data.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    if (!activeSub) continue;

    const planId = normalizePlanId(activeSub.metadata?.planId) as PlanId;
    return linkStripeCustomerToClerkUser(clerkUserId, email, {
      stripeCustomerId: customer.id,
      stripeSubscriptionId: activeSub.id,
      planId,
      subscriptionStatus: activeSub.status,
    });
  }

  return false;
}
