import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/env";
import Link from "next/link";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] px-4 text-center">
        <h1 className="text-2xl font-bold text-white">Clerk no configurado</h1>
        <p className="mt-2 text-slate-400">
          Copia <code className="text-[#14B8A6]">.env.example</code> a{" "}
          <code className="text-[#14B8A6]">.env.local</code> y añade tus claves.
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
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[#1E293B] border border-white/10 shadow-2xl",
          },
        }}
      />
    </div>
  );
}
