"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Zap, Clock, Signal, CheckCircle2, Mic, Star, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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
    <div className="bg-white rounded-[24px] overflow-hidden border border-border shadow-card group">
      {/* PART 1 - PREMIUM GRADIENT HEADER */}
      <div className="relative bg-gradient-to-br from-brand-orange to-brand-orange-light px-5 pt-5 pb-4 overflow-hidden">
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
          
          <h2 className="text-white text-xl font-black leading-tight tracking-tight drop-shadow-sm">
            {title}
          </h2>
          <p className="text-white/90 font-medium hindi text-xs mt-1 line-clamp-1">
            {description}
          </p>
        </div>
      </div>

      {/* PART 2 - STRUCTURED CONTENT SECTION */}
      <div className="bg-white px-5 py-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Badge variant="xp" icon={<Star size={12} fill="#EAB308" className="text-yellow-600" />}>
            Earn +{xp_reward} XP
          </Badge>
        </div>

        <div className="space-y-3.5">
          <span className="text-xs font-medium text-muted">What you'll do</span>

          <div className="grid gap-3.5">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-brand-orange" />
              </div>
              <p className="text-sm font-semibold text-brand-dark leading-tight">
                Learn {word_count} new phrases
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Mic size={18} className="text-blue-500" />
              </div>
              <p className="text-sm font-semibold text-brand-dark leading-tight">
                Practice speaking with AI
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <p className="text-sm font-semibold text-brand-dark leading-tight">
                Test your skills with {quiz_count} questions
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div className="flex flex-col gap-4">
          <div className="h-[1px] bg-gray-100 w-full" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-muted">
                <Clock size={13} className="text-brand-orange" />
                <span className="text-xs font-medium">{duration_mins} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted">
                <Signal size={13} className="text-brand-purple" />
                <span className="text-xs font-medium capitalize">{level}</span>
              </div>
            </div>

            <Link href={`/lesson/${lesson_id}`} className="shrink-0">
              <Button className="gap-1.5 group/btn whitespace-nowrap">
                Start
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
