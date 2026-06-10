"use client";

import { useGamification, RANKS } from "@/context/GamificationContext";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";

const WEEK_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function GamificationDashboard() {
  const { totalXP, currentStreak, maxStreak, rank, isLoading } = useGamification();

  if (isLoading) {
    return (
      <section className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[132px] rounded-card" />
        <Skeleton className="h-[132px] rounded-card" />
      </section>
    );
  }

  // Which weekday is today (0 = Sun) — mark the last `currentStreak` days as active
  const todayIdx = new Date().getDay();

  // Rank progress toward the next tier
  let rankIdx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (totalXP >= RANKS[i].minXP) rankIdx = i;
  }
  const current = RANKS[rankIdx];
  const next = RANKS[rankIdx + 1];
  const pct = next
    ? Math.round(((totalXP - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100;
  const toNext = next ? next.minXP - totalXP : 0;

  return (
    <section className="grid grid-cols-2 gap-4">
      {/* STREAK CARD */}
      <Card className="flex flex-col gap-3 p-4 border-none shadow-card bg-white active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
            <span className="text-xl animate-flame">🔥</span>
          </div>
          {maxStreak > 0 && (
            <Badge variant="streak" className="text-[9px] px-2 py-0.5 uppercase tracking-wide">
              Best {maxStreak}
            </Badge>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-2xl font-black text-brand-dark tracking-tight leading-none">
            {currentStreak}
          </div>
          <div className="text-xs font-medium text-muted mt-1">Day streak</div>
        </div>

        {/* This week's dots */}
        <div className="flex items-center justify-between mt-0.5">
          {WEEK_LABELS.map((label, i) => {
            const isActive = i <= todayIdx && todayIdx - i < currentStreak;
            const isToday = i === todayIdx;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={
                    "w-3.5 h-3.5 rounded-full transition-colors " +
                    (isActive
                      ? "bg-brand-orange"
                      : isToday
                      ? "bg-orange-50 ring-1 ring-brand-orange/40"
                      : "bg-gray-100")
                  }
                />
                <span className="text-[8px] font-bold text-muted">{label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* XP / RANK CARD */}
      <Card className="flex flex-col gap-3 p-4 border-none shadow-card bg-white active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
            <span className="text-xl">⭐</span>
          </div>
          <Badge variant="streak" className="text-[9px] px-2 py-0.5 uppercase tracking-wide bg-brand-purple/10 text-brand-purple">
            {rank}
          </Badge>
        </div>

        <div className="flex flex-col">
          <div className="text-2xl font-black text-brand-dark tracking-tight leading-none">
            {totalXP}
          </div>
          <div className="text-xs font-medium text-muted mt-1">Total XP</div>
        </div>

        {/* Rank progress */}
        <div className="flex flex-col gap-1.5 mt-0.5">
          <ProgressBar value={pct} color="purple" size="sm" />
          <span className="text-[10px] font-semibold text-muted leading-tight">
            {next ? `${toNext} XP to ${next.name}` : "Max rank reached 🏆"}
          </span>
        </div>
      </Card>
    </section>
  );
}
