"use client";

import { useGamification } from "@/context/GamificationContext";
import Card from "@/components/ui/Card";

export function GamificationDashboard() {
  const { totalXP, currentStreak, isLoading } = useGamification();

  if (isLoading) {
    return <div className="h-32 animate-pulse bg-gray-100 rounded-2xl" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Stats Row */}
      <section className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col gap-1 p-5 border border-white/50 justify-center shadow-card relative overflow-hidden bg-white active:scale-95 transition-transform group animate-in zoom-in-95 duration-300">
          <div className="absolute -right-2 -top-2 text-[72px] opacity-[0.08] group-hover:scale-110 transition-transform select-none pointer-events-none">🔥</div>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center mb-1.5 relative z-10 shadow-sm border border-orange-100/50 group-hover:rotate-12 transition-transform">
            <span className="text-xl drop-shadow-sm">🔥</span>
          </div>
          <div className="text-2xl font-black text-brand-dark relative z-10 tracking-tight leading-none">{currentStreak}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-orange relative z-10 mt-1 opacity-60">
            Day Streak
          </div>
        </Card>
        
        <Card className="flex flex-col gap-1 p-5 border border-white/50 justify-center shadow-card relative overflow-hidden bg-white active:scale-95 transition-transform group animate-in zoom-in-95 duration-300">
           <div className="absolute -right-2 -top-2 text-[72px] opacity-[0.08] group-hover:scale-110 transition-transform select-none pointer-events-none">⭐</div>
          <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center mb-1.5 relative z-10 shadow-sm border border-yellow-100/50 group-hover:rotate-12 transition-transform">
            <span className="text-xl drop-shadow-sm">⭐</span>
          </div>
          <div className="text-2xl font-black text-brand-dark relative z-10 tracking-tight leading-none">{totalXP}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.15em] text-yellow-600 relative z-10 mt-1 opacity-60">
            Total XP
          </div>
        </Card>
      </section>
    </div>
  );
}
