"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Clock, Coffee, MapPin, Briefcase, ShoppingBag, Hospital, Users, Sparkles, Star, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import PageTransition from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = ["All", "Daily Life", "Travel", "Work"];

export default function LessonsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase.from("users").select("goal").eq("id", user.id).single();
      if (!profile?.goal) {
        router.push("/onboarding/goal");
        return;
      }

      const { data: lessonsData } = await supabase.from("lessons").select("*").order("order_num");
      const { data: progressData } = await supabase.from("user_progress").select("*").eq("user_id", user.id);

      if (lessonsData) {
        const enhancedLessons = lessonsData.map((lesson) => {
          const prog = progressData?.find((p) => p.lesson_id === lesson.id);
          
          let Icon = Sparkles;
          if (lesson.category === 'Work') Icon = Briefcase;
          else if (lesson.category === 'Travel') Icon = MapPin;
          else if (lesson.title.includes('Chai') || lesson.title.includes('Restaurant')) Icon = Coffee;
          else if (lesson.title.includes('Doctor')) Icon = Hospital;
          else if (lesson.title.includes('Shopping')) Icon = ShoppingBag;
          else if (lesson.title.includes('Friends') || lesson.title.includes('Self')) Icon = Users;

          const baseXP = 40;
          const durationXP = (lesson.duration_mins || 5) * 10;
          const difficultyXP = lesson.difficulty === 'ADVANCED' ? 20 : 0;
          const totalPotentialXP = baseXP + durationXP + difficultyXP;

          return {
            ...lesson,
            progress: prog ? 100 : 0,
            IconComponent: Icon,
            potentialXP: totalPotentialXP,
            iconBg: lesson.difficulty === 'BEGINNER' ? 'bg-orange-100 text-brand-orange' : 'bg-purple-100 text-brand-purple'
          };
        });
        setLessons(enhancedLessons);
      }
      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  const filteredLessons = lessons.filter(l => {
    const matchesCategory = activeCategory === "All" || l.category === activeCategory;
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         l.hindi_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition className="flex flex-col gap-5 p-6 pb-24">
      {/* HEADER */}
      <header className="flex flex-col gap-4 pt-8">
        <div className="space-y-0.5">
          <h1 className="text-[32px] font-black text-brand-dark tracking-tight leading-none">Explore</h1>
          <p className="text-muted text-[14px] font-bold">
            Master English one situation at a time.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Search className="text-brand-dark/30 w-4.5 h-4.5 transition-colors group-focus-within:text-brand-orange" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#F5EDE8] rounded-xl py-3 pl-10 pr-4 text-[14px] font-bold shadow-card focus:ring-4 focus:ring-brand-orange/5 outline-none transition-all placeholder:text-brand-dark/20"
          />
        </div>
      </header>

      {/* FILTER PILLS ROW */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar -mx-6 px-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-lg text-[12px] font-black transition-all whitespace-nowrap active:scale-95 uppercase tracking-widest",
              activeCategory === cat
                ? "bg-brand-orange text-white shadow-lg shadow-orange-100"
                : "bg-white text-brand-dark/40 border border-[#F5EDE8] hover:bg-gray-50 shadow-sm"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LESSON CARDS LIST */}
      <div className="flex flex-col gap-3.5 mt-1">
        {loading ? (
           Array.from({ length: 5 }).map((_, i) => (
             <Card key={i} className="p-3.5 border-none shadow-card flex items-center gap-4">
               <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
               <div className="flex-1 space-y-1.5">
                 <Skeleton className="h-3 w-16 rounded-full" />
                 <Skeleton className="h-4 w-3/4 rounded-full" />
                 <Skeleton className="h-3 w-1/2 rounded-full" />
               </div>
               <Skeleton className="w-7 h-7 rounded-full shrink-0" />
             </Card>
           ))
        ) : filteredLessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
              <Search className="text-gray-300 w-8 h-8" />
            </div>
            <h3 className="font-black text-brand-dark text-base tracking-tight">No lessons found</h3>
            <p className="text-muted text-[13px] font-bold max-w-[180px] mt-0.5 leading-relaxed">
              Try searching for something else or change the category.
            </p>
            <Button 
              variant="ghost" 
              className="mt-4 border-brand-orange/20 text-brand-orange font-black text-[10px] uppercase tracking-widest px-5 h-10"
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const Icon = lesson.IconComponent;
            const isCompleted = lesson.progress === 100;
            
            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                <Card className="p-3.5 flex flex-col gap-3 group active:scale-[0.98] transition-all shadow-card border border-[#F5EDE8] rounded-[20px] relative overflow-hidden">
                  {isCompleted && (
                    <div className="absolute top-0 right-0 w-10 h-10 bg-green-500/10 flex items-center justify-center rounded-bl-2xl">
                      <CheckCircle2 size={14} className="text-green-600 mb-0.5 ml-0.5" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3.5">
                    {/* ICON BOX */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm group-hover:rotate-6 transition-transform",
                        lesson.difficulty === "BEGINNER"
                          ? "bg-orange-50 border-orange-100/50 text-brand-orange"
                          : "bg-purple-50 border-purple-100/50 text-brand-purple"
                      )}
                    >
                      <Icon size={22} strokeWidth={2.5} />
                    </div>

                    {/* MIDDLE CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.1em]",
                            lesson.difficulty === "BEGINNER"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-brand-purple"
                          )}
                        >
                          {lesson.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-muted text-[9px] font-black uppercase tracking-tighter">
                          <Clock size={9} strokeWidth={3} />
                          <span>{lesson.duration_mins}m</span>
                        </div>
                      </div>
                      
                      <h3 className="font-black text-brand-dark text-[15px] tracking-tight group-hover:text-brand-orange transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="hindi text-muted font-bold italic text-[11px] mt-0.5 truncate pr-4">
                        {lesson.hindi_description}
                      </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 border border-yellow-100/50 px-1.5 py-0.5 rounded-lg text-[9px] font-black shadow-sm">
                        <Star size={9} fill="currentColor" />
                        <span>{lesson.potentialXP} XP</span>
                      </div>
                      <ChevronRight size={18} strokeWidth={3} className="text-brand-dark/10 group-hover:text-brand-orange transition-all group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  {lesson.progress > 0 && (
                    <div className="pt-0.5">
                      <ProgressBar
                        value={lesson.progress}
                        size="xs"
                        color={isCompleted ? "green" : "orange"}
                      />
                    </div>
                  )}
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </PageTransition>
  );
}
