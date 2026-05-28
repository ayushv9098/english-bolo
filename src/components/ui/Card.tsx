"use client";

import { HTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "colored";
  padding?: "none" | "sm" | "md" | "lg";
  accentColor?: "orange" | "purple" | "green";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", accentColor, children, ...props }, ref) => {
    const variants = {
      default: "bg-white shadow-card",
      elevated: "bg-white shadow-float",
      outlined: "bg-white border-[1.5px] border-gray-100",
      colored: "bg-white shadow-card border-l-4",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const accents = {
      orange: "border-l-brand-orange",
      purple: "border-l-brand-purple",
      green: "border-l-green-500",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-card transition-all",
          variants[variant],
          paddings[padding],
          variant === "colored" && accentColor ? accents[accentColor] : "",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
