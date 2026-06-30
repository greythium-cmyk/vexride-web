"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  className?: string;
}

const THRESHOLD = 72;
const MAX_PULL = 120;

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const scrollEl = useRef<HTMLElement | null>(null);

  const canPull = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (window.innerWidth >= 1024) return false;
    const scrollTop =
      scrollEl.current?.scrollTop ??
      document.documentElement.scrollTop ??
      document.body.scrollTop ??
      0;
    return scrollTop <= 0;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (refreshing || !canPull()) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    },
    [refreshing, canPull]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        setPull(0);
        return;
      }
      if (!canPull()) {
        pulling.current = false;
        setPull(0);
        return;
      }
      setPull(Math.min(MAX_PULL, delta * 0.45));
    },
    [refreshing, canPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPull(THRESHOLD * 0.6);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
      return;
    }

    setPull(0);
  }, [pull, refreshing, onRefresh]);

  const progress = Math.min(1, pull / THRESHOLD);

  return (
    <div
      ref={(el) => {
        scrollEl.current = el?.closest("main") ?? document.documentElement;
      }}
      className={cn("relative touch-pan-y", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {(pull > 8 || refreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center lg:hidden"
            style={{ transform: `translateY(${Math.min(pull, MAX_PULL) - 8}px)` }}
          >
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md",
                progress >= 1 || refreshing
                  ? "border-[#14B8A6]/30 bg-[#14B8A6]/15 text-[#14B8A6]"
                  : "border-white/10 bg-[#1E293B]/90 text-slate-400"
              )}
            >
              <RefreshCw
                className={cn("size-3.5", refreshing && "animate-spin")}
                style={{
                  transform: refreshing ? undefined : `rotate(${progress * 180}deg)`,
                }}
              />
              {refreshing
                ? "Actualizando…"
                : progress >= 1
                  ? "Suelta para actualizar"
                  : "Desliza para actualizar"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: refreshing ? 12 : pull > 0 ? pull * 0.35 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
