"use client";

import { motion } from "framer-motion";
import { Check, Leaf, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { availableMatches } from "@/lib/mock-data";

export function AvailableMatches() {
  const { joinedMatchIds, joinMatch } = useDashboard();

  return (
    <section id="matches">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Matches disponibles</h2>
        <p className="text-sm text-slate-400">
          Sugerencias inteligentes basadas en tu calendario y rutas
        </p>
      </div>

      <div className="space-y-3">
        {availableMatches.map((match, i) => {
          const joined = joinedMatchIds.has(match.id);

          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={`flex flex-col gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                joined
                  ? "border-[#14B8A6]/30 bg-[#14B8A6]/5"
                  : "border-white/10 bg-[#1E293B]/50 hover:border-[#14B8A6]/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback
                    className={
                      match.driver.premium
                        ? "bg-[#22D3EE]/20 text-[#22D3EE] font-semibold"
                        : "bg-white/10 text-white font-semibold"
                    }
                  >
                    {match.driver.avatar}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">
                      {match.driver.name}
                    </span>
                    {match.driver.premium && (
                      <Badge className="border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]">
                        <Star className="size-3" fill="currentColor" />
                        Premium
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500">
                      ★ {match.driver.rating}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                    <MapPin className="size-3.5 shrink-0 text-[#14B8A6]" />
                    {match.route.from} → {match.route.to}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{match.time}</span>
                    <span className="font-semibold text-[#14B8A6]">
                      {match.matchScore}% match
                    </span>
                    <span className="flex items-center gap-1">
                      <Leaf className="size-3" />
                      {match.co2Saved} CO₂
                    </span>
                    <span>Ahorro {match.savings}</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                {joined ? (
                  <Button
                    size="sm"
                    disabled
                    className="w-full sm:w-auto bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30"
                  >
                    <Check className="size-4" />
                    Unido
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-gradient-vex font-semibold text-[#0F172A] hover:opacity-90"
                    onClick={() => joinMatch(match)}
                  >
                    <Users className="size-4" />
                    Unirme
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
