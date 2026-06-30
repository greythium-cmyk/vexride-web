"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/components/dashboard/dashboard-context";

interface LocalMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

export function CompanionChatModal() {
  const { chatCompanion, setChatCompanion, data } = useDashboard();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatCompanion) {
      setMessages([
        {
          id: "1",
          from: "them",
          text: "¡Hola! Confirmado para mañana. Salgo puntual a las 8:15 AM 👍",
          time: "09:12",
        },
      ]);
    }
  }, [chatCompanion]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatCompanion) return null;

  const send = () => {
    if (!input.trim() || isSending) return;
    const now = new Date().toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "me", text: input.trim(), time: now },
    ]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "them",
          text: "Perfecto, te espero en el punto de encuentro. ¡Nos vemos mañana!",
          time: now,
        },
      ]);
      setIsSending(false);
    }, 1200);
  };

  return (
    <Dialog open={!!chatCompanion} onOpenChange={() => setChatCompanion(null)}>
      <DialogContent className="flex max-h-[85vh] flex-col border-white/10 bg-[#1E293B] p-0 sm:max-w-md">
        <DialogHeader className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarFallback className="bg-[#14B8A6]/20 font-semibold text-[#14B8A6]">
                  {chatCompanion.avatar}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#1E293B] bg-[#14B8A6]" aria-label="En línea" />
            </div>
            <div>
              <DialogTitle className="text-white">{chatCompanion.name}</DialogTitle>
              <p className="text-xs text-[#14B8A6]">En línea · Conductor verificado</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4" role="log" aria-live="polite">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-2 ${msg.from === "me" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.from === "them" && (
                    <Avatar size="sm">
                      <AvatarFallback className="bg-[#14B8A6]/20 text-[10px] text-[#14B8A6]">
                        {chatCompanion.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.from === "me"
                        ? "rounded-tr-sm bg-gradient-to-br from-[#14B8A6] to-[#0d9488] text-white"
                        : "rounded-tl-sm border border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {msg.text}
                    <p className={`mt-1 text-[10px] ${msg.from === "me" ? "text-white/60" : "text-slate-500"}`}>
                      {msg.time}
                    </p>
                  </div>
                  {msg.from === "me" && (
                    <Avatar size="sm">
                      <AvatarFallback className="bg-white/10 text-[10px] text-white">
                        {data.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isSending && (
              <div className="flex gap-2">
                <Avatar size="sm">
                  <AvatarFallback className="bg-[#14B8A6]/20 text-[10px] text-[#14B8A6]">
                    {chatCompanion.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
          >
            <button type="button" className="rounded-lg p-2 text-slate-500 hover:text-slate-300" aria-label="Emoji">
              <Smile className="size-5" />
            </button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="h-11 flex-1 border-white/10 bg-white/5 text-white"
              aria-label="Mensaje"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon-lg"
              className="bg-gradient-vex text-[#0F172A] hover:opacity-90"
              disabled={!input.trim() || isSending}
              aria-label="Enviar"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
