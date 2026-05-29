"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
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
import toast from "react-hot-toast";

import PageTransition from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (!data?.goal) {
        router.push("/onboarding/goal");
        return;
      }
      
      const { count } = await supabase.from("user_progress").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
      
      setProfile(data);
      setLessonsCount(count || 0);
    }
    loadProfile();
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  const confirmSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(darkMode ? "Light mode activated" : "Dark mode activated", {
      icon: darkMode ? '☀️' : '🌙'
    });
  };

  const toggleReminders = () => {
    setRemindersEnabled(!remindersEnabled);
    toast.success(remindersEnabled ? "Reminders paused" : "Reminders enabled for 8:30 PM", {
      icon: remindersEnabled ? '🔕' : '🔔'
    });
  };

  if (!profile) {
    return (
      <PageTransition className="flex flex-col gap-8 p-6 pb-24">
        <section className="flex flex-col items-center text-center gap-4 mt-8">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-40 rounded-pill" />
          </div>
        </section>
        <section className="grid grid-cols-3 gap-3">
          <Card className="p-4 border-none shadow-sm"><Skeleton className="h-16 w-full" /></Card>
          <Card className="p-4 border-none shadow-sm"><Skeleton className="h-16 w-full" /></Card>
          <Card className="p-4 border-none shadow-sm"><Skeleton className="h-16 w-full" /></Card>
        </section>
        <section className="flex flex-col gap-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-col gap-3">
             <Card className="p-4 border-none shadow-sm"><Skeleton className="h-10 w-full" /></Card>
             <Card className="p-4 border-none shadow-sm"><Skeleton className="h-10 w-full" /></Card>
             <Card className="p-4 border-none shadow-sm"><Skeleton className="h-10 w-full" /></Card>
          </div>
        </section>
      </PageTransition>
    );
  }

  const firstName = profile.name ? profile.name.split(" ")[0] : "Learner";
  const avatar = profile.avatar_emoji || "😎";
  const levelText = profile.level === "Bilkul nahi" ? "Beginner" : profile.level === "Thoda" ? "Elementary" : "Intermediate";

  return (
    <PageTransition className="flex flex-col gap-8 p-6 pb-24">
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
          {/* Daily Reminders Toggle */}
          <Card 
            onClick={toggleReminders}
            className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-muted">
                <Bell size={18} strokeWidth={1.5} className={remindersEnabled ? "text-brand-orange" : ""} />
              </div>
              <span className="text-[14px] font-bold text-brand-dark">Daily Reminders</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-1 rounded-md transition-colors ${remindersEnabled ? 'text-brand-orange bg-orange-50' : 'text-muted bg-gray-100'}`}>
              {remindersEnabled ? '8:30 PM' : 'Off'}
            </span>
          </Card>

          {/* Dark Mode Toggle */}
          <Card 
            onClick={toggleDarkMode}
            className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-muted">
                <Moon size={18} strokeWidth={1.5} className={darkMode ? "text-brand-purple" : ""} />
              </div>
              <span className="text-[14px] font-bold text-brand-dark">Dark Mode</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-brand-purple' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${darkMode ? 'left-5' : 'left-0.5'}`}></div>
            </div>
          </Card>

          {/* Privacy Link */}
          <Link href="/profile/privacy">
            <Card className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-colors cursor-pointer shadow-sm active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-muted">
                  <Shield size={18} strokeWidth={1.5} />
                </div>
                <span className="text-[14px] font-bold text-brand-dark">Privacy & Security</span>
              </div>
              <ChevronRight size={16} className="text-muted" strokeWidth={2} />
            </Card>
          </Link>

          {/* System Preferences Link */}
          <Link href="/profile/system">
            <Card className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-colors cursor-pointer shadow-sm active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-muted">
                  <Settings size={18} strokeWidth={1.5} />
                </div>
                <span className="text-[14px] font-bold text-brand-dark">System Preferences</span>
              </div>
              <ChevronRight size={16} className="text-muted" strokeWidth={2} />
            </Card>
          </Link>
        </div>
      </section>

      {/* SIGN OUT BUTTON */}
      <Button 
        variant="ghost" 
        className="mt-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 gap-2 font-bold py-4 rounded-pill bg-white active:scale-95"
        fullWidth
        onClick={confirmSignOut}
      >
        <LogOut size={18} strokeWidth={2} />
        Sign Out
      </Button>

      {/* SIGN OUT CONFIRMATION MODAL */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <Card className="w-full max-w-xs p-6 space-y-6 border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-lg font-bold text-brand-dark">Sign Out?</h3>
              <p className="text-sm text-muted px-2">Are you sure you want to sign out from AngreziBolo? You will need to sign in again to continue.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="primary" 
                className="bg-red-500 hover:bg-red-600 text-white border-none h-12 font-bold"
                onClick={handleSignOut}
              >
                Yes, Sign Out
              </Button>
              <Button 
                variant="ghost" 
                className="border-none text-muted hover:bg-gray-50 h-12 font-semibold"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PageTransition>
  );
}
