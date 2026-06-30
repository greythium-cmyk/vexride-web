"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "development") return;

    void navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[Vexride PWA] Service worker registration failed:", err);
    });
  }, []);

  return null;
}
