"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#14B8A6", "#22D3EE", "#F59E0B", "#A78BFA", "#F472B6"];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotate: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 0.2,
    rotate: Math.random() * 360,
  }));
}

export function ProCelebration() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const plan = (e as CustomEvent<string>).detail;
      if (plan === "pro" || plan === "enterprise") {
        setParticles(createParticles(24));
        setActive(true);
        window.setTimeout(() => setActive(false), 3200);
      }
    };

    window.addEventListener("vexride:plan-updated", handler);
    return () => window.removeEventListener("vexride:plan-updated", handler);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
          aria-hidden
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{
                opacity: 1,
                x: `${p.x}vw`,
                y: "40vh",
                rotate: p.rotate,
                scale: 1,
              }}
              animate={{
                opacity: 0,
                y: `${10 + Math.random() * 80}vh`,
                rotate: p.rotate + 180,
                scale: 0.6,
              }}
              transition={{ duration: 2.2, delay: p.delay, ease: "easeOut" }}
              className="absolute size-2 rounded-sm"
              style={{ backgroundColor: p.color }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1 }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 rounded-2xl border border-[#14B8A6]/30 bg-[#1E293B]/95 px-6 py-4 text-center shadow-2xl shadow-teal-500/20 backdrop-blur-md"
          >
            <p className="text-lg font-bold text-white">¡Plan Pro activado!</p>
            <p className="mt-1 text-sm text-[#14B8A6]">Vex AI prioritario desbloqueado</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
