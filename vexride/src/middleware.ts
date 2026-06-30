import { NextResponse } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/env";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/health(.*)",
]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/vex-ai"]);

/** Protect dashboard when Clerk is configured; allow open access in mock-only dev mode. */
export default clerkMiddleware(async (auth, req) => {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
