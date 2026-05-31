import { Skeleton } from "@/components/ui/Skeleton";
import Card from "@/components/ui/Card";

export default function HomeLoading() {
  return (
    <div className="flex flex-col p-6 gap-6 animate-in fade-in duration-500 pb-10">
      {/* HEADER SKELETON */}
      <header className="flex justify-between items-center pt-8 pb-2">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-2xl" />
          <Skeleton className="w-10 h-10 rounded-2xl" />
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {/* STATS SKELETON */}
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-[24px]" />
          <Skeleton className="h-28 rounded-[24px]" />
        </div>

        {/* DAILY LESSON SKELETON */}
        <Skeleton className="h-48 rounded-[28px] w-full" />

        {/* CHECKLIST SKELETON */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Card className="p-4 space-y-4 border-none shadow-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </Card>
        </div>

        {/* GAMES ROW SKELETON */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-[80px] h-[100px] rounded-xl shrink-0" />
            ))}
          </div>
        </div>

        {/* QUICK PRACTICE SKELETON */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-36 rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
