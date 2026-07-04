"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeGamesRowProps {
  playedToday: boolean;
}

export function HomeGamesRow({ playedToday }: HomeGamesRowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // 110px card width + 14px gap = 124px
    const index = Math.round(e.currentTarget.scrollLeft / 124);
    setActiveIndex(index);
  };

  const baseGames = [
    {
      name: "Speed Speak",
      emoji: "⚡",
      href: "/games/speed-speak",
      xp: "+20",
      theme: "bg-orange-50",
      iconColor: "text-orange-500",
      accent: "border-orange-100",
      dot: playedToday,
    },
    {
      name: "Chat Race",
      emoji: "💬",
      href: "/games/chat-race",
      xp: "+30",
      theme: "bg-blue-50",
      iconColor: "text-blue-500",
      accent: "border-blue-100",
    },
    {
      name: "Real Life",
      emoji: "📍",
      href: "/games/real-life",
      xp: "+50",
      theme: "bg-rose-50",
      iconColor: "text-rose-500",
      accent: "border-rose-100",
    },
    {
      name: "AI Partner",
      emoji: "🤖",
      href: "/games/ai-partner",
      xp: "+100",
      theme: "bg-purple-50",
      iconColor: "text-purple-500",
      accent: "border-purple-100",
    },
  ];

  // Just use the actual games, no duplication needed.
  const games = baseGames;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-black text-brand-dark tracking-tight">Play Games 🎮</h3>
        <Link
          href="/games"
          className="text-[11px] font-black text-brand-orange uppercase tracking-[0.1em] flex items-center gap-1 hover:gap-1.5 active:scale-95 transition-all"
        >
          View All <ChevronRight size={14} strokeWidth={3} />
        </Link>
      </div>

      <div 
        ref={scrollRef}
        className="flex md:grid md:grid-cols-4 gap-3.5 md:gap-5 overflow-x-auto md:overflow-visible pb-6 md:pb-2 overflow-y-hidden -mx-5 md:mx-0 px-[calc(50%-55px)] md:px-0 snap-x md:snap-none snap-mandatory [&::-webkit-scrollbar]:hidden" 
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={handleScroll}
      >
        {games.map((game, i) => (
          <Link key={i} href={game.href} className="shrink-0 md:w-full md:snap-align-none snap-center group">
            <div
              className={cn(
                "w-[110px] md:w-full h-[145px] md:h-[160px] flex flex-col justify-between items-center rounded-[24px] p-3 text-center border-[1.5px] relative transition-all duration-300 ease-out",
                game.theme,
                game.accent,
                activeIndex === i 
                  ? "scale-100 opacity-100 shadow-card" 
                  : "scale-[0.85] md:scale-100 opacity-50 md:opacity-100 shadow-none md:shadow-sm hover:md:shadow-card hover:md:-translate-y-1"
              )}
            >
              {/* Status Dot */}
              {game.dot && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              )}

              {/* Icon Container */}
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-white/50 group-hover:rotate-6 transition-transform">
                <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">
                  {game.emoji}
                </span>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5">
                <div className="text-[12px] font-black text-brand-dark leading-tight min-h-[16px]">
                  {game.name}
                </div>
                <div
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter",
                    "bg-white/80 border border-white/50",
                    game.iconColor
                  )}
                >
                  {game.xp} XP
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
