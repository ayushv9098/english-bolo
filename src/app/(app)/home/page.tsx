import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Mic, Headphones, ChevronRight, Bell, Flame, Star, Zap, BookOpen, Clock, Signal } from "lucide-react";
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

  // Parallel data fetching
  const [profileRes, progressRes, lessonToday, gameToday, speakingToday] = await Promise.all([
    supabase.from("users").select("name, streak, xp_points, avatar_emoji, goal").eq("id", user.id).single(),
    supabase.from("user_progress").select("lesson_id").eq("user_id", user.id),
    supabase.from('user_progress').select('id', { count: 'exact' }).eq('user_id', user.id).gte('completed_at', startOfTodayIso),
    supabase.from('game_sessions').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', startOfTodayIso),
    supabase.from('speaking_sessions').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', startOfTodayIso),
  ]);

  const profile = profileRes.data;
  const progress = progressRes.data;

  if (!profile?.goal) {
    redirect("/onboarding/goal");
  }

  const completedIds = progress?.map((p: any) => p.lesson_id) || [];

  let query = supabase.from("lessons").select("*").order("order_num", { ascending: true }).limit(1);
  if (completedIds.length > 0) {
     query = query.not('id', 'in', `(${completedIds.join(',')})`);
  }

  const { data: nextLessons } = await query;
  const nextLesson = nextLessons?.[0];

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Learner";
  const avatar = profile?.avatar_emoji || "😎";
  const isAvatarUrl = avatar.startsWith("http");

  // Fetch notification count (Placeholder for real notifications table if it exists)
  const { count: notificationCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* TOP GREETING SECTION */}
      <header className="flex justify-between items-center pt-12 px-6 pb-2 bg-transparent">
        <div className="flex flex-col">
          <h1 className="text-[30px] font-black text-brand-dark tracking-tight leading-none">
            Hey, {firstName}!
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/notifications">
            <div className="relative group">
              <div className="bg-white shadow-card w-[42px] h-[42px] rounded-2xl flex items-center justify-center border border-[#F5EDE8] active:scale-90 transition-all">
                <Bell size={20} className="text-brand-dark/40 group-hover:text-brand-orange transition-colors" />
                {notificationCount !== null && notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-br from-brand-orange to-[#FF8C61] text-white min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm ring-2 ring-brand-orange/10">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </div>
                )}
              </div>
            </div>
          </Link>

          <Link href="/profile">
            <UserAvatar id={profile?.avatar_emoji || "G01"} className="w-[42px] h-[42px] rounded-2xl shadow-card border-2 border-white ring-4 ring-brand-orange/5 active:scale-90 transition-all duration-300" />
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-5 px-5 mt-2">
        <GamificationDashboard />

        {/* DAILY LESSON CARD */}
        {nextLesson ? (
          <section>
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
          <section>
            <Card className="p-6 text-center border-none shadow-sm flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="text-green-500" size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-brand-dark">All Caught Up!</h3>
                <p className="text-muted text-[13px] leading-relaxed max-w-[200px] mx-auto">You have completed all available lessons. Awesome job!</p>
              </div>
              <Link href="/lessons" className="mt-2 w-full">
                <Button className="w-full bg-brand-orange text-white rounded-pill py-3.5 font-bold">
                  Browse Old Lessons
                </Button>
              </Link>
            </Card>
          </section>
        )}

        {/* NEW SECTIONS */}
        <HomeChecklist 
          lessonDone={(lessonToday.count || 0) >= 1}
          gameDone={(gameToday.count || 0) >= 1}
          speakingDone={(speakingToday.count || 0) >= 1}
        />
        
        <HomeGamesRow playedToday={(gameToday.count || 0) >= 1} />

        {/* QUICK PRACTICE SECTION */}
        <section className="flex flex-col gap-4 mb-5">
          <h3 className="text-lg font-bold text-brand-dark">Quick Practice</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/practice/speak" className="block">
              <div className="bg-[#E8F8EE] rounded-[20px] h-[88px] flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer shadow-sm border border-green-100/50">
                <Mic className="text-green-600 w-6 h-6" />
                <span className="text-green-600 font-bold text-sm">Speak</span>
              </div>
            </Link>
            <Link href="/practice/listen" className="block">
              <div className="bg-[#F0EBFF] rounded-[20px] h-[88px] flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer shadow-sm border border-purple-100/50">
                <Headphones className="text-brand-purple w-6 h-6" />
                <span className="text-brand-purple font-bold text-sm">Listen</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
