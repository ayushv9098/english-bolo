"use client";

import { ArrowLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function NotificationsPage() {
  const router = useRouter();

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
          <h2 className="text-lg font-bold text-brand-dark">Notifications</h2>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col gap-4">
        <Card className="p-5 border-none shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mt-1">
            <Bell size={18} className="text-brand-orange" />
          </div>
          <div>
            <h3 className="font-bold text-brand-dark text-sm">Welcome to AngreziBolo!</h3>
            <p className="text-muted text-xs mt-1 leading-relaxed">
              We are so excited to help you master English. Start your first daily lesson today to begin your streak!
            </p>
            <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mt-3 block">Just now</span>
          </div>
        </Card>

        <Button 
          variant="soft" 
          className="mt-6 py-4 rounded-pill font-bold"
          onClick={() => router.push("/home")}
        >
          Go Back to Dashboard
        </Button>
      </main>
    </div>
  );
}