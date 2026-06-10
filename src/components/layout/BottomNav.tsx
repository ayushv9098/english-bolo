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

  if (pathname.startsWith("/lesson/")) return null;

  const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Lessons", icon: BookOpen, href: "/lessons" },
    { label: "Games", icon: Gamepad2, href: "/games" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-[#F5EDE8] px-3 min-h-[62px] pb-[env(safe-area-inset-bottom,12px)] pt-2.5 z-50 shadow-[0_-6px_24px_-12px_rgba(26,26,46,0.14)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-full gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "relative flex items-center justify-center rounded-full h-11 select-none transition-[padding] duration-300",
                isActive ? "px-4" : "px-3.5 active:scale-90"
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
                      className="overflow-hidden whitespace-nowrap text-[11px] font-black uppercase tracking-wide text-white"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
