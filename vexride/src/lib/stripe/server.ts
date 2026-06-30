import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/env";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return stripeInstance;
}
