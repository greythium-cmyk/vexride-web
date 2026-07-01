import { Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { SignUpPageClient } from "@/components/auth/sign-up-page-client";
import { isClerkConfigured } from "@/lib/env";

function SignUpFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
      <Loader2 className="size-8 animate-spin text-[#14B8A6]" aria-hidden />
    </div>
  );
}

async function SignUpWithSession({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim() || undefined;

  return <SignUpPageClient sessionId={sessionId} />;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] px-4 text-center">
        <h1 className="text-2xl font-bold text-white">Clerk no configurado</h1>
        <p className="mt-2 text-slate-400">
          Configura las variables de entorno para habilitar registro.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 rounded-xl bg-gradient-vex px-6 py-3 font-semibold text-[#0F172A]"
        >
          Ir al dashboard (modo demo)
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={<SignUpFallback />}>
      <SignUpWithSession searchParams={searchParams} />
    </Suspense>
  );
}
