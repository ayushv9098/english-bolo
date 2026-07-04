import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Mic, Headphones, ChevronRight, Bell, Flame, Star, Zap, BookOpen, Clock, Signal, Target, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { HomeChecklist } from "@/components/home/HomeChecklist";
import { HomeGamesRow } from "@/components/home/HomeGamesRow";
import DailyLessonCard from "@/components/DailyLessonCard";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayIso = startOfToday.toISOString();

  // 1. First batch of core data to determine next lesson
  const [profileRes, progressRes] = await Promise.all([
    supabase.from("users").select("name, streak, xp_points, avatar_emoji, goal").eq("id", user.id).single(),
    supabase.from("user_progress").select("lesson_id").eq("user_id", user.id),
  ]);

  const profile = profileRes.data;
  const progress = progressRes.data;

  if (!profile?.goal) {
    redirect("/onboarding/goal");
  }

  const completedIds = progress?.map((p: any) => p.lesson_id) || [];
  
  // 2. Optimized Parallel Fetching for all remaining dashboard data
  const [nextLessonsRes, lessonToday, gameToday, speakingToday, notifRes] = await Promise.all([
    // Next Lesson Query
    completedIds.length > 0 
      ? supabase.from("lessons").select("*").not('id', 'in', `(${completedIds.join(',')})`).order("order_num", { ascending: true }).limit(1)
      : supabase.from("lessons").select("*").order("order_num", { ascending: true }).limit(1),
    
    // Counts for checklist
    supabase.from('user_progress').select('id', { count: 'exact' }).eq('user_id', user.id).gte('completed_at', startOfTodayIso),
    supabase.from('game_sessions').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', startOfTodayIso),
    supabase.from('speaking_sessions').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', startOfTodayIso),
    
    // Notification count
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false)
  ]);

  const nextLesson = nextLessonsRes.data?.[0];
  const notificationCount = notifRes.count;

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Learner";
  const avatarId = profile?.avatar_emoji || "G01";

  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17 && hour < 21) greeting = "Good evening";
  else if (hour >= 21 || hour < 4) greeting = "Good night";
  const streakCount = profile?.streak || 0;
  const subline =
    streakCount > 0
      ? `🔥 ${streakCount}-day streak — keep it up!`
      : "Let's start your daily goal 💪";

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* TOP GREETING SECTION */}
      <header className="flex justify-between items-center pt-8 px-5 pb-1 bg-transparent animate-rise">
        <div className="flex flex-col">
          <h1 className="text-[23px] font-black text-brand-dark tracking-tighter leading-none">
            {greeting}, {firstName}!
          </h1>
          <p className="text-[12px] font-semibold text-muted mt-1.5">{subline}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/notifications">
            <div className="relative group">
              <div className="bg-white shadow-card w-[42px] h-[42px] rounded-xl flex items-center justify-center border border-border active:scale-90 transition-all">
                <Bell size={20} className="text-brand-dark/40 group-hover:text-brand-orange transition-colors" />
                {notificationCount !== null && notificationCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-brand-orange to-brand-orange-light text-white min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white shadow-sm ring-2 ring-brand-orange/10">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </div>
                )}
              </div>
            </div>
          </Link>

          <Link href="/profile" className="group">
            <UserAvatar id={profile?.avatar_emoji || "G01"} className="w-[42px] h-[42px] rounded-xl shadow-card border-2 border-white ring-4 ring-brand-orange/5 active:scale-90 group-hover:scale-110 group-hover:-rotate-3 group-hover:ring-brand-orange/30 group-hover:shadow-lg transition-all duration-300 cursor-pointer" />
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-5 px-5 mt-2">
        <div className="animate-rise" style={{ animationDelay: "60ms" }}>
          <GamificationDashboard />
        </div>

        {/* DAILY LESSON CARD */}
        {nextLesson ? (
          <section className="animate-rise" style={{ animationDelay: "120ms" }}>
            <DailyLessonCard 
              title={nextLesson.title}
              description={nextLesson.hindi_description}
              duration_mins={nextLesson.duration_mins}
              level={nextLesson.difficulty}
              xp_reward={nextLesson.xp_reward || 50}
              word_count={nextLesson.word_count || 5}
              quiz_count={nextLesson.quiz_count || 5}
              lesson_id={nextLesson.id}
            />
          </section>
        ) : (
          <section className="animate-rise" style={{ animationDelay: "120ms" }}>
            <Card className="p-6 text-center border-none shadow-sm flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="text-green-500" size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-brand-dark leading-tight">All Caught Up!</h3>
                <p className="text-muted text-[13px] leading-relaxed max-w-[200px] mx-auto">You have completed all available lessons. Awesome job!</p>
              </div>
              <Link href="/lessons" className="mt-2 w-full">
                <Button className="w-full bg-brand-orange text-white rounded-xl py-3.5 font-bold">
                  Browse Old Lessons
                </Button>
              </Link>
            </Card>
          </section>
        )}

        {/* NEW SECTIONS */}
        <div className="animate-rise" style={{ animationDelay: "180ms" }}>
          <HomeChecklist
            lessonDone={(lessonToday.count || 0) >= 1}
            gameDone={(gameToday.count || 0) >= 1}
            speakingDone={(speakingToday.count || 0) >= 1}
          />
        </div>

        <div className="animate-rise" style={{ animationDelay: "240ms" }}>
          <HomeGamesRow playedToday={(gameToday.count || 0) >= 1} />
        </div>

        {/* QUICK PRACTICE SECTION */}
        <section className="flex flex-col gap-4 mb-5 animate-rise w-full" style={{ animationDelay: "300ms" }}>
          <h3 className="text-[18px] font-black text-brand-dark tracking-tight">Quick Practice ⚡</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <Link href="/practice/speak" className="block group">
              <div className="bg-tile-speak rounded-[20px] h-[100px] md:h-[120px] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group-hover:-translate-y-1 cursor-pointer shadow-card border border-green-100/60">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                  <Mic className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-green-700 font-bold text-sm md:text-base">Speak</span>
              </div>
            </Link>
            <Link href="/practice/listen" className="block group">
              <div className="bg-tile-listen rounded-[20px] h-[100px] md:h-[120px] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group-hover:-translate-y-1 cursor-pointer shadow-card border border-purple-100/60">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                  <Headphones className="text-brand-purple w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-brand-purple font-bold text-sm md:text-base">Listen</span>
              </div>
            </Link>
            <Link href="/games/daily-challenge" className="block group">
              <div className="bg-tile-challenge rounded-[20px] h-[100px] md:h-[120px] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group-hover:-translate-y-1 cursor-pointer shadow-card border border-orange-100/60">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                  <Target className="text-brand-orange w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-brand-orange font-bold text-sm md:text-base">Challenge</span>
              </div>
            </Link>
            <Link href="/progress" className="block group">
              <div className="bg-tile-progress rounded-[20px] h-[100px] md:h-[120px] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group-hover:-translate-y-1 cursor-pointer shadow-card border border-blue-100/60">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                  <TrendingUp className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-blue-700 font-bold text-sm md:text-base">Progress</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
