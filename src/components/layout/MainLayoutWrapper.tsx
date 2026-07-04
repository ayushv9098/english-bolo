"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // We don't want the sidebar padding on lesson pages because the sidebar is hidden there.
  const isLesson = pathname.startsWith("/lesson/");
  const isSpecificGame = pathname.startsWith("/games/") && pathname !== "/games";
  const isFullScreen = isLesson || isSpecificGame;

  return (
    <main className={cn(
      "w-full mx-auto min-h-screen flex flex-col pb-24 relative transition-all duration-300",
      !isFullScreen && "md:pl-[260px]"
    )}>
      <div className={cn(
        "w-full mx-auto px-4 md:px-8",
        isFullScreen ? "max-w-3xl" : "max-w-5xl"
      )}>
        {children}
      </div>
    </main>
  );
}
