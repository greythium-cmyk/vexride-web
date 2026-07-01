import type { PlanId } from "@/lib/subscription/plans";

const GUEST_SIGNUP_PLANS: PlanId[] = ["pro", "enterprise"];

export function buildStripeCheckoutSuccessUrl(
  appUrl: string,
  planId: PlanId,
  isGuest: boolean
): string {
  if (isGuest && GUEST_SIGNUP_PLANS.includes(planId)) {
    return `${appUrl}/sign-up?session_id={CHECKOUT_SESSION_ID}`;
  }

  return `${appUrl}/dashboard?checkout=success&plan=${planId}`;
}
