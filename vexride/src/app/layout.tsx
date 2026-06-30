import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vexride — Carpooling Inteligente para Traslados Laborales",
  description:
    "Vexride es la plataforma predictiva más inteligente de carpooling para traslados laborales. IA avanzada, Vex AI 24/7 y matching automático basado en calendario y ubicación.",
  keywords: [
    "carpooling",
    "traslados laborales",
    "movilidad inteligente",
    "Greythium",
    "Vexride",
    "IA predictiva",
  ],
  openGraph: {
    title: "Vexride — Movilidad Inteligente por Greythium",
    description:
      "Organiza carpools automáticamente con IA. Calendario, ubicación en tiempo real y preferencias del usuario.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
