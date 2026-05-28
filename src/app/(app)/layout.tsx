import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "react-hot-toast";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface selection:bg-brand-orange/20 overflow-x-hidden">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#fff',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: '600'
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#fff' }
          }
        }} 
      />
      <main className="max-w-md mx-auto min-h-screen flex flex-col pb-24 md:border-x md:border-[#F5EDE8] md:shadow-sm bg-surface relative">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
