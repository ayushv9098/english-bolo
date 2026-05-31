"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-brand-dark">What to do today? ✅</h3>
      <div className="bg-white rounded-[20px] border border-[#eee] p-4 space-y-4 shadow-sm">
        {steps.map((step) => {
          const isDone = step.done;
          const isNext = !isDone && step.prevDone;
          const isLocked = !isDone && !step.prevDone;

          let badgeText = "";
          let badgeClass = "";
          let circleClass = "";
          let icon = null;

          if (isDone) {
            badgeText = "Done ✓";
            badgeClass = "bg-green-50 text-green-600";
            circleClass = "bg-green-100 text-green-600";
            icon = <CheckCircle2 size={16} />;
          } else if (isNext) {
            badgeText = "Do it now";
            badgeClass = "bg-orange-50 text-brand-orange";
            circleClass = "bg-[#FFF0EB] text-brand-orange";
            icon = <span className="text-sm font-bold">{step.id}</span>;
          } else {
            badgeText = "Locked";
            badgeClass = "bg-gray-50 text-gray-400";
            circleClass = "bg-gray-100 text-gray-400";
            icon = <span className="text-sm font-bold">{step.id}</span>;
          }

          const content = (
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", circleClass)}>
                  {icon}
                </div>
                <span className={cn("text-sm font-medium", isLocked ? "text-gray-400" : "text-brand-dark")}>
                  {step.name}
                </span>
              </div>
              <div className={cn("text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap transition-colors", badgeClass)}>
                {badgeText}
              </div>
            </div>
          );

          if (isNext && step.link) {
            return (
              <Link key={step.id} href={step.link} className="block active:scale-[0.98] transition-transform">
                {content}
              </Link>
            );
          }

          return <div key={step.id}>{content}</div>;
        })}
      </div>
    </div>
  );
}
