"use client";

import React from "react";
import { CheckCircle2, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";

interface HomeChecklistProps {
  lessonDone: boolean;
  gameDone: boolean;
  speakingDone: boolean;
}

export function HomeChecklist({ lessonDone, gameDone, speakingDone }: HomeChecklistProps) {
  const steps = [
    {
      id: 1,
      name: "Complete your first lesson",
      done: lessonDone,
      link: "/lessons",
      prevDone: true,
    },
    {
      id: 2,
      name: "Play a quick game",
      done: gameDone,
      link: "/games",
      prevDone: lessonDone,
    },
    {
      id: 3,
      name: "Practice speaking with AI",
      done: speakingDone,
      link: "/practice/speak",
      prevDone: gameDone,
    },
    {
      id: 4,
      name: "Finish your daily goal",
      done: lessonDone && gameDone && speakingDone,
      link: null,
      prevDone: speakingDone,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const total = steps.length;
  const allDone = completedCount === total;
  const progressPct = Math.round((completedCount / total) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-black text-brand-dark tracking-tight">What to do today? ✅</h3>
        <span className="text-[11px] font-black text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full">
          {completedCount}/{total}
        </span>
      </div>

      <div className="bg-white rounded-[22px] border border-border p-4 shadow-card">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 w-full bg-orange-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(progressPct, 6)}%` }}
            />
          </div>
        </div>

        <div className="relative space-y-1">
          {steps.map((step, idx) => {
            const isDone = step.done;
            const isNext = !isDone && step.prevDone;
            const isLocked = !isDone && !step.prevDone;
            const isLast = idx === steps.length - 1;

            let badgeText = "";
            let badgeVariant: BadgeVariant = "neutral";
            let circleClass = "";
            let icon: React.ReactNode = null;

            if (isDone) {
              badgeText = "Done";
              badgeVariant = "done";
              circleClass = "bg-green-500 text-white";
              icon = <CheckCircle2 size={16} />;
            } else if (isNext) {
              badgeText = "Do it now";
              badgeVariant = "active";
              circleClass = "bg-[#FFF0EB] text-brand-orange ring-4 ring-brand-orange/10";
              icon = <span className="text-sm font-black">{step.id}</span>;
            } else {
              badgeText = "Locked";
              badgeVariant = "locked";
              circleClass = "bg-gray-100 text-gray-400";
              icon = <Lock size={13} />;
            }

            const content = (
              <div className="flex items-center justify-between gap-2 py-2">
                <div className="flex items-center gap-3">
                  <div className="relative z-10">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all",
                        circleClass
                      )}
                    >
                      {icon}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isLocked ? "text-gray-400" : "text-brand-dark",
                      isDone && "line-through decoration-green-400/60 text-brand-dark/60"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                <Badge variant={badgeVariant}>
                  {badgeText}
                  {isNext && <ArrowRight size={11} strokeWidth={3} />}
                </Badge>
              </div>
            );

            return (
              <div key={step.id} className="relative">
                {/* connecting journey line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[15px] top-[34px] bottom-[-6px] w-[2px] z-0",
                      isDone ? "bg-green-200" : "bg-gray-100"
                    )}
                  />
                )}
                {isNext && step.link ? (
                  <Link
                    href={step.link}
                    className="block rounded-xl -mx-1 px-1 active:scale-[0.98] hover:bg-orange-50/40 transition-all"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>

        {/* Celebration footer when all done */}
        {allDone && (
          <div className="mt-3 flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-2xl py-2.5 text-sm font-bold">
            <Sparkles size={15} />
            Daily goal smashed! See you tomorrow 🎉
          </div>
        )}
      </div>
    </div>
  );
}
