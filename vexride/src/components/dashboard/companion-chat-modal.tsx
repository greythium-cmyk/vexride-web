"use client";

import { useState } from "react";
import { Send } from "lucide-react";
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
  const { chatCompanion, setChatCompanion } = useDashboard();
  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      id: "1",
      from: "them",
      text: "¡Hola! Confirmado para mañana. Salgo puntual a las 8:15 AM 👍",
      time: "09:12",
    },
  ]);
  const [input, setInput] = useState("");

  if (!chatCompanion) return null;

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
    }, 1500);
  };

  return (
    <Dialog open={!!chatCompanion} onOpenChange={() => setChatCompanion(null)}>
      <DialogContent className="border-white/10 bg-[#1E293B] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-[#14B8A6]/20 font-semibold text-[#14B8A6]">
                {chatCompanion.avatar}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-white">
              Chat con {chatCompanion.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex h-72 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.from === "me"
                      ? "bg-[#14B8A6]/20 text-white"
                      : "border border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  {msg.text}
                  <p className="mt-1 text-[10px] text-slate-500">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-3 flex gap-2 border-t border-white/10 pt-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="border-white/10 bg-white/5 text-white"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-gradient-vex text-[#0F172A]"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
