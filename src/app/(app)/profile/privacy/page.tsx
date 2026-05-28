"use client";

import { ArrowLeft, Shield, Lock, FileText, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function PrivacyPage() {
  const router = useRouter();

  const handleAction = () => {
    toast.success("Action completed successfully");
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-brand-orange/20 animate-in fade-in duration-500 pb-24">
      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-surface px-4 pt-6 pb-2">
        <div className="max-w-md mx-auto flex items-center mb-4">
          <button 
            aria-label="Go back"
            onClick={() => router.back()}
            className="p-2 hover:bg-black/5 rounded-full transition-colors mr-2"
          >
            <ArrowLeft className="w-6 h-6 text-brand-dark" />
          </button>
          <h2 className="text-lg font-bold text-brand-dark">Privacy & Security</h2>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col gap-4">
        <Card className="p-1 border-none shadow-sm overflow-hidden flex flex-col divide-y divide-gray-100">
          <button onClick={handleAction} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-left active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark text-sm">Change Password</h3>
                <p className="text-muted text-[11px] mt-0.5">Update your account password</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" strokeWidth={1.5} />
          </button>

          <button onClick={handleAction} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-left active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted">
                <Shield size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark text-sm">Two-Factor Authentication</h3>
                <p className="text-muted text-[11px] mt-0.5">Add an extra layer of security</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" strokeWidth={1.5} />
          </button>

          <button onClick={handleAction} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-left active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted">
                <FileText size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark text-sm">Data & Privacy</h3>
                <p className="text-muted text-[11px] mt-0.5">Manage how your data is used</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" strokeWidth={1.5} />
          </button>
        </Card>

        <button 
          onClick={() => toast("Account deletion request initiated. Check your email.", { icon: '⚠️' })}
          className="mt-4 text-red-500 font-bold text-sm text-center py-4 rounded-xl hover:bg-red-50 transition-colors"
        >
          Delete Account
        </button>
      </main>
    </div>
  );
}