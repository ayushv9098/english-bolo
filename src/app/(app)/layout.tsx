import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "react-hot-toast";
import { GamificationProvider } from "@/context/GamificationContext";
import { XPPopup } from "@/components/gamification/XPPopup";
import { LootBoxModal } from "@/components/gamification/LootBoxModal";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GamificationProvider>
      <div className="min-h-screen bg-surface selection:bg-brand-orange/20 overflow-x-hidden">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1A1A2E',
              color: '#fff',
              borderRadius: '50px',
              fontFamily: 'var(--font-baloo2), sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <XPPopup />
        <LootBoxModal />
        <main className="max-w-md mx-auto min-h-screen flex flex-col pb-24 md:border-x md:border-[#F5EDE8] md:shadow-sm bg-surface relative">
          {children}
        </main>
        <BottomNav />
      </div>
    </GamificationProvider>
  );
}
