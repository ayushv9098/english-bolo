"use client";

import React, { useState } from "react";
import { ArrowLeft, Headphones, Volume2, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const PRACTICE_PHRASES = [
  { en: "Could you please help me?", hi: "Kya aap meri madad kar sakte hain?" },
  { en: "I would like to order coffee.", hi: "Main coffee order karna chahunga." },
  { en: "Where is the nearest hospital?", hi: "Sabse paas hospital kahan hai?" }
];

export default function ListenPracticePage() {
  const router = useRouter();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const currentPhrase = PRACTICE_PHRASES[phraseIdx];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    setPhraseIdx((prev) => (prev + 1) % PRACTICE_PHRASES.length);
    setRevealed(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-brand-orange/20 animate-in fade-in duration-500 pb-24">
      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-surface px-4 pt-6 pb-2">
        <div className="max-w-md mx-auto flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              aria-label="Go back"
              onClick={() => router.back()}
              className="p-2 hover:bg-black/5 rounded-full transition-colors mr-2"
            >
              <ArrowLeft className="w-6 h-6 text-brand-dark" />
            </button>
            <h2 className="text-lg font-bold text-brand-dark">Quick Listen</h2>
          </div>
          <span className="text-[10px] font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-pill uppercase tracking-widest">
            Free Practice
          </span>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-xl font-bold text-center text-brand-dark">Tap to listen</h3>
          <p className="text-sm text-muted text-center max-w-[250px]">
            Try to understand the English sentence without looking at the translation.
          </p>
        </div>
        
        <Card className="p-8 flex flex-col items-center text-center gap-8 border-none shadow-sm">
          <button 
            onClick={() => speakText(currentPhrase.en)}
            className="w-24 h-24 rounded-full bg-brand-purple text-white flex items-center justify-center hover:bg-brand-purple/90 transition-all shadow-float active:scale-90"
          >
            <Volume2 className="w-12 h-12 ml-1" />
          </button>

          {!revealed ? (
            <button 
              onClick={() => setRevealed(true)}
              className="flex items-center gap-2 text-brand-purple font-bold text-sm bg-purple-50 px-4 py-2 rounded-pill hover:bg-purple-100 transition-colors"
            >
              <Eye size={16} /> Reveal Translation
            </button>
          ) : (
            <div className="animate-in slide-in-from-bottom-2 flex flex-col gap-3 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-lg font-bold text-brand-dark leading-tight">
                "{currentPhrase.en}"
              </p>
              <p className="hindi italic text-sm text-muted">
                {currentPhrase.hi}
              </p>
            </div>
          )}
        </Card>

        {revealed && (
          <Button 
            className="mt-6 py-4 rounded-pill bg-brand-dark text-white animate-in slide-in-from-bottom-4" 
            onClick={handleNext}
          >
            Next Phrase <ChevronRight size={18} className="ml-1" />
          </Button>
        )}
      </main>
    </div>
  );
}