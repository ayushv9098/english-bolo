"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Zap, Clock, Signal, CheckCircle2, Mic, Star, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface DailyLessonCardProps {
  title: string;
  description: string;
  duration_mins: number;
  level: string;
  xp_reward: number;
  word_count: number;
  quiz_count: number;
  lesson_id: string;
}

export default function DailyLessonCard({
  title,
  description,
  duration_mins,
  level,
  xp_reward,
  word_count,
  quiz_count,
  lesson_id
}: DailyLessonCardProps) {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-[#F5EDE8] shadow-card group">
      {/* PART 1 - PREMIUM GRADIENT HEADER */}
      <div className="relative bg-gradient-to-br from-brand-orange to-[#FF8C61] px-4 pt-4 pb-3 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 transition-transform duration-500">
          <BookOpen size={64} color="white" strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-md px-1.5 py-0.5 flex items-center gap-1 shadow-sm">
              <Zap size={10} fill="white" className="text-white animate-pulse" />
              <span className="text-[8px] font-black text-white uppercase tracking-[0.1em]">
                Daily Lesson
              </span>
            </div>
          </div>
          
          <h2 className="text-white text-[18px] font-black leading-tight tracking-tight drop-shadow-sm">
            {title}
          </h2>
          <p className="text-white/90 font-medium hindi text-[11px] mt-0.5 line-clamp-1">
            {description}
          </p>
        </div>
      </div>

      {/* PART 2 - STRUCTURED CONTENT SECTION */}
      <div className="bg-white px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="bg-yellow-400/10 border border-yellow-200 shadow-sm rounded-lg px-2.5 py-1 flex items-center gap-1 active:scale-95 transition-transform cursor-default">
              <Star size={12} fill="#EAB308" className="text-yellow-600" />
              <span className="text-[10px] font-black text-yellow-700 uppercase tracking-tight">
                Earn +{xp_reward} XP
              </span>
            </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
             <div className="h-[1px] flex-1 bg-gray-100" />
             <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">What you'll do</span>
             <div className="h-[1px] flex-1 bg-gray-100" />
          </div>

          <div className="grid gap-3">
            {/* Step 1 */}
            <div className="flex items-center gap-3 group/step">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50 group-hover/step:scale-110 transition-transform">
                <BookOpen size={18} className="text-brand-orange" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-brand-orange/60 uppercase tracking-widest leading-none mb-0.5">Step 1: Learning</span>
                <p className="text-[12px] font-bold text-brand-dark leading-tight">
                  Learn {word_count} new phrases
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 group/step">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50 group-hover/step:scale-110 transition-transform">
                <Mic size={18} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-blue-500/60 uppercase tracking-widest leading-none mb-0.5">Step 2: Speaking</span>
                <p className="text-[12px] font-bold text-brand-dark leading-tight">
                  Practice speaking with AI
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 group/step">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 border border-green-100/50 group-hover/step:scale-110 transition-transform">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-green-500/60 uppercase tracking-widest leading-none mb-0.5">Step 3: Quiz</span>
                <p className="text-[12px] font-bold text-brand-dark leading-tight">
                  Test your skills with {quiz_count} questions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div className="mt-1 flex flex-col gap-3">
          <div className="h-[1px] bg-gray-50 w-full" />
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-x-2.5 gap-y-1">
              <div className="flex items-center gap-1 text-muted">
                <Clock size={12} className="text-brand-orange" />
                <span className="text-[10px] font-black uppercase tracking-tight">{duration_mins} min</span>
              </div>
              <div className="flex items-center gap-1 text-muted">
                <Signal size={12} className="text-brand-purple" />
                <span className="text-[10px] font-black uppercase tracking-tight">{level}</span>
              </div>
            </div>
            
            <Link href={`/lesson/${lesson_id}`} className="shrink-0">
              <Button className="bg-brand-orange hover:bg-orange-600 text-white text-[11px] font-black px-4 py-2 rounded-lg active:scale-95 transition-all h-auto shadow-md shadow-orange-100 flex items-center gap-1.5 group/btn whitespace-nowrap">
                Start
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
