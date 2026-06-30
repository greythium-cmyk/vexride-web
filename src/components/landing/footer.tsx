import Link from "next/link";
import { Mail, MapPin, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  producto: [
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Vex AI 24/7", href: "#vex-ai" },
    { label: "Precios", href: "#precios" },
    { label: "Oferta de lanzamiento", href: "#oferta" },
  ],
  empresa: [
    { label: "Quiénes somos", href: "#nosotros" },
    { label: "Greythium Inc.", href: "#nosotros" },
    { label: "PitchAutopsy.com", href: "https://pitchautopsy.com" },
  ],
  legal: [
    { label: "Términos de servicio", href: "#" },
    { label: "Política de privacidad", href: "#" },
    { label: "Disclaimer de viajes", href: "#disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-vex">
                <Zap className="size-5 text-[#0F172A]" fill="currentColor" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Vexride</div>
                <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                  by Greythium Incorporated
                </div>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              La plataforma predictiva más inteligente de carpooling para
              traslados laborales. Movilidad inteligente y productividad, powered
              by IA.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:Greythium@gmail.com"
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-[#22D3EE]"
              >
                <Mail className="size-4" />
                Greythium@gmail.com
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="size-4" />
                Nueva York, Estados Unidos
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Producto
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.producto.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-[#14B8A6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Empresa
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-[#14B8A6]"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-[#14B8A6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div id="disclaimer" className="space-y-4">
          <p className="text-xs leading-relaxed text-slate-500">
            <strong className="text-slate-400">Disclaimer:</strong> Vexride y
            Greythium Incorporated no se hacen responsables de los acuerdos,
            seguridad o resultados de los viajes.
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            <strong className="text-slate-400">Precios:</strong> Greythium
            Incorporated se reserva el derecho de modificar precios con aviso de
            30 días.
          </p>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Greythium Incorporated. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-slate-600">
            Vexride — División tecnológica de Greythium
          </p>
        </div>
      </div>
    </footer>
  );
}
