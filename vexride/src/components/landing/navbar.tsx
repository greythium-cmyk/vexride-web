"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#nosotros", label: "Quiénes somos" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#vex-ai", label: "Vex AI" },
  { href: "#precios", label: "Precios" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-vex shadow-lg shadow-teal-500/20">
            <Zap className="size-5 text-[#0F172A]" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-white">
              Vexride
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              by Greythium
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-[#22D3EE]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-white/5"
            render={<Link href="#precios" />}
          >
            Iniciar sesión
          </Button>
          <Button
            className="bg-gradient-vex font-semibold text-[#0F172A] shadow-lg shadow-teal-500/25 hover:opacity-90"
            render={<Link href="#oferta" />}
          >
            Comenzar gratis
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0F172A]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-[#22D3EE]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
              <Button
                variant="outline"
                className="w-full border-white/10 text-slate-300"
                render={<Link href="#precios" />}
              >
                Iniciar sesión
              </Button>
              <Button
                className="w-full bg-gradient-vex font-semibold text-[#0F172A]"
                render={<Link href="#oferta" />}
              >
                Comenzar gratis
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
