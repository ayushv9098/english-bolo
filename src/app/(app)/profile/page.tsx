"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Zap, 
  Star, 
  BookOpen, 
  Bell, 
  Moon, 
  Shield, 
  Settings, 
  ChevronRight, 
  LogOut 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [lessonsCount, setLessonsCount] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
        const { count } = await supabase.from("user_progress").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
        
        setProfile(data);
        setLessonsCount(count || 0);
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!profile) return <div className="min-h-screen bg-surface flex items-center justify-center font-bold text-muted">Loading profile...</div>;

  const firstName = profile.name ? profile.name.split(" ")[0] : "Learner";
  const avatar = profile.avatar_emoji || "😎";
  const levelText = profile.level === "Bilkul nahi" ? "Beginner" : profile.level === "Thoda" ? "Elementary" : "Intermediate";

  return (
    <div className="flex flex-col gap-8 p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* PROFILE HEADER */}
      <section className="flex flex-col items-center text-center gap-4 mt-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-brand-orange flex items-center justify-center text-white text-[40px] shadow-sm">
            {avatar}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-[3px] border-surface rounded-full shadow-sm"></div>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[24px] font-[800] text-brand-dark tracking-[-0.5px]">{firstName}</h1>
          <div className="inline-flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-pill self-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
              Premium • {levelText}
            </span>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: Zap, value: profile.streak || "0", label: "Streak", color: "text-brand-orange" },
          { icon: Star, value: profile.xp_points || "0", label: "XP", color: "text-yellow-500" },
          { icon: BookOpen, value: lessonsCount.toString(), label: "Lessons", color: "text-brand-purple" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col items-center gap-1.5 border-none shadow-sm">
            <stat.icon className={`${stat.color} w-5 h-5 mb-1`} strokeWidth={2} />
            <span className="text-[20px] font-[800] text-brand-dark leading-none">{stat.value}</span>
            <span className="text-[9px] font-bold text-muted uppercase tracking-[0.1em]">{stat.label}</span>
          </Card>
        ))}
      </section>

      {/* SETTINGS SECTION */}
      <section className="flex flex-col gap-4">
        <h3 className="text-[13px] font-bold text-brand-dark px-1">Settings</h3>
        <div className="flex flex-col gap-3">
          {[
            { 
              icon: Bell, 
              label: "Daily Reminders", 
              right: <span className="text-[11px] font-bold text-brand-orange bg-orange-50 px-2 py-1 rounded-md">8:30 PM</span> 
            },
            { 
              icon: Moon, 
              label: "Dark Mode", 
              right: (
                <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
                </div>
              ) 
            },
            { 
              icon: Shield, 
              label: "Privacy & Security", 
              right: <ChevronRight size={16} className="text-muted" strokeWidth={2} /> 
            },
            { 
              icon: Settings, 
              label: "System Preferences", 
              right: <ChevronRight size={16} className="text-muted" strokeWidth={2} /> 
            },
          ].map((item, i) => (
            <Card key={i} className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-colors cursor-pointer shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-muted">
                  <item.icon size={18} strokeWidth={1.5} />
                </div>
                <span className="text-[14px] font-bold text-brand-dark">{item.label}</span>
              </div>
              {item.right}
            </Card>
          ))}
        </div>
      </section>

      {/* SIGN OUT BUTTON */}
      <Button 
        variant="ghost" 
        className="mt-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 gap-2 font-bold py-4 rounded-pill bg-white"
        fullWidth
        onClick={handleSignOut}
      >
        <LogOut size={18} strokeWidth={2} />
        Sign Out
      </Button>
    </div>
  );
}
