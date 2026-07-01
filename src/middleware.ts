import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { isClerkMiddlewareEnabled } from "@/lib/env";

/** Marketing pages — safe to serve even if Clerk throws. */
const isMarketingRoute = createRouteMatcher(["/", "/pricing"]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/vex-ai"]);

/**
 * Clerk runs on all matched routes (including /api/stripe/checkout) so auth()
 * can read the session when the user is signed in. Only dashboard routes
 * require authentication; everything else stays public.
 */
const clerkAuthMiddleware = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!isClerkMiddlewareEnabled()) {
    return NextResponse.next();
  }

  try {
    return await clerkAuthMiddleware(req, event);
  } catch (error) {
    if (isMarketingRoute(req)) {
      return NextResponse.next();
    }
    console.error("[middleware] Clerk invocation failed, allowing request:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
