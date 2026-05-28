"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { Zap, Calendar, CheckCircle2, Lock, MessageSquare, Flame as FlameIcon, Star as StarIcon, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const BADGE_ICON_MAP = {
  messageSquare: MessageSquare,
  flame: FlameIcon,
  briefcase: Briefcase,
  star: StarIcon,
};

const DEFAULT_BADGES = [
  {
    id: 1,
    name: "First Speak",
    desc: "Recorded your first sentence",
    status: "locked",
    iconName: "messageSquare",
  },
  {
    id: 2,
    name: "Week Streak",
    desc: "Learned for 7 days in a row",
    status: "locked",
    iconName: "flame",
  },
  {
    id: 3,
    name: "Interview Ready",
    desc: "Completed all Work lessons",
    status: "locked",
    iconName: "briefcase",
  },
  {
    id: 4,
    name: "100 XP",
    desc: "Earned 100 XP in one day",
    status: "locked",
    iconName: "star",
  },
];

export default function ProgressPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avgAccuracy: 0, totalDays: 1, streak: 0 });
  const [badges, setBadges] = useState(DEFAULT_BADGES);
  const [xpData, setXpData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    async function loadProgress() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from("users").select("streak, created_at").eq("id", user.id).single();
      const { data: progress } = await supabase.from("user_progress").select("pronunciation_score, completed_at").eq("user_id", user.id);
      
      let accuracy = 0;
      if (progress && progress.length > 0) {
         const totalScore = progress.reduce((acc, curr) => acc + (curr.pronunciation_score || 0), 0);
         accuracy = Math.round((totalScore / (progress.length * 10)) * 100);
      }

      let days = 1;
      if (profile?.created_at) {
        const createdDate = new Date(profile.created_at);
        const diff = Math.abs(new Date().getTime() - createdDate.getTime());
        days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }

      setStats({
        avgAccuracy: accuracy,
        totalDays: days,
        streak: profile?.streak || 0
      });

      const newXpData = [0, 0, 0, 0, 0, 0, 0];
      if (progress) {
         const now = new Date();
         progress.forEach(p => {
            const pDate = new Date(p.completed_at);
            const diffDays = Math.floor((now.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 7 && diffDays >= 0) {
               const idx = 6 - diffDays;
               newXpData[idx] += 50; 
            }
         });
      }
      
      const maxXP = Math.max(...newXpData, 100);
      const normalizedXP = newXpData.map(xp => Math.round((xp / maxXP) * 100));
      setXpData(normalizedXP);

      const newBadges = [...DEFAULT_BADGES];
      if (progress && progress.length > 0) newBadges[0].status = "earned";
      if (profile?.streak && profile.streak >= 7) newBadges[1].status = "earned";
      if (Math.max(...newXpData) >= 100) newBadges[3].status = "earned";
      
      setBadges(newBadges);
      setLoading(false);
    }
    loadProgress();
  }, []);

  if (loading) return <div className="min-h-screen bg-surface p-10 flex items-center justify-center font-bold text-muted">Loading progress...</div>;

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <header className="pt-8">
        <h1 className="text-[28px] font-[800] text-brand-dark tracking-[-0.5px]">Activity</h1>
        <p className="text-muted text-[13px] mt-1">See how much you've grown!</p>
      </header>

      {/* STREAK CALENDAR */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-[13px] font-bold text-brand-dark">This Month</span>
          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">
            {stats.streak} Day Streak
          </span>
        </div>
        <Card className="p-5 border-none shadow-sm">
          <div className="grid grid-cols-7 gap-y-4 gap-x-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const isToday = i === 27; 
              // Visually simulate past activity based on streak
              const isCompleted = i < 27 && i >= (27 - stats.streak);
              return (
                <div key={i} className="flex justify-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all ${
                      isToday
                        ? "bg-brand-orange/30 ring-2 ring-brand-orange ring-offset-2 scale-110"
                        : isCompleted
                        ? "bg-brand-orange shadow-[0_0_8px_rgba(255,107,53,0.3)]"
                        : "bg-[#F0EAE4]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* WEEKLY PROGRESS CHART */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[13px] font-bold text-brand-dark">Weekly Progress</h3>
          <span className="bg-[#FFF0EB] text-brand-orange text-[9px] font-bold px-2 py-1 rounded-pill uppercase tracking-wider">
            XP GROWTH
          </span>
        </div>
        <Card className="p-6 border-none shadow-sm">
          <div className="flex items-end justify-between h-32 gap-2">
            {xpData.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-1000 ${
                    i === 6 ? "bg-brand-orange" : "bg-brand-orange/30"
                  }`}
                  style={{ height: `${Math.max(10, val)}%` }}
                />
                <span className="text-[10px] font-bold text-muted">
                  {WEEK_DAYS[i]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* STATS ROW */}
      <section className="grid grid-cols-2 gap-4">
        <Card className="p-5 flex flex-col gap-1 border-none shadow-sm">
          <div className="flex items-center gap-2 text-brand-orange">
            <Zap size={16} strokeWidth={2} />
            <span className="text-[24px] font-[800] text-brand-dark">{stats.avgAccuracy}%</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
            Avg Accuracy
          </span>
        </Card>
        <Card className="p-5 flex flex-col gap-1 border-none shadow-sm">
          <div className="flex items-center gap-2 text-brand-purple">
            <Calendar size={16} strokeWidth={2} />
            <span className="text-[24px] font-[800] text-brand-dark">{stats.totalDays}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
            Total Days
          </span>
        </Card>
      </section>

      {/* BADGES SECTION */}
      <section className="flex flex-col gap-4">
        <h3 className="text-[13px] font-bold text-brand-dark px-1">Badges</h3>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => {
            const Icon = BADGE_ICON_MAP[badge.iconName as keyof typeof BADGE_ICON_MAP];
            return (
              <Card
                key={badge.id}
                className={`p-4 flex flex-col items-center text-center gap-2 border-none transition-all shadow-sm ${
                  badge.status === "locked" ? "opacity-50 grayscale" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-1">
                  <Icon size={24} strokeWidth={1.5} className="text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-brand-dark">
                    {badge.name}
                  </h4>
                  <p className="text-[10px] text-muted leading-tight mt-0.5 px-2">
                    {badge.desc}
                  </p>
                </div>
                <div
                  className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[9px] font-bold uppercase tracking-wider ${
                    badge.status === "earned"
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {badge.status === "earned" ? (
                    <>
                      <CheckCircle2 size={10} /> Earned
                    </>
                  ) : (
                    <>
                      <Lock size={10} /> Locked
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
