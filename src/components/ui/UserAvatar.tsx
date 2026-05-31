"use client";

import { cn } from "@/lib/utils";

// Avatar Sprite Sheet Mapping (8 columns, 4 rows of content)
export const AVATAR_MAP: Record<string, { x: number, y: number }> = {
  "G01": { x: 0, y: 0 }, "G02": { x: 1, y: 0 }, "G03": { x: 2, y: 0 }, "G04": { x: 3, y: 0 }, "G05": { x: 4, y: 0 }, "G06": { x: 5, y: 0 }, "G07": { x: 6, y: 0 }, "G10": { x: 7, y: 0 },
  "G11": { x: 0, y: 1 }, "G12": { x: 1, y: 1 }, "G13": { x: 2, y: 1 }, "G14": { x: 3, y: 1 }, "G17": { x: 4, y: 1 }, "G18": { x: 5, y: 1 }, "G19": { x: 6, y: 1 }, "G20": { x: 7, y: 1 },
  "B01": { x: 0, y: 2 }, "B02": { x: 1, y: 2 }, "B03": { x: 2, y: 2 }, "B04": { x: 3, y: 2 }, "B05": { x: 4, y: 2 }, "B06": { x: 5, y: 2 }, "B17": { x: 6, y: 2 }, "B18": { x: 7, y: 2 },
  "B11": { x: 0, y: 3 }, "B12": { x: 1, y: 3 }, "B13": { x: 2, y: 3 }, "B14": { x: 3, y: 3 }, "B15": { x: 4, y: 3 }, "B16": { x: 5, y: 3 }, "B19": { x: 6, y: 3 }, "B20": { x: 7, y: 3 },
};

export const AVATAR_OPTIONS = Object.keys(AVATAR_MAP);

interface UserAvatarProps {
  id: string | null;
  className?: string;
}

export function UserAvatar({ id, className = "" }: UserAvatarProps) {
  if (!id) return <div className={cn("bg-gray-100 rounded-full", className)} />;
  
  const pos = AVATAR_MAP[id];
  
  if (!pos) {
    // Fallback to emoji or just displaying the text if it's not in the map
    // Check if it's an emoji (common for old users)
    return (
      <div className={cn("flex items-center justify-center bg-gray-50 rounded-full text-center overflow-hidden", className)}>
        {id.length > 3 ? (
            // If it looks like a URL
            id.startsWith('http') ? <img src={id} alt="avatar" className="w-full h-full object-cover" /> : id
        ) : id}
      </div>
    );
  }

  // Calibration to give more "breathing room" (less cramped)
  const xPercent = (pos.x * 100) / 7;
  const yOffsets = [28, 49, 74, 95];
  const yPercent = yOffsets[pos.y];

  return (
    <div 
      className={cn("overflow-hidden bg-white flex items-center justify-center relative rounded-full", className)}
    >
      <div 
        style={{
          backgroundImage: `url('/avatars/bundle.png')`,
          backgroundSize: '950% 600%', 
          backgroundPosition: `${xPercent}% ${yPercent}%`,
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
          imageRendering: 'auto',
        }}
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-full pointer-events-none" />
    </div>
  );
}
