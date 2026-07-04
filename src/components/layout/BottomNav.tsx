"use client";

import Link from "next/link";
import { Home, BookOpen, User, Gamepad2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const pathname = usePathname();

  const isLesson = pathname.startsWith("/lesson/");
  const isSpecificGame = pathname.startsWith("/games/") && pathname !== "/games";

  if (isLesson || isSpecificGame) return null;

  const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Lessons", icon: BookOpen, href: "/lessons" },
    { label: "Games", icon: Gamepad2, href: "/games" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:w-[260px] md:right-auto md:border-r md:border-t-0 bg-white/85 dark:bg-[#12121A]/85 backdrop-blur-xl border-t border-[#F5EDE8] dark:border-[#2A2A38] px-3 md:px-6 min-h-[62px] pb-[env(safe-area-inset-bottom,12px)] pt-2.5 md:pt-14 md:pb-8 z-50 shadow-[0_-6px_24px_-12px_rgba(26,26,46,0.14)] md:shadow-none transition-all">
      {/* Brand logo for desktop only */}
      <div className="hidden md:flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center text-white font-black text-xl shadow-sm">A</div>
        <span className="font-black text-brand-dark tracking-tight text-xl">AngreziBolo</span>
      </div>

      <div className="w-full max-w-xl mx-auto md:mx-0 flex md:flex-col justify-around md:justify-start items-center md:items-stretch h-full gap-1 md:gap-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "relative flex items-center justify-center md:justify-start rounded-full h-11 md:h-12 select-none transition-[padding] duration-300 group",
                isActive ? "px-4 md:px-5" : "px-3.5 md:px-5 active:scale-90"
              )}
            >
              {/* sliding morphing pill behind the active tab */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-orange to-orange-500 shadow-[0_8px_18px_-4px_rgba(255,107,53,0.55)]"
                >
                  <span className="absolute inset-0 rounded-full bg-brand-orange/30 blur-md -z-10" />
                </motion.div>
              )}

              <span className="relative z-10 flex items-center gap-1.5">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.6 : 2}
                  className={cn(
                    "transition-colors duration-300 shrink-0",
                    isActive ? "text-white fill-white/20" : "text-[#C4C4D4]"
                  )}
                />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key="label"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden whitespace-nowrap text-[11px] font-black uppercase tracking-wide text-white md:hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className={cn(
                  "hidden md:block whitespace-nowrap text-sm font-bold ml-1 transition-colors",
                  isActive ? "text-white" : "text-brand-dark/70 group-hover:text-brand-orange"
                )}>
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
