"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import PageTransition from "@/components/ui/PageTransition";

// High-quality avatars strictly categorized by gender (9 each for 3x3 grid)
const avatarData = {
  boys: [
    { id: 1, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jack&backgroundColor=EBF5FF', bgColor: '#EBF5FF' },
    { id: 2, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Oliver&backgroundColor=FFF3E0', bgColor: '#FFF3E0' },
    { id: 3, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Harry&backgroundColor=F3E5F5', bgColor: '#F3E5F5' },
    { id: 4, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=George&backgroundColor=E0F2F1', bgColor: '#E0F2F1' },
    { id: 5, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Noah&backgroundColor=FFEBEE', bgColor: '#FFEBEE' },
    { id: 6, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jacob&backgroundColor=E8EAF6', bgColor: '#E8EAF6' },
    { id: 7, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Leo&backgroundColor=F1F8E9', bgColor: '#F1F8E9' },
    { id: 8, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Freddie&backgroundColor=FFF8E1', bgColor: '#FFF8E1' },
    { id: 9, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Charlie&backgroundColor=F5F5F5', bgColor: '#F5F5F5' },
  ],
  girls: [
    { id: 10, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Amelia&backgroundColor=FCE4EC', bgColor: '#FCE4EC' },
    { id: 11, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Olivia&backgroundColor=F3E5F5', bgColor: '#F3E5F5' },
    { id: 12, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Isla&backgroundColor=EBF5FF', bgColor: '#EBF5FF' },
    { id: 13, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Ava&backgroundColor=FFF3E0', bgColor: '#FFF3E0' },
    { id: 14, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Mia&backgroundColor=E0F2F1', bgColor: '#E0F2F1' },
    { id: 15, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Isabella&backgroundColor=FFEBEE', bgColor: '#FFEBEE' },
    { id: 16, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sophia&backgroundColor=E8EAF6', bgColor: '#E8EAF6' },
    { id: 17, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Grace&backgroundColor=F1F8E9', bgColor: '#F1F8E9' },
    { id: 18, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Lily&backgroundColor=FFF8E1', bgColor: '#FFF8E1' },
  ]
};

export default function AvatarPage() {
  const router = useRouter();
  const [category, setCategory] = useState<"boys" | "girls">("boys");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleCategoryChange = (newCategory: "boys" | "girls") => {
    setCategory(newCategory);
    setSelectedId(null); // Reset selection on tab switch
  };

  const handleContinue = async () => {
    if (selectedId === null) return;
    setLoading(true);
    const allAvatars = [...avatarData.boys, ...avatarData.girls];
    const selectedAvatarUrl = allAvatars.find(a => a.id === selectedId)?.url;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("users")
          .update({ avatar_emoji: selectedAvatarUrl })
          .eq("id", user.id);
      }
      router.push("/home");
    } catch (err) {
      console.error("Error saving avatar:", err);
      router.push("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="h-screen bg-surface flex flex-col relative overflow-hidden font-sans">
      {/* HEADER - OPTIMIZED SPACING */}
      <header className="relative z-10 px-8 pt-10 pb-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#1A1A2E]" />
          </button>

          <div className="text-[13px] font-bold text-[#9B9BAE]">Step 3 of 3</div>
        </div>

        <div className="mt-6 space-y-1.5">
          <h1 className="text-[30px] font-[800] text-[#1A1A2E] leading-tight tracking-tight">
            Choose your <br /> profile avatar
          </h1>
          <p className="text-[15px] text-[#9B9BAE] font-medium">
            Pick one that looks like you!
          </p>
        </div>

        {/* PREMIUM iOS SEGMENTED CONTROL - COMPACT */}
        <div className="mt-6 p-1 bg-white/50 backdrop-blur-sm rounded-2xl flex relative border border-white/20">
          <motion.div
            layoutId="tab-bg"
            className="absolute inset-1 bg-white rounded-xl shadow-sm z-0 w-[calc(50%-4px)]"
            animate={{ x: category === "boys" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <button
            onClick={() => handleCategoryChange("boys")}
            className={`flex-1 py-2 text-[14px] font-bold z-10 transition-colors duration-200 ${
              category === "boys" ? "text-[#FF6B35]" : "text-gray-500"
            }`}
          >
            Boys
          </button>
          <button
            onClick={() => handleCategoryChange("girls")}
            className={`flex-1 py-2 text-[14px] font-bold z-10 transition-colors duration-200 ${
              category === "girls" ? "text-[#FF6B35]" : "text-gray-500"
            }`}
          >
            Girls
          </button>
        </div>
      </header>

      {/* AVATAR GRID - MORE COMPACT */}
      <div className="relative z-10 flex-1 px-8 pt-4 overflow-hidden">
        <motion.div 
          key={category}
          initial={{ opacity: 0, x: category === "boys" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-x-5 gap-y-6"
        >
          {avatarData[category].map((avatar) => {
            const isSelected = selectedId === avatar.id;
            return (
              <button
                key={avatar.id}
                onClick={() => setSelectedId(avatar.id)}
                className="relative flex flex-col items-center outline-none"
              >
                <div className="relative w-full aspect-square">
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="absolute inset-0 rounded-full border-[2.5px] border-[#FF6B35] z-0"
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{ scale: isSelected ? 1 : 1 }}
                    className={`relative z-10 w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 shadow-sm border-[0.5px] border-black/5`}
                    style={{ backgroundColor: avatar.bgColor }}
                  >
                    <img 
                      src={avatar.url} 
                      alt={`Avatar ${avatar.id}`} 
                      className="w-[85%] h-[85%] object-contain"
                    />
                  </motion.div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute bottom-1 right-1 w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white z-20"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[4px]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* BOTTOM BUTTON MATCHING SCREENSHOT - ULTRA-SLEEK PROPORTIONS */}
      <div className="fixed bottom-0 left-0 right-0 p-8 pb-10 bg-gradient-to-t from-surface via-surface/95 to-transparent z-30">
        <div className="max-w-[300px] mx-auto">
          <Button
            fullWidth
            disabled={selectedId === null}
            isLoading={loading}
            onClick={handleContinue}
            className={`h-[48px] text-[15px] font-bold rounded-full shadow-[0_8px_20px_-4px_rgba(255,107,53,0.25)] transition-all duration-300 border-t border-white/10 ${
              selectedId 
                ? "bg-[#FF6B35] text-white active:scale-[0.98]" 
                : "bg-[#FF6B35] text-white opacity-30 cursor-not-allowed shadow-none"
            }`}
          >
            <span className="flex items-center gap-2">
              Looks good! <span className="text-base opacity-70">→</span>
            </span>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
