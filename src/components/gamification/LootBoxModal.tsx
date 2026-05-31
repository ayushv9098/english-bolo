"use client";

import { useState } from "react";
import { useGamification } from "@/context/GamificationContext";
import { Gift, X, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import confetti from "canvas-confetti";

export function LootBoxModal() {
  const { unopenedLootBoxes, openLootBox } = useGamification();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(unopenedLootBoxes > 0);
  const [reward, setReward] = useState<{ type: string; name: string; amount?: number } | null>(null);

  // Sync modal visibility with available boxes
  if (unopenedLootBoxes > 0 && !showModal && !isOpen) {
    setShowModal(true);
  }

  if (!showModal) return null;

  const handleOpen = async () => {
    // Generate random reward
    const rewards = [
      { type: 'xp', name: 'Bonus XP', amount: 200 },
      { type: 'avatar', name: 'Cool Glasses Avatar' },
      { type: 'booster', name: 'Double XP Booster' },
      { type: 'shield', name: 'Streak Shield' }
    ];
    const rolledReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    setIsOpen(true);
    
    // Confetti effect
    setTimeout(() => {
      setReward(rolledReward);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      openLootBox();
    }, 1000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setReward(null);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative flex flex-col items-center shadow-2xl animate-in zoom-in duration-300">
        {!isOpen && (
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        )}
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-brand-dark">Reward Chest!</h2>
          <p className="text-gray-500">You earned this by learning hard.</p>
        </div>

        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-yellow-100 rounded-full animate-pulse" />
          <Gift 
            size={isOpen ? 80 : 100} 
            className={`text-yellow-500 relative z-10 transition-all duration-500 ${isOpen ? 'opacity-0 scale-50' : 'animate-bounce cursor-pointer hover:scale-110'}`} 
            onClick={!isOpen ? handleOpen : undefined}
          />
          {isOpen && (
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-500 z-20">
              <Sparkles size={80} className="text-brand-orange animate-spin-slow" />
            </div>
          )}
        </div>

        {!isOpen ? (
          <Button onClick={handleOpen} className="w-full font-bold h-14 bg-yellow-500 hover:bg-yellow-600 text-white border-none">
            Tap to Open
          </Button>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">You Found</p>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
              <p className="text-2xl font-black text-brand-orange">
                {reward?.amount ? `+${reward.amount} ` : ''}{reward?.name}
              </p>
            </div>
            <Button onClick={handleClose} className="w-full font-bold h-14">
              Awesome!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
