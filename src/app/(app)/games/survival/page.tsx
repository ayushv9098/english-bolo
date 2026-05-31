"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Skull, Shield, BookOpen, AlertTriangle } from "lucide-react";
import { MicButton } from "@/components/games/MicButton";
import { HeartsDisplay } from "@/components/games/HeartsDisplay";
import { useSpeech } from "@/hooks/useSpeech";
import { useGamification } from "@/context/GamificationContext";

// Mock Story
const CHAPTERS = [
  {
    id: 1,
    title: "Chapter 1: The Airport",
    nodes: [
      { type: "story", text: "You have just landed in London. You are tired, but you need to find your bags to survive the night." },
      { type: "encounter", text: "A security officer stops you. 'Can I see your passport please?' What do you say?", expected: ["here is", "here it is", "yes", "of course"], failText: "He looks confused. You waste time explaining." },
      { type: "story", text: "You make it past security and find the baggage claim. Suddenly, someone picks up your red suitcase!" },
      { type: "boss", text: "BOSS ENCOUNTER! The person is walking away fast. Shout at them to stop!", expected: ["excuse me", "that is mine", "stop", "hey"], failText: "They walk away with your bag! Critical failure." }
    ]
  }
];

export default function SurvivalGame() {
  const router = useRouter();
  const { isRecording, transcript, startRecording, stopRecording, setTranscript } = useSpeech();
  const { awardXP } = useGamification();
  
  const [view, setView] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [hearts, setHearts] = useState(3);
  const [currentNode, setCurrentNode] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const chapter = CHAPTERS[0];
  const activeNode = chapter.nodes[currentNode];

  const handleStart = () => {
    setHearts(3);
    setCurrentNode(0);
    setFeedback(null);
    setView('playing');
  };

  const advanceNode = () => {
    if (currentNode + 1 >= chapter.nodes.length) {
      setView('victory');
      awardXP(150, "Survival Chapter Cleared!");
    } else {
      setCurrentNode(prev => prev + 1);
      setTranscript("");
      setFeedback(null);
    }
  };

  // Evaluate speech during encounters
  useEffect(() => {
    if (view === 'playing' && (activeNode.type === 'encounter' || activeNode.type === 'boss') && transcript && !isRecording) {
      const lowerT = transcript.toLowerCase();
      const isMatch = activeNode.expected?.some(e => lowerT.includes(e));

      if (isMatch) {
        setFeedback("Success! You handled it perfectly.");
        setTimeout(() => advanceNode(), 2000);
      } else {
        setFeedback(activeNode.failText || "Wrong answer.");
        const damage = activeNode.type === 'boss' ? 2 : 1;
        setHearts(h => {
          const newHearts = h - damage;
          if (newHearts <= 0) {
            setTimeout(() => setView('gameover'), 2000);
          } else {
            setTimeout(() => advanceNode(), 2000);
          }
          return newHearts;
        });
      }
    }
  }, [isRecording, transcript, view, activeNode]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
        
        {/* Gritty background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-50 pointer-events-none" />

        <header className="p-4 flex items-center justify-between z-10 sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
          <button onClick={() => router.push('/games')} className="p-2 -ml-2 rounded-full hover:bg-gray-800">
            <ArrowLeft size={24} />
          </button>
          {view === 'playing' && (
            <div className="bg-black/50 px-4 py-2 rounded-full border border-gray-800">
               <HeartsDisplay max={3} current={hearts} />
            </div>
          )}
          <div className="w-10"></div>
        </header>

        {view === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
            <Shield size={60} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-black text-center mb-4 tracking-wider uppercase text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              Survival
            </h1>
            <p className="text-center text-gray-400 mb-12 text-lg">
              3 Hearts. 1 Story. <br/>Speak correct English to survive.
            </p>
            <Button onClick={handleStart} className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Start Chapter 1
            </Button>
          </div>
        )}

        {view === 'playing' && activeNode && (
          <div className="flex-1 flex flex-col z-10">
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              {activeNode.type === 'story' && (
                <BookOpen size={40} className="text-gray-500 mb-6" />
              )}
              {activeNode.type === 'encounter' && (
                <AlertTriangle size={40} className="text-yellow-500 mb-6" />
              )}
              {activeNode.type === 'boss' && (
                <Skull size={50} className="text-red-500 mb-6 animate-pulse" />
              )}

              <h2 className={`text-2xl font-medium leading-relaxed ${activeNode.type === 'boss' ? 'text-red-400 font-bold' : ''}`}>
                {activeNode.text}
              </h2>

              {feedback && (
                <div className={`mt-8 p-4 rounded-xl border ${feedback.includes('Success') ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300'}`}>
                  {feedback}
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-950 border-t border-gray-800 flex flex-col items-center min-h-[200px] justify-center">
              {activeNode.type === 'story' ? (
                <Button onClick={advanceNode} className="w-full h-14 bg-white text-black hover:bg-gray-200 border-none">
                  Continue
                </Button>
              ) : (
                <div className="flex flex-col items-center w-full">
                  {!feedback && (
                    <>
                      <MicButton 
                        isRecording={isRecording} 
                        onToggle={() => {
                          if (isRecording) stopRecording();
                          else startRecording();
                        }} 
                      />
                      <p className="text-sm text-gray-400 mt-4 h-6 text-center">
                        {transcript ? `"${transcript}"` : (isRecording ? "Listening..." : "Tap mic to answer")}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {view === 'gameover' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 text-center">
            <Skull size={80} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-black mb-4 text-red-500">YOU DIED</h1>
            <p className="text-gray-400 mb-8">You ran out of hearts. Your English wasn't strong enough this time.</p>
            <div className="flex gap-4 w-full">
              <Button variant="ghost" onClick={() => router.push('/games')} className="flex-1 border-gray-700 text-white hover:bg-gray-800">
                Flee
              </Button>
              <Button onClick={handleStart} className="flex-1 bg-red-600 hover:bg-red-700 border-none">
                Retry
              </Button>
            </div>
          </div>
        )}

        {view === 'victory' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 text-center">
            <Shield size={80} className="text-green-500 mb-6" />
            <h1 className="text-4xl font-black mb-4 text-green-500">CHAPTER CLEARED</h1>
            <p className="text-gray-300 mb-8">You survived the Airport! Your speaking skills are improving.</p>
            <div className="text-5xl font-black text-yellow-500 mb-12">+150 XP</div>
            <Button onClick={() => router.push('/games')} className="w-full h-14 bg-white text-black hover:bg-gray-200 border-none">
              Back to Arcade
            </Button>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
