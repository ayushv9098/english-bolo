import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface selection:bg-brand-orange/20 overflow-x-hidden">
      <main className="max-w-md mx-auto min-h-screen flex flex-col pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
