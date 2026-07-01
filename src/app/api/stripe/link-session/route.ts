import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { linkCheckoutSessionToClerkUser } from "@/lib/stripe/link-subscription";
import { isClerkConfigured } from "@/lib/env";

export async function POST(req: Request) {
  if (!isClerkConfigured()) {
    return NextResponse.json({ error: "Clerk no configurado" }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const clerkEmail =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;

  if (!clerkEmail) {
    return NextResponse.json({ error: "Email no disponible" }, { status: 400 });
  }

  const body = (await req.json()) as { sessionId?: string };
  const sessionId = body.sessionId?.trim();

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId requerido" }, { status: 400 });
  }

  const result = await linkCheckoutSessionToClerkUser(
    userId,
    clerkEmail,
    sessionId
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, planId: result.planId });
}
