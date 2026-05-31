"use client";

import Card from "@/components/ui/Card";
import { Zap, MessageSquare, MapPin, Bot, Heart, Trophy, ArrowRight, Flame, Star, Target } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import { cn } from "@/lib/utils";
import { useGamification } from "@/context/GamificationContext";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GamesHub() {
  const { totalXP, currentStreak, isLoading: statsLoading } = useGamification();
  const supabase = createClient();

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      const { data } = await supabase.from('game_meta').select('*').eq('is_active', true);
      if (data) {
        // Map keys to themes
        const themes: Record<string, any> = {
          speed_speak: { bg: "bg-orange-50", border: "border-orange-100/50", accent: "text-orange-600", href: "/games/speed-speak" },
          chat_race: { bg: "bg-blue-50", border: "border-blue-100/50", accent: "text-blue-600", href: "/games/chat-race" },
          real_life: { bg: "bg-rose-50", border: "border-rose-100/50", accent: "text-rose-600", href: "/games/real-life" },
          ai_partner: { bg: "bg-purple-50", border: "border-purple-100/50", accent: "text-purple-600", href: "/games/ai-partner" },
          survival: { bg: "bg-red-50", border: "border-red-100/50", accent: "text-red-600", href: "/games/survival" },
          daily_challenge: { bg: "bg-yellow-50", border: "border-yellow-100/50", accent: "text-yellow-600", href: "/games/daily-challenge" },
        };

        setGames(data.map(g => ({
          ...g,
          ...themes[g.game_key],
          xp: `+${g.base_xp_reward} XP`
        })));
      }
      setLoading(false);
    }
    loadGames();
  }, [supabase]);

  return (
    <PageTransition>
      <div className="min-h-screen pb-32 px-6 pt-10 max-w-md mx-auto flex flex-col gap-6">
        {/* PREMIUM HEADER */}
        <header className="space-y-0.5">
          <h1 className="text-[32px] font-black text-brand-dark tracking-tight leading-none">
            Arcade Hub
          </h1>
          <p className="text-[14px] font-bold text-muted leading-relaxed">
            Speak fast. Survive scenarios. Build real confidence.
          </p>
        </header>

        {/* GRADIENT STATS CARD */}
        <div className="relative bg-gradient-to-br from-brand-orange to-[#FF8C61] rounded-[20px] p-5 shadow-lg shadow-orange-200 overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-black/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 opacity-80">
                <Star size={12} className="text-white fill-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Total XP</span>
              </div>
              {statsLoading ? (
                <div className="h-8 w-16 bg-white/20 animate-pulse rounded-lg" />
              ) : (
                <p className="text-2xl font-black text-white">{totalXP} <span className="text-xs font-bold opacity-70">XP</span></p>
              )}
            </div>

            <div className="w-[1px] h-8 bg-white/20 mx-3" />

            <div className="space-y-0.5 text-right">
              <div className="flex items-center gap-1.5 opacity-80 justify-end">
                <Flame size={12} className="text-white fill-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Streak</span>
              </div>
              {statsLoading ? (
                <div className="h-8 w-14 bg-white/20 animate-pulse rounded-lg ml-auto" />
              ) : (
                <p className="text-2xl font-black text-white">{currentStreak} <span className="text-xs font-bold opacity-70">DAYS</span></p>
              )}
            </div>
          </div>
        </div>

        {/* GAMES LIST */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-0.5">
             <Target size={16} className="text-brand-dark/40" />
             <span className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">Available Missions</span>
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-3.5 border-none shadow-card flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-1/2 rounded-full" />
                  <Skeleton className="h-3 w-3/4 rounded-full" />
                </div>
              </Card>
            ))
          ) : (
            games.map((game, index) => (
              <Link key={index} href={game.href} className="group">
                <Card className={cn(
                  "p-3.5 flex items-center gap-3.5 active:scale-[0.98] transition-all border-[1.5px] shadow-sm hover:shadow-md rounded-[20px]",
                  game.theme,
                  game.border
                )}>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:rotate-6 transition-transform">
                    <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">{game.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-black text-brand-dark text-[15px] tracking-tight">
                        {game.title}
                      </h3>
                      <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded-lg bg-white/80 border border-white/50", game.accent)}>
                        {game.xp}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-muted leading-snug line-clamp-1 pr-2">
                      {game.description}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-brand-dark/20 group-hover:text-brand-dark group-hover:translate-x-1 transition-all" />
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
