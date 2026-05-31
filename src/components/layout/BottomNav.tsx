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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EDE8] px-6 min-h-[64px] pb-[env(safe-area-inset-bottom,16px)] pt-2 z-50">
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
                  "px-[14px] py-[4px] rounded-full transition-all duration-200 flex items-center justify-center",
                  isActive ? "bg-[#FFF0EB]" : "bg-transparent"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-brand-orange" : "text-[#C4C4D4]"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.05em] transition-colors duration-200",
                  isActive ? "text-brand-orange font-[700]" : "text-[#C4C4D4] font-normal"
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
