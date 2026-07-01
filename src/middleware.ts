import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { isClerkMiddlewareEnabled } from "@/lib/env";

/** Marketing and public API routes — always pass through, never invoke Clerk. */
const isAlwaysPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/health(.*)",
  "/api/stripe/checkout",
  "/robots.txt",
  "/sitemap.xml",
]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/vex-ai"]);

function passthroughMiddleware(_req: NextRequest) {
  return NextResponse.next();
}

const clerkAuthMiddleware = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isAlwaysPublicRoute(req)) {
    return NextResponse.next();
  }

  if (!isClerkMiddlewareEnabled()) {
    return passthroughMiddleware(req);
  }

  try {
    return await clerkAuthMiddleware(req, event);
  } catch (error) {
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
