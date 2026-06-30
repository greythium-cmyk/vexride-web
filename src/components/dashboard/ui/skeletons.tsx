"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5",
        className
      )}
    >
      <Skeleton className="size-10 rounded-xl bg-white/10" />
      <Skeleton className="mt-4 h-3 w-24 bg-white/10" />
      <Skeleton className="mt-2 h-8 w-20 bg-white/10" />
      <Skeleton className="mt-2 h-3 w-32 bg-white/10" />
    </div>
  );
}

export function TripCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28 bg-white/10" />
          <Skeleton className="h-3 w-20 bg-white/10" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
      </div>
      <Skeleton className="mt-4 h-12 w-full rounded-xl bg-white/10" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-8 flex-1 rounded-lg bg-white/10" />
        <Skeleton className="size-8 rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

export function MatchRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1E293B]/50 p-4">
      <Skeleton className="size-10 rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36 bg-white/10" />
        <Skeleton className="h-3 w-48 bg-white/10" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg bg-white/10" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-5">
      <Skeleton className="h-4 w-32 bg-white/10" />
      <div className="mt-6 flex h-40 items-end justify-between gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full max-w-8 rounded-t-lg bg-white/10"
            style={{ height: `${30 + i * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function VexAISkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1E293B]/50">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <Skeleton className="size-10 rounded-xl bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-3 w-32 bg-white/10" />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <Skeleton className="h-16 w-4/5 rounded-2xl bg-white/10" />
        <Skeleton className="ml-auto h-12 w-3/5 rounded-2xl bg-white/10" />
        <Skeleton className="h-16 w-4/5 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 bg-white/10" />
        <Skeleton className="h-9 w-64 bg-white/10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-8 xl:grid-cols-5">
        <div className="space-y-8 xl:col-span-3">
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <MatchRowSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="xl:col-span-2">
          <VexAISkeleton />
        </div>
      </div>
    </div>
  );
}
