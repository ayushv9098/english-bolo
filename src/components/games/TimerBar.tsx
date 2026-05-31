import { cn } from "@/lib/utils";

interface TimerBarProps {
  duration: number; // in seconds
  timeLeft: number; // in seconds
  className?: string;
}

export function TimerBar({ duration, timeLeft, className }: TimerBarProps) {
  const percentage = Math.max(0, Math.min(100, (timeLeft / duration) * 100));
  
  // Color changes based on time left
  const getColor = () => {
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500 animate-pulse";
  };

  return (
    <div className={cn("w-full h-3 bg-gray-200 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full transition-all duration-100 ease-linear rounded-full", getColor())}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
