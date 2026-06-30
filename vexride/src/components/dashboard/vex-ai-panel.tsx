"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  MapPin,
  Users,
  DollarSign,
  Shield,
  Star,
  History,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { useSubscription } from "@/hooks/use-subscription";
import { VexAISkeleton } from "@/components/dashboard/ui/skeletons";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import { buildVexAIResponse, VEX_AI_SUGGESTED_PROMPTS } from "@/lib/vex-ai/responses";
import { vexAIChatHistory } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/types/dashboard";

const promptIcons = {
  MapPin,
  Users,
  DollarSign,
  Shield,
  Star,
};

function AssistantBubble({
  message,
  animateTyping,
}: {
  message: ChatMessage;
  animateTyping?: boolean;
}) {
  const { displayed, isComplete } = useTypingEffect(
    message.content.replace(/\*\*/g, ""),
    !!animateTyping,
    14
  );

  return (
    <div className="flex justify-start gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-vex">
        <Bot className="size-3.5 text-[#0F172A]" aria-hidden />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-slate-300">
        {animateTyping && !isComplete ? displayed : message.content.replace(/\*\*/g, "")}
        {!animateTyping || isComplete ? (
          <span className="mt-1.5 block text-[10px] text-slate-500">{message.timestamp}</span>
        ) : (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#14B8A6]" aria-hidden />
        )}
      </div>
    </div>
  );
}

export function VexAIPanel() {
  const { data, loading } = useDashboard();
  const { hasFeature, planLabel, isPro } = useSubscription({ planName: data.user.plan });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastAnimatedId, setLastAnimatedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!loading && !initialized.current) {
      initialized.current = true;
      setMessages([
        {
          ...vexAIChatHistory[0],
          content: vexAIChatHistory[0].content.replace(
            "Alex",
            data.user.name.split(" ")[0]
          ),
        },
      ]);
    }
  }, [loading, data.user.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date().toLocaleTimeString("es", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      let responseText: string;

      try {
        const useStreaming = hasFeature("vex_ai_priority");
        if (useStreaming) {
          const res = await fetch("/api/vex-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [...messages, userMsg].map((m) => ({
                role: m.role,
                content: m.content,
              })),
              context: {
                userName: data.user.name,
                data: {
                  quickStats: data.quickStats,
                  activeTrips: data.activeTrips,
                  availableMatches: data.availableMatches,
                },
              },
            }),
          });

          if (res.ok && res.headers.get("content-type")?.includes("text/plain")) {
            const raw = await res.text();
            responseText = raw
              .split("\n")
              .filter((l) => l.startsWith("0:"))
              .map((l) => JSON.parse(l.slice(2)))
              .join("");
          } else {
            responseText = buildVexAIResponse(text, {
              userName: data.user.name,
              data: {
                quickStats: data.quickStats,
                activeTrips: data.activeTrips,
                availableMatches: data.availableMatches,
              },
            });
          }
        } else {
          responseText = buildVexAIResponse(text, {
            userName: data.user.name,
            data: {
              quickStats: data.quickStats,
              activeTrips: data.activeTrips,
              availableMatches: data.availableMatches,
            },
          });
        }
      } catch {
        responseText = buildVexAIResponse(text, {
          userName: data.user.name,
          data: {
            quickStats: data.quickStats,
            activeTrips: data.activeTrips,
            availableMatches: data.availableMatches,
          },
        });
      }

      const aiId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiId,
        role: "assistant",
        content: responseText.replace(/\*\*/g, ""),
        timestamp: new Date().toLocaleTimeString("es", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLastAnimatedId(aiId);
      setIsTyping(false);
    },
    [isTyping, messages, data, hasFeature]
  );

  if (loading) {
    return (
      <section id="vex-ai" aria-busy="true">
        <VexAISkeleton />
      </section>
    );
  }

  return (
    <section id="vex-ai" aria-labelledby="vex-ai-heading">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-[#14B8A6]/20 bg-[#1E293B]/50 shadow-xl shadow-teal-500/5"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-[#14B8A6]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-32 rounded-full bg-[#22D3EE]/10 blur-2xl" />

        <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(20,184,166,0)", "0 0 20px rgba(20,184,166,0.3)", "0 0 0px rgba(20,184,166,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex size-10 items-center justify-center rounded-xl bg-gradient-vex"
          >
            <Bot className="size-5 text-[#0F172A]" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 id="vex-ai-heading" className="font-semibold text-white">
                Vex AI 24/7
              </h2>
              <Badge className="border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[10px] text-[#22D3EE]">
                {planLabel}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#14B8A6]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#14B8A6]" aria-hidden />
              {isPro ? "Prioridad Pro — Siempre activo" : "Modo básico — actualiza a Pro"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50"
            aria-expanded={showHistory}
            aria-label="Ver historial de chat"
          >
            <History className="size-4" />
          </button>
          <Sparkles className="size-5 text-[#22D3EE]" aria-hidden />
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/10 bg-white/5"
            >
              <div className="px-5 py-3">
                <p className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-400">
                  <ChevronDown className="size-3" />
                  Historial reciente
                </p>
                <div className="space-y-2">
                  {vexAIChatHistory.slice(1).map((msg) => (
                    <p key={msg.id} className="truncate text-xs text-slate-500">
                      <span className={msg.role === "user" ? "text-[#14B8A6]" : "text-slate-400"}>
                        {msg.role === "user" ? "Tú" : "Vex AI"}:
                      </span>{" "}
                      {msg.content}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-[420px] flex-col">
          <ScrollArea className="flex-1 px-5 py-4">
            <div className="space-y-4" role="log" aria-live="polite" aria-label="Chat con Vex AI">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#14B8A6]/20 px-4 py-3 text-sm leading-relaxed text-white">
                      {msg.content}
                      <p className="mt-1.5 text-[10px] text-slate-400">{msg.timestamp}</p>
                    </div>
                  </div>
                ) : (
                  <AssistantBubble
                    key={msg.id}
                    message={msg}
                    animateTyping={msg.id === lastAnimatedId}
                  />
                )
              )}

              {isTyping && (
                <div className="flex justify-start gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-vex/50">
                    <Bot className="size-3.5 text-[#0F172A]" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3" aria-label="Vex AI está escribiendo">
                    <span className="size-1.5 animate-bounce rounded-full bg-[#14B8A6] [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-[#14B8A6] [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-[#14B8A6] [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-white/10 px-5 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {VEX_AI_SUGGESTED_PROMPTS.map((item) => {
                const Icon = promptIcons[item.icon as keyof typeof promptIcons];
                return (
                  <motion.button
                    key={item.label}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(item.prompt)}
                    disabled={isTyping}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/10 hover:text-[#14B8A6] focus-visible:ring-2 focus-visible:ring-[#14B8A6]/50 disabled:opacity-50"
                  >
                    <Icon className="size-3" aria-hidden />
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntale a Vex AI..."
                className="h-11 flex-1 border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-[#14B8A6]/50"
                aria-label="Mensaje para Vex AI"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon-lg"
                className="bg-gradient-vex text-[#0F172A] hover:opacity-90 focus-visible:ring-[#14B8A6]/50"
                disabled={!input.trim() || isTyping}
                aria-label="Enviar mensaje"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
