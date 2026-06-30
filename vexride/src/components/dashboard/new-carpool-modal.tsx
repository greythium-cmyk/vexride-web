"use client";

import { Car, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/components/dashboard/dashboard-context";

export function NewCarpoolModal() {
  const {
    showNewCarpoolModal,
    setShowNewCarpoolModal,
    newCarpoolMode,
    setNewCarpoolMode,
  } = useDashboard();

  return (
    <Dialog
      open={showNewCarpoolModal}
      onOpenChange={setShowNewCarpoolModal}
    >
      <DialogContent className="border-white/10 bg-[#1E293B] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {newCarpoolMode === "search"
              ? "Buscar nuevo carpool"
              : "Ofrecer viaje"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {newCarpoolMode === "search"
              ? "Vex AI encontrará los mejores matches para tu ruta."
              : "Publica tu ruta y deja que Vex AI haga el matching."}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setNewCarpoolMode("search")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
              newCarpoolMode === "search"
                ? "bg-gradient-vex text-[#0F172A]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Search className="size-4" />
            Buscar
          </button>
          <button
            type="button"
            onClick={() => setNewCarpoolMode("offer")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
              newCarpoolMode === "offer"
                ? "bg-gradient-vex text-[#0F172A]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Car className="size-4" />
            Ofrecer
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Origen
            </label>
            <Input
              placeholder="Ej: Brooklyn Heights"
              className="border-white/10 bg-white/5 text-white"
              defaultValue="Brooklyn Heights"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Destino
            </label>
            <Input
              placeholder="Ej: Midtown Manhattan"
              className="border-white/10 bg-white/5 text-white"
              defaultValue="Midtown Manhattan"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Fecha y hora
            </label>
            <Input
              type="datetime-local"
              className="border-white/10 bg-white/5 text-white"
              defaultValue="2026-07-01T08:15"
            />
          </div>
        </div>

        <Button
          className="mt-2 w-full bg-gradient-vex font-semibold text-[#0F172A] hover:opacity-90"
          onClick={() => setShowNewCarpoolModal(false)}
        >
          {newCarpoolMode === "search"
            ? "Buscar matches con Vex AI"
            : "Publicar viaje"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
