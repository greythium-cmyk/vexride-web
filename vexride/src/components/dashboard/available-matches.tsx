"use client";

import { motion } from "framer-motion";
import { Check, Leaf, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { cn } from "@/lib/utils";
import { MatchRowSkeleton } from "@/components/dashboard/ui/skeletons";
import { EmptyState } from "@/components/dashboard/ui/empty-state";

export function AvailableMatches() {
  const { data, loading, joinedMatchIds, joinMatch, setShowNewCarpoolModal, setNewCarpoolMode, newMatchIds } = useDashboard();
  const matches = data.availableMatches.filter((m) => !joinedMatchIds.has(m.id));

  return (
    <section id="matches" aria-labelledby="matches-heading">
      <div className="mb-5">
        <h2 id="matches-heading" className="text-lg font-semibold text-white">
          Matches disponibles
        </h2>
        <p className="text-sm text-slate-400">
          Sugerencias inteligentes basadas en tu calendario y rutas
        </p>
      </div>

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <MatchRowSkeleton key={i} />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay matches disponibles"
          description="Vex AI buscará nuevas rutas compatibles cuando actualices tu calendario."
          actionLabel="Buscar nuevo match"
          onAction={() => {
            setNewCarpoolMode("search");
            setShowNewCarpoolModal(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {data.availableMatches.map((match, i) => {
            const joined = joinedMatchIds.has(match.id);
            const isNew = newMatchIds.has(match.id);

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 12, scale: isNew ? 0.98 : 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                whileHover={{ x: joined ? 0 : 4 }}
                className={cn(
                  "flex flex-col gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between",
                  joined
                    ? "border-[#14B8A6]/30 bg-[#14B8A6]/5"
                    : isNew
                      ? "border-[#22D3EE]/40 bg-[#22D3EE]/5 shadow-lg shadow-cyan-500/10 ring-1 ring-[#22D3EE]/20"
                      : "border-white/10 bg-[#1E293B]/50 hover:border-[#14B8A6]/20 hover:shadow-md hover:shadow-teal-500/5"
                )}
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
                      <span className="font-semibold text-white">{match.driver.name}</span>
                      {match.driver.premium && (
                        <Badge className="border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]">
                          <Star className="size-3" fill="currentColor" aria-hidden />
                          Premium
                        </Badge>
                      )}
                      <span className="text-xs text-slate-500">★ {match.driver.rating}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="size-3.5 shrink-0 text-[#14B8A6]" aria-hidden />
                      {match.route.from} → {match.route.to}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{match.time}</span>
                      <span className="font-semibold text-[#14B8A6]">{match.matchScore}% match</span>
                      <span className="flex items-center gap-1">
                        <Leaf className="size-3" aria-hidden />
                        {match.co2Saved} CO₂
                      </span>
                      <span>Ahorro {match.savings}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                  {joined ? (
                    <Button size="sm" disabled className="w-full sm:w-auto bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30">
                      <Check className="size-4" aria-hidden />
                      Unido
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full sm:w-auto min-h-10 bg-gradient-vex font-semibold text-[#0F172A] hover:opacity-90 focus-visible:ring-[#14B8A6]/50"
                      onClick={() => joinMatch(match)}
                    >
                      <Users className="size-4" aria-hidden />
                      Unirme
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
