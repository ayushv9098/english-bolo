"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { 
  Settings, 
  LogOut,
  Trophy,
  Medal,
  Flame,
  Star,
  Gift,
  Shield,
  Zap,
  Moon,
  Bell,
  BarChart2,
  ChevronRight,
  Key,
  Database,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Pencil,
  Check as CheckIcon,
  Store
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import PageTransition from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGamification } from "@/context/GamificationContext";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import { cn } from "@/lib/utils";
import { UserAvatar, AVATAR_OPTIONS } from "@/components/ui/UserAvatar";
import { motion } from "framer-motion";

const ACHIEVEMENTS = [
  { id: 1, title: 'First 100 XP', description: 'Earn your first 100 XP', icon: '🌟', unlocked: true },
  { id: 2, title: '7 Day Streak', description: 'Play for 7 days in a row', icon: '🔥', unlocked: false },
  { id: 3, title: 'First Mission', description: 'Complete a Real Life Mission', icon: '🏙️', unlocked: true },
  { id: 4, title: 'English Warrior', description: 'Reach English Warrior rank', icon: '⚔️', unlocked: false },
];

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { totalXP, rank, currentStreak, unopenedLootBoxes, openLootBox } = useGamification();
  
  const [profile, setProfile] = useState<any>(null);
  const [showSecurityView, setShowSecurityView] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      setProfile(data);
      setEditName(data?.name || "");
      setEditAvatar(data?.avatar_emoji || "G01");
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

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Min 6 characters required");
      return;
    }
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed!");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setIsSavingProfile(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("users").update({ name: editName, avatar_emoji: editAvatar }).eq("id", user.id);
      if (error) throw error;
      setProfile({ ...profile, name: editName, avatar_emoji: editAvatar });
      toast.success("Profile updated!");
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(darkMode ? "Light mode" : "Dark mode", { icon: darkMode ? '☀️' : '🌙' });
  };

  const toggleReminders = () => {
    setRemindersEnabled(!remindersEnabled);
    toast.success(remindersEnabled ? "Reminders off" : "Reminders on", { icon: remindersEnabled ? '🔕' : '🔔' });
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
        <Skeleton className="w-20 h-20 rounded-full mb-4" />
        <Skeleton className="w-24 h-4" />
      </div>
    );
  }

  const firstName = profile.name ? profile.name.split(" ")[0] : "Learner";
  const avatarId = profile.avatar_emoji || "G01";

  const renderModals = () => (
    <>
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <Card className="w-full max-w-xs p-5 space-y-5 border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-brand-dark">Edit Profile</h3>
              <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Update your look</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-brand-dark/30 tracking-widest px-1">Your Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 font-bold text-sm focus:ring-4 focus:ring-brand-orange/5 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-brand-dark/30 tracking-widest px-1">Select Avatar</label>
                <div className="grid grid-cols-4 gap-2 bg-gray-50 p-2 rounded-xl max-h-[220px] overflow-y-auto no-scrollbar border border-gray-100">
                  {AVATAR_OPTIONS.map((id) => (
                    <button key={id} onClick={() => setEditAvatar(id)} className={cn("w-12 h-12 flex items-center justify-center rounded-lg transition-all active:scale-90 overflow-hidden relative", editAvatar === id ? "bg-white shadow-sm ring-2 ring-brand-orange" : "hover:bg-white/50")}>
                      <UserAvatar id={id} className="w-full h-full" />
                      {editAvatar === id && <div className="absolute inset-0 bg-brand-orange/10 flex items-center justify-center"><div className="bg-brand-orange text-white rounded-full p-0.5"><CheckIcon size={8} strokeWidth={4} /></div></div>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <Button onClick={handleSaveProfile} isLoading={isSavingProfile} className="w-full bg-brand-orange text-white border-none h-11 font-black rounded-xl text-xs uppercase tracking-widest">Save Changes</Button>
                <Button variant="ghost" className="w-full h-9 border-none text-muted font-bold text-xs" onClick={() => setShowEditModal(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <Card className="w-full max-w-xs p-5 space-y-5 border-none shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-2"><LogOut size={20} /></div>
              <h3 className="text-base font-black text-brand-dark">Sign Out?</h3>
              <p className="text-[12px] text-muted font-medium px-2">Are you sure you want to log out of AngreziBolo?</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Button className="bg-brand-dark text-white border-none h-11 font-black w-full text-xs uppercase tracking-widest" onClick={handleSignOut}>Yes, Log Out</Button>
              <Button variant="ghost" className="border-none text-muted h-10 font-bold w-full text-xs" onClick={() => setShowSignOutConfirm(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );

  if (showSecurityView) {
    return (
      <PageTransition className="flex-1 flex flex-col gap-5 p-5 pb-24 overflow-x-hidden">
        <header className="flex items-center gap-3 py-2">
          <button onClick={() => setShowSecurityView(false)} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform border border-[#F5EDE8]"><ArrowLeft size={18} className="text-brand-dark" /></button>
          <div><h1 className="text-lg font-black text-brand-dark leading-tight">Security</h1><p className="text-[9px] font-bold text-muted uppercase tracking-widest">Account Settings</p></div>
        </header>
        <section className="flex flex-col gap-3 animate-in slide-in-from-right-4 duration-300">
           <Card className="p-0 border-none shadow-sm overflow-hidden rounded-[20px]">
            <div className="flex flex-col">
              <button onClick={() => toast.error("Coming soon!")} className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 text-left w-full group">
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"><Key size={18} className="text-brand-orange" /></div><div className="flex flex-col"><span className="text-[14px] font-bold text-brand-dark">Change Password</span><span className="text-[9px] font-bold text-muted uppercase">Login protection</span></div></div>
                <ChevronRight size={16} className="text-brand-dark/20" />
              </button>
              <div className="h-[1px] bg-slate-50 mx-4" />
              <button onClick={() => toast.error("Coming soon!")} className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 text-left w-full group">
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Database size={18} className="text-blue-500" /></div><div className="flex flex-col"><span className="text-[14px] font-bold text-brand-dark">Privacy Mode</span><span className="text-[9px] font-bold text-muted uppercase">Manage your data</span></div></div>
                <ChevronRight size={16} className="text-brand-dark/20" />
              </button>
            </div>
          </Card>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="flex-1 flex flex-col gap-6 p-5 pb-24 overflow-x-hidden">
      {/* COMPACT HEADER */}
      <section className="flex flex-col items-center text-center pt-2">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-card border-[3px] border-white ring-4 ring-brand-orange/5 overflow-hidden">
            <UserAvatar id={avatarId} className="w-full h-full" />
          </div>
          <button onClick={() => setShowEditModal(true)} className="absolute -bottom-0.5 -right-0.5 bg-brand-orange text-white p-1 rounded-full border-[2px] border-white shadow-sm active:scale-90 transition-transform">
            <Pencil size={12} strokeWidth={3} />
          </button>
        </div>
        
        <div className="mt-3 w-full">
          <h1 className="text-xl font-black text-brand-dark tracking-tight">{firstName}</h1>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className="inline-flex items-center gap-1 bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-lg border border-brand-purple/5">
              <Trophy size={10} className="fill-brand-purple/20" />
              <span className="text-[9px] font-black uppercase tracking-wider">{rank}</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-lg border border-brand-orange/5">
              <Flame size={10} className="fill-brand-orange/20" />
              <span className="text-[9px] font-black uppercase tracking-wider">{currentStreak} Day Streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMPACT STATS GRID */}
      <section className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border border-[#F5EDE8] shadow-sm flex flex-col items-center justify-center gap-1 rounded-[20px] active:scale-95 transition-transform bg-white">
            <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center mb-0.5">
              <Star size={18} className="text-yellow-500 fill-yellow-200" />
            </div>
            <div className="text-2xl font-black text-brand-dark leading-none">{totalXP}</div>
            <div className="text-[8px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">Total XP</div>
          </Card>
          <Card className="p-4 border border-[#F5EDE8] shadow-sm flex flex-col items-center justify-center gap-1 rounded-[20px] active:scale-95 transition-transform bg-white">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mb-0.5">
              <Flame size={18} className="text-brand-orange fill-brand-orange/20" />
            </div>
            <div className="text-2xl font-black text-brand-dark leading-none">{currentStreak}</div>
            <div className="text-[8px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">Day Streak</div>
          </Card>
        </div>
        <Card className="p-4 border-none shadow-sm bg-gradient-to-br from-brand-purple to-purple-800 text-white overflow-hidden relative rounded-[20px]">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-3">
              <div><h3 className="font-bold text-white/70 text-[9px] uppercase tracking-widest mb-0.5">Rank Level</h3><div className="text-lg font-black">{rank}</div></div>
            </div>
            <ProgressBar progress={60} color="bg-white" height="h-2" />
            <p className="text-[9px] font-bold text-center mt-2 text-white/50 uppercase tracking-widest">Keep learning to unlock cities!</p>
          </div>
        </Card>
      </section>

      {/* SLEEK SETTINGS LIST */}
      <section className="flex flex-col gap-3 mt-1">
        <div className="px-1"><h3 className="text-[9px] font-black text-brand-dark/20 uppercase tracking-[0.25em]">Account & Settings</h3></div>
        <div className="flex flex-col gap-2">
          <Link href="/progress"><Card className="p-3.5 flex items-center justify-between border border-[#F5EDE8] shadow-sm rounded-xl active:scale-[0.98] transition-all bg-white group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center"><BarChart2 size={16} className="text-brand-orange" /></div><span className="text-[13px] font-bold text-brand-dark">Progress & Activity</span></div><ChevronRight size={14} className="text-brand-dark/10 group-hover:text-brand-orange transition-colors" /></Card></Link>
          <Card onClick={toggleReminders} className="p-3.5 flex items-center justify-between border border-[#F5EDE8] shadow-sm rounded-xl active:scale-[0.98] transition-all bg-white group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Bell size={16} className={remindersEnabled ? "text-brand-purple" : "text-brand-dark/20"} /></div><span className="text-[13px] font-bold text-brand-dark">Daily Reminders</span></div><span className={cn("text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider", remindersEnabled ? 'text-brand-purple bg-brand-purple/10' : 'text-brand-dark/30 bg-gray-50')}>{remindersEnabled ? '8:30 PM' : 'Off'}</span></Card>
          <Card onClick={toggleDarkMode} className="p-3.5 flex items-center justify-between border border-[#F5EDE8] shadow-sm rounded-xl active:scale-[0.98] transition-all bg-white group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Moon size={16} className={darkMode ? "text-brand-purple" : "text-brand-dark/20"} /></div><span className="text-[13px] font-bold text-brand-dark">Dark Mode</span></div><div className={cn("w-8 h-4 rounded-full relative transition-colors", darkMode ? 'bg-brand-purple' : 'bg-gray-100')}><div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all", darkMode ? 'left-4.5' : 'left-0.5')}></div></div></Card>
          <Card onClick={() => setShowSecurityView(true)} className="p-3.5 flex items-center justify-between border border-[#F5EDE8] shadow-sm rounded-xl active:scale-[0.98] transition-all bg-white group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><Shield size={16} className="text-slate-400 group-hover:text-brand-purple transition-colors" /></div><span className="text-[13px] font-bold text-brand-dark">Privacy & Security</span></div><ChevronRight size={14} className="text-brand-dark/10" /></Card>
        </div>
      </section>

      {/* COMPACT LOGOUT */}
      <button onClick={() => setShowSignOutConfirm(true)} className="mt-4 flex items-center justify-center gap-2 py-3.5 border-2 border-slate-100/50 rounded-xl text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all bg-white shadow-sm hover:bg-slate-50">
        <LogOut size={14} strokeWidth={3} /> Sign Out
      </button>

      {renderModals()}
    </PageTransition>
  );
}
