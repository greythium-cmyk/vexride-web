"use client";

import { Toaster } from "sonner";
import "sonner/dist/styles.css";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors={false}
      toastOptions={{
        classNames: {
          toast: "font-sans",
          closeButton: "border-white/10 bg-[#1E293B] text-slate-300",
        },
      }}
    />
  );
}
