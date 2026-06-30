import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vexride.app";
const title = "Dashboard — Vexride";
const description =
  "Panel de control de Vexride. Gestiona carpools, matches en vivo, Vex AI y notificaciones en tiempo real.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    type: "website",
    url: `${appUrl}/dashboard`,
    siteName: "Vexride",
    locale: "es_ES",
    images: [
      {
        url: `${appUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: "Vexride Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [`${appUrl}/icon.svg`],
  },
  alternates: {
    canonical: `${appUrl}/dashboard`,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
