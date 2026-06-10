"use client";

import { cn } from "@/lib/utils";

// Each avatar is sliced from the source bundle into its own square PNG under
// /public/avatars/<ID>.png (see scripts/slicing). Order here drives the picker grid.
export const AVATAR_OPTIONS = [
  "G01", "G02", "G03", "G04", "G05", "G06", "G07", "G10",
  "G11", "G12", "G13", "G14", "G17", "G18", "G19", "G20",
  "B01", "B02", "B03", "B04", "B05", "B06", "B17", "B18",
  "B11", "B12", "B13", "B14", "B15", "B16", "B19", "B20",
  "N01", "N02", "N03", "N04", "N05", "N06", "N07", "N08",
  "N09", "N10", "N11", "N12", "N13", "N14", "N15", "N16",
];

const AVATAR_SET = new Set(AVATAR_OPTIONS);

interface UserAvatarProps {
  id: string | null;
  className?: string;
}

export function UserAvatar({ id, className = "" }: UserAvatarProps) {
  if (!id) return <div className={cn("bg-gray-100 rounded-full", className)} />;

  // Known sliced avatar
  if (AVATAR_SET.has(id)) {
    return (
      <div className={cn("overflow-hidden bg-white relative rounded-full", className)}>
        <img
          src={`/avatars/${id}.png`}
          alt="avatar"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-full pointer-events-none" />
      </div>
    );
  }

  // Fallback for legacy values: external URL (onboarding) or emoji/text
  return (
    <div className={cn("flex items-center justify-center bg-gray-50 rounded-full text-center overflow-hidden", className)}>
      {id.startsWith("http")
        ? <img src={id} alt="avatar" className="w-full h-full object-cover" draggable={false} />
        : id}
    </div>
  );
}
