import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface selection:bg-brand-orange/20 overflow-x-hidden">
      <main className="max-w-md mx-auto min-h-screen flex flex-col pb-24 md:border-x md:border-[#F5EDE8] md:shadow-sm bg-surface relative">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
