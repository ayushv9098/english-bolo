"use client";

import { ArrowLeft, Globe, Volume2, HardDrive, HelpCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function SystemPage() {
  const router = useRouter();

  const handleAction = (message: string) => {
    toast.success(message);
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
          <h2 className="text-lg font-bold text-brand-dark">System Preferences</h2>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col gap-6">
        <Card className="p-1 border-none shadow-sm overflow-hidden flex flex-col divide-y divide-gray-100">
          <button onClick={() => handleAction("App language set to English")} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-left active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted">
                <Globe size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark text-sm">App Language</h3>
                <p className="text-muted text-[11px] mt-0.5">Currently: English</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" strokeWidth={1.5} />
          </button>

          <button onClick={() => handleAction("Audio downloaded over WiFi only")} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-left active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted">
                <Volume2 size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark text-sm">Audio Settings</h3>
                <p className="text-muted text-[11px] mt-0.5">Manage playback options</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" strokeWidth={1.5} />
          </button>
          
          <button onClick={() => handleAction("Cache cleared successfully! 12MB freed.")} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-left active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted">
                <HardDrive size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark text-sm">Clear Cache</h3>
                <p className="text-muted text-[11px] mt-0.5">Free up storage space</p>
              </div>
            </div>
            <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2 py-1 rounded-md">Clear</span>
          </button>
        </Card>

        <Card className="p-1 border-none shadow-sm overflow-hidden flex flex-col divide-y divide-gray-100 mt-2">
          <button onClick={() => toast('Directing to support...', { icon: '👋' })} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-left active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted">
                <HelpCircle size={18} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-brand-dark text-sm">Help & Support</h3>
            </div>
            <ChevronRight size={18} className="text-muted" strokeWidth={1.5} />
          </button>
        </Card>
      </main>
    </div>
  );
}