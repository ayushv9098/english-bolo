"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const avatars = [
  { id: 1, emoji: '🧑‍💻', gradient: 'linear-gradient(135deg, #FFE8D6, #FFB085)' },
  { id: 2, emoji: '👩‍💻', gradient: 'linear-gradient(135deg, #FFD6E8, #FF85B0)' },
  { id: 3, emoji: '🧔', gradient: 'linear-gradient(135deg, #D6E8FF, #85B0FF)' },
  { id: 4, emoji: '👩‍🎓', gradient: 'linear-gradient(135deg, #E8D6FF, #B085FF)' },
  { id: 5, emoji: '🧑‍🎓', gradient: 'linear-gradient(135deg, #D6FFE8, #85FFB0)' },
  { id: 6, emoji: '🦸', gradient: 'linear-gradient(135deg, #FFE8D6, #FF6B35)' },
  { id: 7, emoji: '🧑‍🎨', gradient: 'linear-gradient(135deg, #FFD6D6, #FF8585)' },
  { id: 8, emoji: '👨‍🏫', gradient: 'linear-gradient(135deg, #D6F0FF, #85D4FF)' },
  { id: 9, emoji: '👩‍🏫', gradient: 'linear-gradient(135deg, #FFF0D6, #FFD485)' },
  { id: 10, emoji: '🧑‍💼', gradient: 'linear-gradient(135deg, #D6FFE8, #4CAF82)' },
  { id: 11, emoji: '👩‍💼', gradient: 'linear-gradient(135deg, #F0D6FF, #9B6BFF)' },
  { id: 12, emoji: '🧑‍🔬', gradient: 'linear-gradient(135deg, #D6FFFF, #6BFFEE)' },
];

export default function AvatarPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleContinue = async () => {
    if (selectedId === null) return;
    
    setLoading(true);
    const selectedEmoji = avatars.find(a => a.id === selectedId)?.emoji;

    try {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save selected emoji to Supabase users table
        const { error } = await supabase
          .from("users")
          .update({ avatar_emoji: selectedEmoji })
          .eq("id", user.id);

        if (error) {
          console.error("Error saving avatar:", error);
          // Still navigate even if error for prototype purposes, or show error
        }
      }
      
      // Navigate to next onboarding step (home for now)
      router.push("/home");
    } catch (err) {
      console.error("Unexpected error:", err);
      router.push("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col p-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col gap-6 pt-2">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-brand-dark" />
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] leading-tight">
            Apna avatar choose karo
          </h1>
          <p className="hindi text-[13px] text-muted">
            Yeh aapki app mein dikhega
          </p>
        </div>
      </div>

      {/* AVATAR GRID */}
      <div className="grid grid-cols-3 gap-6 mt-12 px-2">
        {avatars.map((avatar) => {
          const isSelected = selectedId === avatar.id;
          return (
            <button
              key={avatar.id}
              onClick={() => setSelectedId(avatar.id)}
              className="flex flex-col items-center justify-center relative outline-none"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-200 shadow-sm ${
                  isSelected 
                    ? "scale-108 border-[3px] border-brand-orange shadow-[0_0_0_4px_rgba(255,107,53,0.15)]" 
                    : "border-none"
                }`}
                style={{ background: avatar.gradient }}
              >
                {avatar.emoji}
              </div>
            </button>
          );
        })}
      </div>

      {/* CONTINUE BUTTON */}
      <div className="fixed bottom-8 left-5 right-5 max-w-md mx-auto">
        <Button
          fullWidth
          disabled={selectedId === null}
          isLoading={loading}
          onClick={handleContinue}
          className="py-4 text-[15px] font-bold rounded-pill"
        >
          Yahi chahiye →
        </Button>
      </div>
    </div>
  );
}
