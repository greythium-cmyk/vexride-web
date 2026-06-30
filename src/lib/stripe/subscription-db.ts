import { createClient } from "@supabase/supabase-js";
import type { PlanId } from "@/lib/subscription/plans";
import { getPlan } from "@/lib/subscription/plans";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function updateProfileSubscription(
  clerkUserId: string,
  data: {
    plan?: PlanId;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
  }
): Promise<boolean> {
  const supabase = getServiceClient();
  if (!supabase) return false;

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.plan) payload.plan = getPlan(data.plan).name;
  if (data.stripeCustomerId) payload.stripe_customer_id = data.stripeCustomerId;
  if (data.stripeSubscriptionId !== undefined) {
    payload.stripe_subscription_id = data.stripeSubscriptionId;
  }
  if (data.subscriptionStatus) payload.subscription_status = data.subscriptionStatus;

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("clerk_id", clerkUserId);

  if (error) {
    console.error("[Stripe] Profile update failed:", error);
    return false;
  }
  return true;
}

export async function updateProfileByStripeCustomer(
  customerId: string,
  data: {
    plan?: PlanId;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
  }
): Promise<boolean> {
  const supabase = getServiceClient();
  if (!supabase) return false;

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.plan) payload.plan = getPlan(data.plan).name;
  if (data.stripeSubscriptionId !== undefined) {
    payload.stripe_subscription_id = data.stripeSubscriptionId;
  }
  if (data.subscriptionStatus) payload.subscription_status = data.subscriptionStatus;

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("[Stripe] Customer profile update failed:", error);
    return false;
  }
  return true;
}

export async function getProfileByClerkId(clerkUserId: string) {
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, clerk_id, email, plan, stripe_customer_id, stripe_subscription_id, subscription_status")
    .eq("clerk_id", clerkUserId)
    .single();

  return data;
}
