"use client";

import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ProgressBarProps {
  value: number;
  color?: "orange" | "purple" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export default function ProgressBar({
  value = 0,
  color = "orange",
  size = "md",
  className,
  showValue = false,
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setWidth(Math.min(100, Math.max(0, value)));
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const colors = {
    orange: "bg-brand-orange",
    purple: "bg-brand-purple",
    green: "bg-green-500",
  };

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        {showValue && (
          <span className="text-xs font-semibold text-brand-dark">{width}%</span>
        )}
      </div>
      <div
        className={cn(
          "w-full bg-[#F0EBF8] rounded-full overflow-hidden",
          heights[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            colors[color]
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
