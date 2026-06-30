"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { DataSource } from "@/lib/types/dashboard";
import type { CompanionMessage } from "@/lib/supabase/mappers";
import { companionChannelKey } from "@/lib/supabase/mappers";
import {
  fetchCompanionMessages,
  sendCompanionMessage as persistMessage,
} from "@/lib/supabase/queries";
import { realtimeLogger } from "@/lib/realtime/logger";
import {
  subscribeCompanionChat,
  unsubscribeChannel,
} from "@/lib/supabase/realtime";

interface UseCompanionChatOptions {
  supabase: SupabaseClient<Database> | null;
  profileId: string | null;
  source: DataSource;
  companion: { name: string; avatar: string } | null;
  userAvatar: string;
}

const DEMO_REPLIES = [
  "Perfecto, te espero en el punto de encuentro.",
  "Llego en 3 minutos, tráfico ligero en la bridge.",
  "¿Prefieres ventana o pasillo? Tengo asiento libre atrás.",
  "Confirmado — activé Modo Trabajo Wi-Fi en el auto.",
];

export function useCompanionChat({
  supabase,
  profileId,
  source,
  companion,
  userAvatar,
}: UseCompanionChatOptions) {
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatConnected, setChatConnected] = useState(false);
  const pendingIds = useRef<Set<string>>(new Set());

  // Load history + subscribe
  useEffect(() => {
    if (!companion) {
      setMessages([]);
      setChatConnected(false);
      return;
    }

    let cancelled = false;
    let channel: ReturnType<typeof subscribeCompanionChat> | null = null;

    async function init() {
      setLoading(true);

      if (source === "supabase" && supabase && profileId) {
        const history = await fetchCompanionMessages(
          supabase,
          profileId,
          companion!.avatar
        );
        if (!cancelled) setMessages(history);

        channel = subscribeCompanionChat(
          supabase,
          profileId,
          companion!.avatar,
          {
            onStatus: (s) => setChatConnected(s === "connected"),
            onMessage: (msg) => {
              if (pendingIds.current.has(msg.id)) return;
              setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
              });
            },
          }
        );
      } else {
        // Demo: seed + simulated companion presence
        setMessages([
          {
            id: "demo-1",
            from: "them",
            text: `¡Hola! Soy ${companion!.name}. Confirmado para mañana — salgo puntual a las 8:15 AM 👍`,
            time: "09:12",
            createdAt: new Date().toISOString(),
          },
        ]);
        setChatConnected(true);
      }

      if (!cancelled) setLoading(false);
    }

    void init();

    return () => {
      cancelled = true;
      if (channel && supabase) {
        realtimeLogger.info("companion-chat", "Unsubscribing companion channel");
        unsubscribeChannel(supabase, channel);
      }
    };
  }, [companion, source, supabase, profileId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !companion || isSending) return;

      const now = new Date();
      const optimistic: CompanionMessage = {
        id: `opt-${now.getTime()}`,
        from: "me",
        text: text.trim(),
        time: now.toLocaleTimeString("es", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: now.toISOString(),
      };

      setIsSending(true);
      setMessages((prev) => [...prev, optimistic]);

      if (source === "supabase" && supabase && profileId) {
        const saved = await persistMessage(
          supabase,
          profileId,
          companion.avatar,
          text.trim(),
          "user"
        );
        if (saved) {
          pendingIds.current.add(saved.id);
          setMessages((prev) =>
            prev.map((m) => (m.id === optimistic.id ? saved : m))
          );
          setTimeout(() => pendingIds.current.delete(saved.id), 2000);
        }
        setIsSending(false);
        return;
      }

      // Demo: simulated reply after delay
      setTimeout(() => {
        const reply =
          DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
        setMessages((prev) => [
          ...prev,
          {
            id: `demo-reply-${Date.now()}`,
            from: "them",
            text: reply,
            time: new Date().toLocaleTimeString("es", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsSending(false);
      }, 1200);
    },
    [companion, isSending, source, supabase, profileId]
  );

  return {
    messages,
    loading,
    isSending,
    chatConnected,
    sendMessage,
    userAvatar,
    companion,
    channelLabel: companion ? companionChannelKey(companion.avatar) : null,
  };
}
