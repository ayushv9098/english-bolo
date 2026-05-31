"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  className?: string;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({ 
  progress, 
  color = "bg-brand-orange", 
  className,
  height = "h-3",
  showLabel = false
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden relative", height, className)}>
      <div 
        className={cn("h-full transition-all duration-500 ease-out rounded-full", color)}
        style={{ width: `${percentage}%` }}
      />
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
          {Math.floor(percentage)}%
        </div>
      )}
    </div>
  );
}
