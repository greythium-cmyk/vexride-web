"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Plus, Search, X } from "lucide-react";
import { useDashboard } from "@/components/dashboard/dashboard-context";

export function FloatingActionButton() {
  const { setShowNewCarpoolModal, setNewCarpoolMode } = useDashboard();
  const [expanded, setExpanded] = useState(false);

  const openModal = (mode: "search" | "offer") => {
    setNewCarpoolMode(mode);
    setShowNewCarpoolModal(true);
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <>
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ delay: 0.05 }}
              onClick={() => openModal("search")}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1E293B] px-5 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-xl hover:border-[#14B8A6]/30"
            >
              <Search className="size-4 text-[#14B8A6]" />
              Buscar carpool
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={() => openModal("offer")}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1E293B] px-5 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-xl hover:border-[#22D3EE]/30"
            >
              <Car className="size-4 text-[#22D3EE]" />
              Ofrecer viaje
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="flex size-14 items-center justify-center rounded-full bg-gradient-vex shadow-2xl shadow-teal-500/40 transition-shadow hover:shadow-teal-500/60"
        aria-label={expanded ? "Cerrar menú" : "Nuevo carpool"}
      >
        {expanded ? (
          <X className="size-6 text-[#0F172A]" />
        ) : (
          <Plus className="size-6 text-[#0F172A]" />
        )}
      </motion.button>
    </div>
  );
}
