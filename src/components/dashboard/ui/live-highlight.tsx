"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiveHighlightProps {
  active: boolean;
  children: React.ReactNode;
  className?: string;
  accent?: "teal" | "cyan";
}

export function LiveHighlight({
  active,
  children,
  className,
  accent = "teal",
}: LiveHighlightProps) {
  const ring =
    accent === "cyan"
      ? "ring-[#22D3EE]/30 border-[#22D3EE]/40"
      : "ring-[#14B8A6]/30 border-[#14B8A6]/50";

  return (
    <motion.div
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 0 rgba(20, 184, 166, 0)",
                accent === "cyan"
                  ? "0 0 28px rgba(34, 211, 238, 0.22)"
                  : "0 0 28px rgba(20, 184, 166, 0.25)",
                "0 0 0 0 rgba(20, 184, 166, 0)",
              ],
            }
          : { boxShadow: "0 0 0px rgba(0,0,0,0)" }
      }
      transition={{ duration: 2.2, ease: "easeOut" }}
      className={cn(
        "rounded-2xl transition-[border-color,ring-color] duration-700",
        active && `live-highlight ring-1 ${ring}`,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
