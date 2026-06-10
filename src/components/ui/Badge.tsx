import { HTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeVariant =
  | "done"
  | "active"
  | "locked"
  | "xp"
  | "streak"
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  done: "bg-green-50 text-green-600",
  active: "bg-brand-orange text-white shadow-sm",
  locked: "bg-gray-50 text-gray-400",
  xp: "bg-yellow-50 text-yellow-700",
  streak: "bg-orange-50 text-brand-orange",
  neutral: "bg-gray-50 text-gray-500",
};

export default function Badge({
  variant = "neutral",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full whitespace-nowrap text-[11px] font-bold px-2.5 py-1 transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
