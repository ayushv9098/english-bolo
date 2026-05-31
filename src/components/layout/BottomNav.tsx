"use client";

import Link from "next/link";
import { Home, BookOpen, User, Gamepad2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/lesson/")) return null;

  const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Lessons", icon: BookOpen, href: "/lessons" },
    { label: "Games", icon: Gamepad2, href: "/games" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#F5EDE8] px-4 min-h-[62px] pb-[env(safe-area-inset-bottom,12px)] pt-1.5 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 group transition-all duration-200"
            >
              <div
                className={cn(
                  "px-[14px] py-[4px] rounded-2xl transition-all duration-200 flex items-center justify-center",
                  isActive ? "bg-orange-50" : "bg-transparent"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-brand-orange" : "text-[#C4C4D4]"
                  )}
                  strokeWidth={isActive ? 3 : 2}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.05em] transition-colors duration-200",
                  isActive ? "text-brand-orange" : "text-[#C4C4D4] opacity-80"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
