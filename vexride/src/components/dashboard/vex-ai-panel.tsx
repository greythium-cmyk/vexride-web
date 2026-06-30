"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  vexAIInitialMessages,
  vexAIResponses,
  type ChatMessage,
} from "@/lib/mock-data";

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("viaje") || lower.includes("próximo")) {
    return vexAIResponses.viaje;
  }
  if (lower.includes("match") || lower.includes("unir")) {
    return vexAIResponses.match;
  }
  if (lower.includes("ahorro") || lower.includes("co2") || lower.includes("co₂")) {
    return vexAIResponses.ahorro;
  }
  return vexAIResponses.default;
}

export function VexAIPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(vexAIInitialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

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

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date().toLocaleTimeString("es", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const quickPrompts = [
    "¿Cuál es mi próximo viaje?",
    "Muéstrame matches disponibles",
    "¿Cuánto he ahorrado este mes?",
  ];

  return (
    <section id="vex-ai">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#1E293B]/50"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-vex shadow-lg shadow-teal-500/20">
            <Bot className="size-5 text-[#0F172A]" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-white">Vex AI 24/7</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#14B8A6]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#14B8A6]" />
              Prioridad Pro — Siempre activo
            </div>
          </div>
          <Sparkles className="size-5 text-[#22D3EE]" />
        </div>

        <div className="flex h-[380px] flex-col">
          <ScrollArea className="flex-1 px-5 py-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#14B8A6]/20 text-white"
                        : "border border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {msg.content}
                    <p className="mt-1.5 text-[10px] text-slate-500">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
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
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-[#14B8A6]/30 hover:text-[#14B8A6]"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntale a Vex AI..."
                className="h-10 flex-1 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
              <Button
                type="submit"
                size="icon-lg"
                className="bg-gradient-vex text-[#0F172A] hover:opacity-90"
                disabled={!input.trim() || isTyping}
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
