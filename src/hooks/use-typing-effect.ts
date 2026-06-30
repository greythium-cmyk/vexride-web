"use client";

import { useState, useEffect, useCallback } from "react";

/** Character-by-character typing effect for AI messages. */
export function useTypingEffect(
  text: string,
  enabled: boolean,
  speed = 18
): { displayed: string; isComplete: boolean } {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsComplete(true);
      return;
    }

    setDisplayed("");
    setIsComplete(false);
    let i = 0;

    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, enabled, speed]);

  return { displayed, isComplete };
}

/** Simulates initial dashboard data loading with optional delay. */
export function useSimulatedLoading(delayMs = 800): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  return loading;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  const getMatches = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  useEffect(() => {
    setMatches(getMatches());
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query, getMatches]);

  return matches;
}
