import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/env";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/health(.*)",
  "/api/stripe/checkout",
]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/vex-ai"]);

/** Demo mode: skip Clerk entirely — clerkMiddleware throws without a publishable key. */
function demoMiddleware(_req: NextRequest) {
  return NextResponse.next();
}

const clerkAuthMiddleware = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

/** Protect dashboard when Clerk is configured; allow open access in demo mode. */
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) {
    return demoMiddleware(req);
  }

  return clerkAuthMiddleware(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
