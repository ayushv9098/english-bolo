"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { Level } from "@/types";
import { BarChart, BarChart2, BarChart3, ChevronRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const levels: { id: Level; label: string; sub: string; icon: any; accent: string }[] = [
  { id: "Bilkul nahi", label: "Beginner", sub: "I'm starting from zero", icon: BarChart, accent: "bg-orange-50/50" },
  { id: "Thoda", label: "Elementary", sub: "I know basic phrases", icon: BarChart2, accent: "bg-blue-50/50" },
  { id: "Kaam chalata", label: "Intermediate", sub: "I can communicate a bit", icon: BarChart3, accent: "bg-green-50/50" },
];

export default function LevelPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const selectLevel = async (levelId: Level) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("users").update({ level: levelId }).eq("id", user.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      router.push("/onboarding/avatar");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-6 bg-surface flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md space-y-12"
      >
        <motion.div variants={item} className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 border border-brand-100">
            <Sparkles size={24} className="text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight leading-tight">
            What is your level?
          </h1>
          <p className="text-navy-400 font-medium text-sm">Be honest, we won't judge!</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {levels.map((level) => (
            <motion.button 
              key={level.id} 
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectLevel(level.id)}
              className="group text-left"
              disabled={loading}
            >
              <Card className={`p-6 border-navy-100 hover:border-brand-200 transition-all text-center space-y-4 ${level.accent}`}>
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-soft mx-auto group-hover:scale-105 transition-transform">
                  <level.icon size={28} className="text-navy-700" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-navy-900 leading-none">{level.label}</h2>
                  <p className="text-xs text-navy-500 font-medium italic">"{level.sub}"</p>
                </div>
                <div className="flex items-center justify-center text-navy-300 group-hover:text-brand-primary transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest mr-1">Select</span>
                  <ChevronRight size={14} />
                </div>
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}