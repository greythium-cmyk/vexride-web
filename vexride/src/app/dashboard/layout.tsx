import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Vexride",
  description: "Panel de control de Vexride. Gestiona tus carpools, matches y Vex AI.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
