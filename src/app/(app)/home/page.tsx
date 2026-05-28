import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Mic, Headphones, ChevronRight, Bell, Flame, Star, Zap, BookOpen, Clock, Signal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("name, streak, xp_points, avatar_emoji")
    .eq("id", user.id)
    .single();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id);

  const completedIds = progress?.map((p: any) => p.lesson_id) || [];

  let query = supabase.from("lessons").select("*").order("order_num", { ascending: true }).limit(1);
  if (completedIds.length > 0) {
     query = query.not('id', 'in', `(${completedIds.join(',')})`);
  }

  const { data: nextLessons } = await query;
  const nextLesson = nextLessons?.[0];

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Learner";
  const avatar = profile?.avatar_emoji || "😎";

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* TOP GREETING SECTION */}
      <header className="flex justify-between items-center pt-14 px-5 pb-3 bg-transparent">
        <h1 className="text-[28px] font-[800] text-[#1A1A2E] tracking-[-0.5px]">
          Hey, {firstName}!
        </h1>
        <div className="flex items-center gap-[10px]">
          <div className="bg-[#FF6B35] text-white rounded-full px-[12px] py-[5px] text-[13px] font-[700] flex items-center gap-1.5">
            <Bell size={14} strokeWidth={2} /> 10+
          </div>
          <div className="w-[36px] h-[36px] rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-[18px] font-[700] shadow-sm">
            {avatar}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-5 px-5 mt-2">
        {/* STATS ROW */}
        <section className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col gap-1 p-5 border-none min-h-[90px] justify-center shadow-sm">
            <Flame size={22} color="#FF6B35" strokeWidth={2} />
            <div className="text-3xl font-bold text-brand-dark">{profile?.streak || 0}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted mt-1">
              Day Streak
            </div>
          </Card>
          <Card className="flex flex-col gap-1 p-5 border-none min-h-[90px] justify-center shadow-sm">
            <Star size={22} color="#F59E0B" strokeWidth={2} fill="#F59E0B" />
            <div className="text-3xl font-bold text-brand-dark">{profile?.xp_points || 0}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted mt-1">
              Total XP
            </div>
          </Card>
        </section>

        {/* DAILY LESSON CARD */}
        {nextLesson ? (
          <section>
            <div className="bg-white rounded-[28px] overflow-hidden border-[1.5px] border-[#FFE8DC] shadow-sm">
              <div className="relative bg-brand-orange px-5 pt-5 pb-4 overflow-hidden">
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-20 h-20 bg-white/12 rounded-full flex items-center justify-center pointer-events-none">
                  <BookOpen size={32} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                </div>
                <div className="relative z-10 flex flex-col">
                  <div className="bg-white/20 rounded-pill px-[10px] py-[3px] self-start mb-2 flex items-center gap-1.5">
                    <Zap size={10} fill="white" color="white" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-[0.1em]">
                      Daily Lesson
                    </span>
                  </div>
                  <h2 className="text-white text-[22px] font-[800] leading-tight">{nextLesson.title}</h2>
                  <p className="text-white/75 italic hindi text-[12px] mt-[2px]">
                    {nextLesson.hindi_description}
                  </p>
                </div>
              </div>
              <div className="bg-white px-5 py-4">
                <p className="text-[#9B9BAE] text-[12px] leading-[1.5] mb-[14px]">
                  {nextLesson.situation}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <div className="bg-[#FFF0EB] text-brand-orange text-[11px] font-semibold px-[10px] py-[4px] rounded-pill whitespace-nowrap flex items-center gap-1.5">
                      <Clock size={11} color="#FF6B35" strokeWidth={2} /> {nextLesson.duration_mins} mins
                    </div>
                    <div className="bg-[#FFF0EB] text-brand-orange text-[11px] font-semibold px-[10px] py-[4px] rounded-pill whitespace-nowrap flex items-center gap-1.5">
                      <Signal size={11} color="#FF6B35" strokeWidth={2} /> {nextLesson.difficulty}
                    </div>
                  </div>
                  <Link href={`/lesson/${nextLesson.id}`}>
                    <Button className="bg-brand-orange text-white text-[13px] font-bold px-[22px] py-[11px] rounded-pill active:scale-[0.98] transition-transform shrink-0 h-auto">
                      Start →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section>
            <Card className="p-6 text-center border-none shadow-sm flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="text-green-500" size={32} />
              </div>
              <h3 className="font-bold text-lg text-brand-dark">All Caught Up!</h3>
              <p className="text-muted text-sm">You have completed all available lessons. Awesome job!</p>
            </Card>
          </section>
        )}

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
