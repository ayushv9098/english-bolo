"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Calendar, Gift, Check, Flame, Trophy } from "lucide-react";
import { MicButton } from "@/components/games/MicButton";
import { useSpeech } from "@/hooks/useSpeech";
import { useGamification } from "@/context/GamificationContext";

const DAILY_TASK = {
  title: "Describe your best friend",
  hint: "Talk about their name, how long you've known them, and why you like them.",
  minWords: 10,
  xp: 100
};

export default function DailyChallengeGame() {
  const router = useRouter();
  const { isRecording, transcript, startRecording, stopRecording, setTranscript } = useSpeech();
  const { awardXP } = useGamification();
  
  const [view, setView] = useState<'intro' | 'recording' | 'validating' | 'reward'>('intro');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setWordCount(transcript.split(' ').filter(w => w.length > 0).length);
  }, [transcript]);

  const handleSubmit = () => {
    stopRecording();
    setView('validating');
    // Mock AI validation delay
    setTimeout(() => {
      awardXP(DAILY_TASK.xp, "Daily Challenge Completed!");
      setView('reward');
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FFF0EB] text-brand-black flex flex-col max-w-md mx-auto">
        <header className="p-4 flex items-center justify-between sticky top-0 bg-[#FFF0EB]/80 backdrop-blur-md z-10">
          <button onClick={() => router.push('/games')} className="p-2 -ml-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-2 items-center bg-white px-3 py-1 rounded-full shadow-sm">
             <Flame size={16} className="text-brand-orange" />
             <span className="font-bold text-sm">3 Day Streak</span>
          </div>
        </header>

        {view === 'intro' && (
          <div className="flex-1 flex flex-col p-6 items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="bg-brand-orange text-white text-sm font-bold uppercase tracking-widest text-center py-2 rounded-t-2xl">
                Daily Mission
              </div>
              <Card className="p-8 text-center rounded-t-none border-t-0 shadow-lg">
                <Calendar size={50} className="text-brand-orange mx-auto mb-6" />
                <h2 className="text-2xl font-black mb-2 leading-tight">{DAILY_TASK.title}</h2>
                <p className="text-gray-500 mb-8">{DAILY_TASK.hint}</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8">
                  <p className="font-bold text-gray-700 text-sm mb-1">Reward</p>
                  <div className="flex items-center justify-center gap-2 text-2xl font-black text-brand-orange">
                    <Trophy size={24} /> +{DAILY_TASK.xp} XP
                  </div>
                </div>

                <Button onClick={() => setView('recording')} className="w-full h-14 text-lg bg-brand-orange hover:bg-orange-600">
                  Accept Challenge
                </Button>
              </Card>
            </div>
          </div>
        )}

        {view === 'recording' && (
          <div className="flex-1 flex flex-col p-6">
             <div className="mb-6 text-center">
               <h2 className="text-xl font-bold mb-2">{DAILY_TASK.title}</h2>
               <p className="text-sm text-gray-500">{DAILY_TASK.hint}</p>
             </div>

             <Card className="flex-1 p-6 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
               {isRecording && (
                 <div className="absolute inset-0 bg-brand-orange/5 animate-pulse" />
               )}
               
               <div className="w-full h-full flex items-center justify-center text-center">
                 {transcript ? (
                   <p className="text-xl text-gray-800 leading-relaxed font-medium z-10">
                     "{transcript}"
                   </p>
                 ) : (
                   <p className="text-gray-400 z-10">Tap the mic and start speaking...</p>
                 )}
               </div>

               <div className="absolute bottom-4 right-4 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                 {wordCount} / {DAILY_TASK.minWords} words
               </div>
             </Card>

             <div className="flex flex-col items-center gap-4">
                <MicButton 
                  isRecording={isRecording} 
                  onToggle={() => {
                    if (isRecording) stopRecording();
                    else startRecording();
                  }} 
                />
                <Button 
                  disabled={wordCount < DAILY_TASK.minWords} 
                  onClick={handleSubmit}
                  className="w-full h-14"
                >
                  Submit Recording
                </Button>
             </div>
          </div>
        )}

        {view === 'validating' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-bold mb-2">Analyzing Speech...</h2>
            <p className="text-gray-500">Checking vocabulary and grammar</p>
          </div>
        )}

        {view === 'reward' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Card className="p-8 w-full max-w-sm border-none shadow-2xl relative overflow-hidden bg-white">
              {/* Confetti effect background */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Gift size={50} className="text-yellow-500 animate-bounce" />
                </div>
                
                <h2 className="text-3xl font-black mb-2">Awesome!</h2>
                <p className="text-gray-500 mb-8 text-sm">Challenge completed successfully.</p>
                
                <div className="bg-orange-50 rounded-2xl p-6 w-full mb-8 border border-orange-100">
                  <div className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-1">Earned</div>
                  <div className="text-5xl font-black text-brand-orange">
                    +{DAILY_TASK.xp}
                  </div>
                  <div className="text-orange-500 font-medium mt-1">XP</div>
                </div>

                <div className="flex items-center justify-center gap-2 text-green-500 font-bold mb-8">
                  <Check size={20} /> Come back tomorrow!
                </div>

                <Button onClick={() => router.push('/games')} className="w-full h-14 text-lg">
                  Back to Arcade
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
