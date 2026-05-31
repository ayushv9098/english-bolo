"use client";

import { useGamification } from "@/context/GamificationContext";

export function XPPopup() {
  const { xpPopups } = useGamification();

  if (xpPopups.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col items-center justify-center">
      {xpPopups.map((popup) => (
        <div
          key={popup.id}
          className="absolute top-1/4 animate-[float-up_3s_ease-out_forwards] flex flex-col items-center drop-shadow-lg"
        >
          <div className="text-4xl font-black text-yellow-400 [text-shadow:_0_2px_10px_rgba(250,204,21,0.5)]">
            +{popup.amount} XP
          </div>
          {popup.message && (
            <div className="text-sm font-bold text-white bg-black/50 px-3 py-1 rounded-full mt-2">
              {popup.message}
            </div>
          )}
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(50px) scale(0.5); }
          10% { opacity: 1; transform: translateY(0px) scale(1.2); }
          20% { transform: translateY(-10px) scale(1); }
          80% { opacity: 1; transform: translateY(-60px) scale(1); }
          100% { opacity: 0; transform: translateY(-100px) scale(0.8); }
        }
      `}} />
    </div>
  );
}
