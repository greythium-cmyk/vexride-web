"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Search, MapPin, Calendar, Check, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { cn } from "@/lib/utils";

interface FormData {
  origin: string;
  destination: string;
  datetime: string;
  seats: string;
}

const initialForm: FormData = {
  origin: "Brooklyn Heights",
  destination: "Midtown Manhattan",
  datetime: "2026-07-01T08:15",
  seats: "3",
};

export function NewCarpoolModal() {
  const {
    showNewCarpoolModal,
    setShowNewCarpoolModal,
    newCarpoolMode,
    setNewCarpoolMode,
    carpoolStep,
    setCarpoolStep,
  } = useDashboard();

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const steps = ["Ruta", "Horario", "Confirmar"];
  const isOffer = newCarpoolMode === "offer";

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    if (step === 0) {
      if (!form.origin.trim()) newErrors.origin = "Origen requerido";
      if (!form.destination.trim()) newErrors.destination = "Destino requerido";
    }
    if (step === 1 && !form.datetime) {
      newErrors.datetime = "Fecha y hora requeridas";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(carpoolStep)) {
      setCarpoolStep(Math.min(carpoolStep + 1, 2));
    }
  };

  const prevStep = () => setCarpoolStep(Math.max(carpoolStep - 1, 0));

  const handleClose = () => {
    setShowNewCarpoolModal(false);
    setCarpoolStep(0);
    setSubmitted(false);
    setErrors({});
  };

  const handleSubmit = () => {
    if (validateStep(1)) {
      setSubmitted(true);
      setTimeout(handleClose, 2000);
    }
  };

  return (
    <Dialog open={showNewCarpoolModal} onOpenChange={handleClose}>
      <DialogContent className="border-white/10 bg-[#1E293B] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isOffer ? "Ofrecer viaje" : "Buscar nuevo carpool"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isOffer
              ? "Publica tu ruta y Vex AI hará el matching automático."
              : "Vex AI encontrará los mejores matches para tu ruta."}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          {(["search", "offer"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setNewCarpoolMode(mode);
                setCarpoolStep(0);
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50",
                newCarpoolMode === mode
                  ? "bg-gradient-vex text-[#0F172A]"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {mode === "search" ? <Search className="size-4" /> : <Car className="size-4" />}
              {mode === "search" ? "Buscar" : "Ofercer"}
            </button>
          ))}
        </div>

        {/* Step indicator */}
        <div className="mb-4 flex items-center justify-between px-2">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i <= carpoolStep
                    ? "bg-gradient-vex text-[#0F172A]"
                    : "bg-white/10 text-slate-500"
                )}
              >
                {i < carpoolStep ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span className="ml-1.5 hidden text-xs text-slate-400 sm:inline">{label}</span>
              {i < steps.length - 1 && (
                <div className={cn("mx-2 h-px flex-1", i < carpoolStep ? "bg-[#14B8A6]" : "bg-white/10")} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-[#14B8A6]/20">
                <Check className="size-8 text-[#14B8A6]" />
              </div>
              <p className="mt-4 font-semibold text-white">
                {isOffer ? "¡Viaje publicado!" : "¡Buscando matches!"}
              </p>
              <p className="mt-1 text-sm text-slate-400">Vex AI está procesando tu solicitud...</p>
            </motion.div>
          ) : (
            <motion.div
              key={carpoolStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {carpoolStep === 0 && (
                <>
                  <div>
                    <Label htmlFor="origin" className="text-slate-400">
                      <MapPin className="mr-1 inline size-3.5" aria-hidden />
                      Origen
                    </Label>
                    <Input
                      id="origin"
                      value={form.origin}
                      onChange={(e) => setForm({ ...form, origin: e.target.value })}
                      className={cn("mt-1.5 border-white/10 bg-white/5 text-white", errors.origin && "border-red-500/50")}
                      aria-invalid={!!errors.origin}
                    />
                    {errors.origin && <p className="mt-1 text-xs text-red-400">{errors.origin}</p>}
                  </div>
                  <div>
                    <Label htmlFor="destination" className="text-slate-400">Destino</Label>
                    <Input
                      id="destination"
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className={cn("mt-1.5 border-white/10 bg-white/5 text-white", errors.destination && "border-red-500/50")}
                      aria-invalid={!!errors.destination}
                    />
                    {errors.destination && <p className="mt-1 text-xs text-red-400">{errors.destination}</p>}
                  </div>
                </>
              )}

              {carpoolStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="datetime" className="text-slate-400">
                      <Calendar className="mr-1 inline size-3.5" aria-hidden />
                      Fecha y hora
                    </Label>
                    <Input
                      id="datetime"
                      type="datetime-local"
                      value={form.datetime}
                      onChange={(e) => setForm({ ...form, datetime: e.target.value })}
                      className={cn("mt-1.5 border-white/10 bg-white/5 text-white", errors.datetime && "border-red-500/50")}
                      aria-invalid={!!errors.datetime}
                    />
                    {errors.datetime && <p className="mt-1 text-xs text-red-400">{errors.datetime}</p>}
                  </div>
                  {isOffer && (
                    <div>
                      <Label htmlFor="seats" className="text-slate-400">Asientos disponibles</Label>
                      <Input
                        id="seats"
                        type="number"
                        min={1}
                        max={6}
                        value={form.seats}
                        onChange={(e) => setForm({ ...form, seats: e.target.value })}
                        className="mt-1.5 border-white/10 bg-white/5 text-white"
                      />
                    </div>
                  )}
                </>
              )}

              {carpoolStep === 2 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ruta</span>
                    <span className="font-medium text-white">{form.origin} → {form.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha</span>
                    <span className="text-white">{new Date(form.datetime).toLocaleString("es")}</span>
                  </div>
                  {isOffer && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asientos</span>
                      <span className="text-white">{form.seats}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Modo</span>
                    <span className="text-[#14B8A6]">{isOffer ? "Ofrecer viaje" : "Buscar carpool"}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!submitted && (
          <div className="mt-2 flex gap-2">
            {carpoolStep > 0 && (
              <Button variant="outline" onClick={prevStep} className="border-white/10 text-slate-300">
                <ArrowLeft className="size-4" aria-hidden />
                Atrás
              </Button>
            )}
            {carpoolStep < 2 ? (
              <Button onClick={nextStep} className="ml-auto flex-1 bg-gradient-vex font-semibold text-[#0F172A]">
                Siguiente
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto flex-1 bg-gradient-vex font-semibold text-[#0F172A]">
                {isOffer ? "Publicar viaje" : "Buscar con Vex AI"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
