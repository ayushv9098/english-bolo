import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartsDisplayProps {
  max: number;
  current: number;
}

export function HeartsDisplay({ max, current }: HeartsDisplayProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Heart 
          key={i} 
          size={24} 
          className={cn(
            "transition-all duration-300",
            i < current ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "fill-gray-300 text-gray-300"
          )} 
        />
      ))}
    </div>
  );
}
