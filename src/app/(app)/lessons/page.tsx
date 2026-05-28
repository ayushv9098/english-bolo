"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Clock, Coffee, MapPin, Briefcase, ShoppingBag, Hospital, Users, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = ["All", "Daily Life", "Travel", "Work"];

export default function LessonsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
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

          return {
            ...lesson,
            progress: prog ? 100 : 0,
            IconComponent: Icon,
            iconBg: lesson.difficulty === 'BEGINNER' ? 'bg-orange-100 text-brand-orange' : 'bg-purple-100 text-brand-purple'
          };
        });
        setLessons(enhancedLessons);
      }
      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  const filteredLessons = activeCategory === "All" 
    ? lessons 
    : lessons.filter(l => l.category === activeCategory);

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <header className="flex flex-col gap-4 pt-8">
        <div>
          <h1 className="text-[28px] font-[800] text-brand-dark tracking-[-0.5px]">Explore</h1>
          <p className="text-muted text-[13px] mt-1">
            Master English one situation at a time.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5 transition-colors group-focus-within:text-brand-orange" />
          <input
            type="text"
            placeholder="Search lessons..."
            className="w-full bg-white border-none rounded-pill py-3.5 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
          />
        </div>
      </header>

      {/* FILTER PILLS ROW */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-pill text-[13px] font-bold transition-all whitespace-nowrap",
              activeCategory === cat
                ? "bg-brand-orange text-white shadow-sm"
                : "bg-white text-muted border border-gray-100"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LESSON CARDS LIST */}
      <div className="flex flex-col gap-4">
        {loading ? (
           <div className="py-10 text-center text-muted">Loading lessons...</div>
        ) : (
          filteredLessons.map((lesson) => {
            const Icon = lesson.IconComponent;
            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                <Card className="p-4 flex flex-col gap-4 group active:scale-[0.98] transition-all shadow-sm border-none">
                  <div className="flex items-center gap-4">
                    {/* ICON BOX */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        lesson.iconBg
                      )}
                    >
                      <Icon size={24} strokeWidth={1.5} />
                    </div>

                    {/* MIDDLE CONTENT */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-pill text-[9px] font-bold uppercase tracking-[0.1em] mb-1.5",
                          lesson.difficulty === "BEGINNER"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-purple-50 text-brand-purple"
                        )}
                      >
                        {lesson.difficulty}
                      </span>
                      <h3 className="font-bold text-[#1A1A2E] text-[15px] truncate">
                        {lesson.title}
                      </h3>
                      <p className="hindi text-muted italic text-[12px] mt-0.5 truncate">
                        {lesson.hindi_description}
                      </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1 text-[#9B9BAE] text-[11px] font-medium">
                        <Clock size={12} strokeWidth={1.5} />
                        <span>{lesson.duration_mins}m</span>
                      </div>
                      <ChevronRight size={18} strokeWidth={1.5} className="text-[#9B9BAE]" />
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  {lesson.progress > 0 && (
                    <div className="pt-1">
                      <ProgressBar
                        value={lesson.progress}
                        size="sm"
                        color={lesson.progress === 100 ? "green" : "orange"}
                      />
                    </div>
                  )}
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
