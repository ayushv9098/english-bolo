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
  Lock,
  Store,
  Key,
  Database,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Pencil
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import PageTransition from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGamification } from "@/context/GamificationContext";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import { cn } from "@/lib/utils";

// Avatar Sprite Sheet Mapping (8 columns, 4 rows)
const AVATAR_MAP: Record<string, { x: number, y: number }> = {
  "G01": { x: 0, y: 0 }, "G02": { x: 1, y: 0 }, "G03": { x: 2, y: 0 }, "G04": { x: 3, y: 0 }, "G05": { x: 4, y: 0 }, "G06": { x: 5, y: 0 }, "G07": { x: 6, y: 0 }, "G10": { x: 7, y: 0 },
  "G11": { x: 0, y: 1 }, "G12": { x: 1, y: 1 }, "G13": { x: 2, y: 1 }, "G14": { x: 3, y: 1 }, "G17": { x: 4, y: 1 }, "G18": { x: 5, y: 1 }, "G19": { x: 6, y: 1 }, "G20": { x: 7, y: 1 },
  "B01": { x: 0, y: 2 }, "B02": { x: 1, y: 2 }, "B03": { x: 2, y: 2 }, "B04": { x: 3, y: 2 }, "B05": { x: 4, y: 2 }, "B06": { x: 5, y: 2 }, "B17": { x: 6, y: 2 }, "B18": { x: 7, y: 2 },
  "B11": { x: 0, y: 3 }, "B12": { x: 1, y: 3 }, "B13": { x: 2, y: 3 }, "B14": { x: 3, y: 3 }, "B15": { x: 4, y: 3 }, "B16": { x: 5, y: 3 }, "B19": { x: 6, y: 3 }, "B20": { x: 7, y: 3 },
};

const AVATAR_OPTIONS = Object.keys(AVATAR_MAP);

function UserAvatar({ id, className = "" }: { id: string, className?: string }) {
  const pos = AVATAR_MAP[id];
  
  if (!pos) {
    // Fallback to emoji if it's not a sprite ID
    return <span className={cn("flex items-center justify-center", className)}>{id || "😎"}</span>;
  }

  // The sprite sheet has 8 columns and 4 rows. 
  // We add a small offset to skip the labels and header area.
  return (
    <div className={cn("overflow-hidden bg-gray-50 flex items-center justify-center", className)}>
      <div 
        style={{
          backgroundImage: `url('/avatars/bundle.png')`,
          backgroundSize: '800% 500%', // 8 columns, ~5 rows worth of height to account for header
          backgroundPosition: `${(pos.x * 100) / 7}% ${(pos.y * 100) / 3.4 + 16}%`, // Calibrated for the bundle layout
          width: '100%',
          height: '100%',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
}

const UNLOCK_ROADMAP = [
  { xp: 500, title: "AI Hint Tokens ×5", desc: "Get 5 free hints for tough missions.", icon: "💡" },
  { xp: 1000, title: "Real-Life Mission Pack", desc: "Unlock new daily scenarios.", icon: "🗺️" },
  { xp: 2000, title: "Grammar Coach Unlock", desc: "Real-time grammar corrections.", icon: "📚" },
  { xp: 3000, title: "Travel & Restaurant Scenarios", desc: "Speak confidently abroad.", icon: "✈️" },
  { xp: 5000, title: "Advanced Speaking Analysis", desc: "Detailed fluency reports.", icon: "📊" },
  { xp: 7500, title: "Pronunciation Coach", desc: "AI accent training.", icon: "🗣️" },
  { xp: 10000, title: "Job Interview Simulator", desc: "Nail your next interview.", icon: "💼" },
  { xp: 15000, title: "Advanced AI Partner", desc: "Complex debate scenarios.", icon: "🤖" },
  { xp: 25000, title: "Business English Missions", desc: "Corporate communication.", icon: "🏢" },
  { xp: 50000, title: "English Master Certificate", desc: "Official completion badge.", icon: "🎓" },
];

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
  
  // Modals
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  // Edit Profile States
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Collapsible States
  const [badgesExpanded, setBadgesExpanded] = useState(false);
  const [storeExpanded, setStoreExpanded] = useState(false);

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

      const { error } = await supabase
        .from("users")
        .update({ name: editName, avatar_emoji: editAvatar })
        .eq("id", user.id);

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    toast.loading("Deleting...");
    setTimeout(async () => {
      await supabase.auth.signOut();
      toast.dismiss();
      toast.success("Account deleted.");
      router.push("/signup");
    }, 2000);
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Skeleton className="w-24 h-24 rounded-full mb-4" />
        <Skeleton className="w-32 h-6" />
      </div>
    );
  }

  const firstName = profile.name ? profile.name.split(" ")[0] : "Learner";
  const avatarId = profile.avatar_emoji || "G01";

  // Modals Rendering Helper
  const renderModals = () => (
    <>
      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <Card className="w-full max-w-xs p-6 space-y-6 border-none shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-brand-dark">Edit Profile</h3>
              <p className="text-xs text-muted">Aapka nam aur avatar badlein</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-brand-dark/40 tracking-wider">Aapka Nam</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-brand-orange/20 outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-brand-dark/40 tracking-wider">Avatar Choose Karein</label>
                <div className="grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl max-h-[300px] overflow-y-auto no-scrollbar border border-gray-100">
                  {AVATAR_OPTIONS.map((id) => (
                    <button
                      key={id}
                      onClick={() => setEditAvatar(id)}
                      className={cn(
                        "w-14 h-14 flex items-center justify-center rounded-xl transition-all active:scale-90 overflow-hidden relative",
                        editAvatar === id ? "bg-white shadow-sm ring-2 ring-brand-orange ring-offset-1" : "hover:bg-white/50"
                      )}
                    >
                      <UserAvatar id={id} className="w-full h-full" />
                      {editAvatar === id && (
                        <div className="absolute inset-0 bg-brand-orange/10 flex items-center justify-center">
                           <div className="bg-brand-orange text-white rounded-full p-0.5">
                             <Check size={10} strokeWidth={4} />
                           </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  onClick={handleSaveProfile} 
                  isLoading={isSavingProfile}
                  className="w-full bg-brand-orange text-white border-none h-12 font-black rounded-xl"
                >
                  SAVE CHANGES
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-10 border-none text-muted font-bold"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditName(profile.name);
                    setEditAvatar(profile.avatar_emoji);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <Card className="w-full max-w-xs p-6 space-y-6 border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-2"><Key size={24} /></div>
              <h3 className="text-lg font-black text-brand-dark">Change Password</h3>
            </div>
            <div className="space-y-4">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-brand-orange/20 outline-none" placeholder="New Password" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-brand-orange/20 outline-none" placeholder="Confirm Password" />
              <Button onClick={handleUpdatePassword} isLoading={isUpdatingPassword} className="w-full bg-brand-orange text-white border-none h-12 font-black rounded-xl shadow-lg shadow-orange-100">UPDATE</Button>
              <Button variant="ghost" className="w-full border-none text-muted font-bold" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <Card className="w-full max-w-xs p-6 space-y-6 border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2"><Database size={24} /></div>
              <h3 className="text-lg font-black text-brand-dark">Data & Privacy</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <h4 className="text-[13px] font-black text-brand-dark">Data Export</h4>
                <Button variant="ghost" className="h-8 px-4 text-[10px] font-black uppercase border-gray-200" onClick={() => toast.success("Export started...")}>Export JSON</Button>
              </div>
              <Button className="w-full bg-brand-dark text-white border-none h-12 font-black rounded-xl" onClick={() => setShowPrivacyModal(false)}>DONE</Button>
            </div>
          </Card>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-red-950/20 backdrop-blur-[4px] animate-in fade-in duration-300">
          <Card className="w-full max-w-xs p-6 space-y-6 border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-black text-brand-dark">Are you sure?</h3>
              <p className="text-sm text-muted">Type <span className="text-red-500 font-bold uppercase">DELETE</span> to confirm.</p>
            </div>
            <div className="space-y-4">
              <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())} placeholder="Type here..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center font-bold focus:ring-2 focus:ring-red-500/20 outline-none" />
              <div className="flex flex-col gap-2">
                <Button disabled={deleteConfirmText !== "DELETE"} className={cn("h-12 font-black border-none text-white", deleteConfirmText === "DELETE" ? "bg-red-500 shadow-lg shadow-red-200" : "bg-gray-200 text-gray-400")} onClick={handleDeleteAccount}>DELETE MY ACCOUNT</Button>
                <Button variant="ghost" className="border-none text-muted h-10 font-bold" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <Card className="w-full max-w-xs p-6 space-y-6 border-none shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4"><LogOut size={24} /></div>
              <h3 className="text-lg font-bold text-brand-dark">Sign Out?</h3>
              <p className="text-sm text-muted px-2">Are you sure you want to sign out?</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="primary" className="bg-brand-dark text-white border-none h-12 font-bold w-full" onClick={handleSignOut}>Yes, Sign Out</Button>
              <Button variant="ghost" className="border-none text-muted h-12 font-semibold w-full" onClick={() => setShowSignOutConfirm(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );

  // --- SECURITY SUB-VIEW RENDER ---
  if (showSecurityView) {
    return (
      <PageTransition className="flex-1 flex flex-col gap-6 p-6 pb-24 overflow-x-hidden">
        <header className="flex items-center gap-4 py-4">
          <button 
            onClick={() => setShowSecurityView(false)}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} className="text-brand-dark" />
          </button>
          <div>
            <h1 className="text-xl font-black text-brand-dark">Privacy & Security</h1>
            <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">Account Protection</p>
          </div>
        </header>

        <section className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
           <Card className="p-0 border-none shadow-card overflow-hidden">
            <div className="flex flex-col">
              <button onClick={() => setShowPasswordModal(true)} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all active:bg-slate-100/50 text-left w-full group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center group-active:scale-90 transition-transform"><Key size={20} className="text-brand-orange" /></div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-brand-dark">Change Password</span>
                    <span className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-tight">Update login security</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-brand-dark/20" />
              </button>
              <div className="h-[1px] bg-slate-50 mx-4" />
              <button onClick={() => setShowPrivacyModal(true)} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all active:bg-slate-100/50 text-left w-full group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center group-active:scale-90 transition-transform"><Database size={20} className="text-blue-500" /></div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-brand-dark">Data & Privacy</span>
                    <span className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-tight">Export & Manage data</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-brand-dark/20" />
              </button>
              <div className="h-[1px] bg-slate-50 mx-4" />
              <button onClick={() => setShowDeleteConfirm(true)} className="p-5 flex items-center justify-between hover:bg-red-50/30 transition-all active:bg-red-50/50 text-left w-full group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center group-active:scale-90 transition-transform"><Trash2 size={20} className="text-red-500" /></div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-red-500">Delete Account</span>
                    <span className="text-[10px] font-bold text-red-400/50 uppercase tracking-tight">Remove all data</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-red-500/20" />
              </button>
            </div>
          </Card>
        </section>

        {renderModals()}
      </PageTransition>
    );
  }

  return (
    <PageTransition className="flex-1 flex flex-col gap-8 p-6 pb-24 overflow-x-hidden">
      {/* HEADER */}
      <section className="flex flex-col items-center text-center pt-4">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-card border-[3px] border-white ring-4 ring-brand-orange/10 overflow-hidden relative">
            <UserAvatar id={avatarId} className="w-full h-full" />
            {/* Overlay edit button on avatar */}
            <button 
              onClick={() => setShowEditModal(true)}
              className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil size={20} className="text-white drop-shadow-md" />
            </button>
          </div>
          <button 
            onClick={() => setShowEditModal(true)}
            className="absolute -bottom-1 -right-1 bg-brand-orange text-white p-1.5 rounded-full border-[3px] border-white shadow-sm active:scale-90 transition-transform"
          >
            <Pencil size={14} strokeWidth={3} />
          </button>
        </div>
        
        <div className="mt-4 w-full">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-brand-dark tracking-tight">{firstName}</h1>
            <button 
              onClick={() => setShowEditModal(true)}
              className="p-1 hover:bg-gray-100 rounded-full text-brand-dark/20 hover:text-brand-orange transition-colors"
            >
              <Pencil size={16} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <div className="inline-flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple px-2.5 py-0.5 rounded-full">
              <Trophy size={12} className="fill-brand-purple/20" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{rank}</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-brand-orange/10 text-brand-orange px-2.5 py-0.5 rounded-full">
              <Flame size={12} className="fill-brand-orange/20" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{currentStreak} Day Streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* MY PROGRESS SECTION */}
      <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">My Progress</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 border-none shadow-card flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Star size={24} className="text-yellow-500 fill-yellow-200" />
            </div>
            <div className="text-3xl font-black text-brand-dark">{totalXP}</div>
            <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.15em]">Total XP</div>
          </Card>
          <Card className="p-5 border-none shadow-card flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Flame size={24} className="text-brand-orange fill-brand-orange/20" />
            </div>
            <div className="text-3xl font-black text-brand-dark">{currentStreak}</div>
            <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.15em]">Day Streak</div>
          </Card>
        </div>
        <Card className="p-6 border-none shadow-card bg-gradient-to-br from-brand-purple to-purple-800 text-white overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-brand-orange/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-bold text-white/80 text-xs uppercase tracking-wider mb-1">Current Rank</h3>
                <div className="text-2xl font-black">{rank}</div>
              </div>
            </div>
            <ProgressBar progress={60} color="bg-white" height="h-3" showLabel />
            <p className="text-[10px] font-bold text-center mt-3 text-white/60 uppercase tracking-widest">Keep learning to rank up!</p>
          </div>
        </Card>
      </section>

      {/* BADGES & ITEMS SECTION - COLLAPSIBLE */}
      <section className="flex flex-col gap-3">
        <button onClick={() => setBadgesExpanded(!badgesExpanded)} className="w-full text-left focus:outline-none active:scale-[0.99] transition-transform">
          <Card className={cn("p-4 border-none shadow-sm flex items-center justify-between transition-all", badgesExpanded ? "bg-white" : "bg-white/50")}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center"><Medal size={20} className="text-yellow-600" /></div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-brand-dark">Badges & Items</span>
                <span className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-wider">{badgesExpanded ? "Tap to hide" : unopenedLootBoxes > 0 ? `${unopenedLootBoxes} Chests available` : "View achievements"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unopenedLootBoxes > 0 && !badgesExpanded && <span className="bg-red-500 w-2 h-2 rounded-full animate-pulse" />}
              <ChevronRight size={18} className={cn("text-brand-dark/20 transition-transform duration-300", badgesExpanded && "rotate-90")} />
            </div>
          </Card>
        </button>
        {badgesExpanded && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300 pt-2 px-1">
            {unopenedLootBoxes > 0 && (
              <Card className="p-5 border-2 border-yellow-200 bg-yellow-50 shadow-card flex items-center justify-between overflow-hidden relative">
                <div className="absolute -right-2 top-0 opacity-10"><Gift size={80} className="text-yellow-600" /></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Gift size={32} className="text-yellow-500 animate-bounce" /></div>
                  <div className="flex flex-col"><h3 className="font-black text-brand-dark text-sm">Reward Chest</h3><p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{unopenedLootBoxes} Available</p></div>
                </div>
                <Button onClick={() => openLootBox()} className="bg-yellow-500 hover:bg-yellow-600 text-white font-black h-9 px-5 rounded-xl border-none shadow-sm relative z-10 text-[11px] tracking-wider transition-all active:scale-95">OPEN</Button>
              </Card>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-none shadow-card flex flex-col items-center text-center gap-2 relative overflow-hidden group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><Shield className="text-blue-500" size={24} /></div>
                <h3 className="font-black text-xs text-brand-dark">Streak Shield</h3>
                <div className="absolute top-2 right-2 bg-brand-dark/5 text-[9px] font-black px-1.5 py-0.5 rounded-full text-brand-dark/40">x0</div>
              </Card>
              <Card className="p-4 border-none shadow-card flex flex-col items-center text-center gap-2 relative overflow-hidden group">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><Zap className="text-purple-500" size={24} /></div>
                <h3 className="font-black text-xs text-brand-dark">Double XP</h3>
                <div className="absolute top-2 right-2 bg-brand-dark/5 text-[9px] font-black px-1.5 py-0.5 rounded-full text-brand-dark/40">x0</div>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ACHIEVEMENTS.map(ach => (
                <Card key={ach.id} className={cn("p-4 border-none shadow-card flex flex-col items-center text-center gap-2 group active:scale-95 transition-transform", !ach.unlocked && "opacity-40 grayscale")}>
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-1 shadow-inner ring-4 ring-offset-2 transition-transform group-hover:rotate-12", ach.unlocked ? "bg-yellow-50 ring-yellow-100 ring-offset-white" : "bg-gray-100 ring-gray-50 ring-offset-white")}>{ach.icon}</div>
                  <h3 className="font-black text-sm leading-tight text-brand-dark">{ach.title}</h3>
                  <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-tight">{ach.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* REWARD STORE SECTION - COLLAPSIBLE */}
      <section className="flex flex-col gap-3">
        <button onClick={() => setStoreExpanded(!storeExpanded)} className="w-full text-left focus:outline-none active:scale-[0.99] transition-transform">
          <Card className={cn("p-4 border-none shadow-sm flex items-center justify-between transition-all", storeExpanded ? "bg-white" : "bg-white/50")}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center"><Store size={20} className="text-brand-orange" /></div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-brand-dark">Reward Store</span>
                <span className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-wider">{storeExpanded ? "Tap to hide" : "Unlock new features"}</span>
              </div>
            </div>
            <ChevronRight size={18} className={cn("text-brand-dark/20 transition-transform duration-300", storeExpanded && "rotate-90")} />
          </Card>
        </button>
        {storeExpanded && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300 pt-2 px-1">
            <Card className="p-5 border-none shadow-card flex items-center justify-between bg-brand-orange text-white relative overflow-hidden">
               <div className="absolute -right-4 -top-4 opacity-10"><Store size={100} /></div>
               <div className="relative z-10"><div className="font-bold text-xs uppercase tracking-widest text-white/80">Available Wallet</div><div className="flex items-center gap-1 font-black text-3xl tracking-tight mt-1">{totalXP} <span className="text-lg opacity-80">XP</span></div></div>
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 backdrop-blur-sm shadow-inner"><Store className="fill-white/20 text-white" size={24} /></div>
            </Card>
            <div className="grid grid-cols-2 gap-4 pb-4">
              {UNLOCK_ROADMAP.map((reward, index) => {
                const canAfford = totalXP >= reward.xp;
                return (
                  <Card key={index} className="p-4 border-none shadow-card flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-inner group-hover:scale-110 transition-transform">{reward.icon}</div>
                    <div className="flex-1 flex flex-col w-full justify-between">
                      <div><h3 className="font-black text-[13px] leading-tight text-brand-dark mb-1 h-10 flex items-center justify-center">{reward.title}</h3><p className="text-[10px] font-bold text-brand-dark/40 mb-4 h-10 overflow-hidden line-clamp-3">{reward.desc}</p></div>
                      <Button disabled={!canAfford} onClick={() => canAfford && toast.success(`${reward.title} Claimed!`, { icon: reward.icon })} className={cn("w-full h-10 text-[11px] font-black uppercase border-none transition-all active:scale-95 shadow-sm rounded-xl", canAfford ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-400")}>{canAfford ? "Claim" : `🔒 ${reward.xp} XP`}</Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ACCOUNT & SETTINGS SECTION - ALWAYS VISIBLE */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">Account & Settings</h3>
        </div>
        <div className="flex flex-col gap-2.5">
          <Link href="/progress"><Card className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-all cursor-pointer shadow-card active:scale-[0.98]"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center"><BarChart2 size={20} className="text-brand-orange" /></div><span className="text-[15px] font-bold text-brand-dark">My Progress & Activity</span></div><ChevronRight size={18} className="text-brand-dark/20" /></Card></Link>
          <Card onClick={toggleReminders} className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-all cursor-pointer shadow-card active:scale-[0.98]"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center"><Bell size={20} className={remindersEnabled ? "text-brand-purple" : "text-brand-dark/20"} /></div><span className="text-[15px] font-bold text-brand-dark">Daily Reminders</span></div><span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-colors uppercase tracking-wider ${remindersEnabled ? 'text-brand-purple bg-brand-purple/10' : 'text-brand-dark/30 bg-brand-dark/5'}`}>{remindersEnabled ? '8:30 PM' : 'Off'}</span></Card>
          <Card onClick={toggleDarkMode} className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-all cursor-pointer shadow-card active:scale-[0.98]"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-brand-dark/5 flex items-center justify-center"><Moon size={20} className={darkMode ? "text-brand-purple" : "text-brand-dark/30"} /></div><span className="text-[15px] font-bold text-brand-dark">Dark Mode</span></div><div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-brand-purple' : 'bg-brand-dark/10'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${darkMode ? 'left-5.5' : 'left-0.5'}`}></div></div></Card>
          
          <Card onClick={() => setShowSecurityView(true)} className="p-4 flex items-center justify-between border-none hover:bg-white/60 transition-all cursor-pointer shadow-card active:scale-[0.98] group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center"><Shield size={20} className="text-slate-400 group-hover:text-brand-purple transition-colors" /></div>
                <span className="text-[15px] font-bold text-brand-dark">Privacy & Security</span>
              </div>
              <ChevronRight size={18} className="text-brand-dark/20" />
          </Card>
        </div>
      </section>

      {/* SIGN OUT BUTTON */}
      <Button variant="ghost" className="mt-4 border-2 border-slate-100 text-slate-400 hover:bg-slate-50 gap-2 font-black py-4 rounded-2xl bg-white shadow-sm active:scale-95 w-full uppercase tracking-widest text-xs" onClick={() => setShowSignOutConfirm(true)}><LogOut size={16} strokeWidth={3} />Sign Out</Button>

      {/* MODALS RENDER */}
      {renderModals()}
    </PageTransition>
  );
}
