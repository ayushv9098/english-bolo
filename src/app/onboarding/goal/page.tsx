"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { Goal } from "@/types";
import { Briefcase, Rocket, Plane, Sparkles, ChevronRight, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const goals: { id: Goal; label: string; icon: any; accent: string }[] = [
  { id: "Interview", label: "Job Interview", icon: Briefcase, accent: "bg-orange-50/50" },
  { id: "Job", label: "Career Growth", icon: Rocket, accent: "bg-blue-50/50" },
  { id: "Travel", label: "Global Travel", icon: Plane, accent: "bg-green-50/50" },
  { id: "Confidence", label: "Daily Confidence", icon: Sparkles, accent: "bg-purple-50/50" },
];

export default function GoalPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const selectGoal = async (goalId: Goal) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("users").update({ goal: goalId }).eq("id", user.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      router.push("/onboarding/level");
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
            <Target size={24} className="text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight leading-tight">
            What is your main goal?
          </h1>
          <p className="text-navy-400 font-medium text-sm">We'll personalize your learning path</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {goals.map((goal) => (
            <motion.button 
              key={goal.id} 
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectGoal(goal.id)}
              className="group text-left"
              disabled={loading}
            >
              <Card className={`flex items-center space-x-4 p-5 border-navy-100 hover:border-brand-200 transition-all ${goal.accent}`}>
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                  <goal.icon size={22} className="text-navy-700" />
                </div>
                <div className="flex-1">
                  <span className="text-base font-bold text-navy-900">{goal.label}</span>
                  <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mt-0.5">Focus Area</p>
                </div>
                <ChevronRight size={18} className="text-navy-200 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
