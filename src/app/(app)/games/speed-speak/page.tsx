"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { TimerBar } from "@/components/games/TimerBar";
import { MicButton } from "@/components/games/MicButton";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Zap, Trophy, Flame } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import { useGamification } from "@/context/GamificationContext";

// Mock sentences (would be fetched from speed_speak_sentences table)
const SENTENCES = [
  { hindi: "मुझे एक ग्लास पानी चाहिए", english: "I need a glass of water", time: 10 },
  { hindi: "क्या तुम कल आ सकते हो?", english: "Can you come tomorrow", time: 10 },
  { hindi: "मैं जा रहा हूँ", english: "I am going", time: 8 },
  { hindi: "यह बहुत महंगा है", english: "It is very expensive", time: 8 },
  { hindi: "मुझे समझ नहीं आया", english: "I do not understand", time: 10 },
];

export default function SpeedSpeakGame() {
  const router = useRouter();
  const { isRecording, transcript, startRecording, stopRecording, setTranscript } = useSpeech();
  const { awardXP } = useGamification();
  
  const [gameState, setGameState] = useState<'intro' | 'countdown' | 'playing' | 'result' | 'gameover'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [countdown, setCountdown] = useState(3);
  const [feedback, setFeedback] = useState<'success' | 'fail' | null>(null);

  const currentSentence = SENTENCES[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean transcript for matching
  const normalize = (text: string) => text.toLowerCase().replace(/[^a-z\s]/g, "").trim();

  const handleStart = () => {
    setGameState('countdown');
    setCountdown(3);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= SENTENCES.length) {
      setGameState('gameover');
      awardXP(Math.floor(score), "Speed Speak Complete!");
      stopRecording();
    } else {
      setCurrentIndex(prev => prev + 1);
      setTranscript("");
      setFeedback(null);
      setGameState('playing');
      setTimeLeft(SENTENCES[currentIndex + 1].time);
      startRecording();
    }
  };

  // Countdown timer
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setGameState('playing');
        setTimeLeft(currentSentence.time);
        startRecording();
      }
    }
  }, [gameState, countdown, currentSentence, startRecording]);

  // Play timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0.1) {
            clearInterval(timerRef.current!);
            handleFailure();
            return 0;
          }
          return t - 0.1;
        });
      }, 100);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState]);

  // Check transcript continuously
  useEffect(() => {
    if (gameState === 'playing' && transcript) {
      const normalizedTranscript = normalize(transcript);
      const normalizedTarget = normalize(currentSentence.english);
      
      // Fuzzy check if they said the sentence
      if (normalizedTranscript.includes(normalizedTarget) || normalizedTarget.includes(normalizedTranscript) && normalizedTranscript.length > normalizedTarget.length * 0.8) {
        handleSuccess();
      }
    }
  }, [transcript, gameState, currentSentence]);

  const handleSuccess = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const speedBonus = timeLeft > currentSentence.time / 2 ? 5 : 0;
    const points = (10 + speedBonus) * combo;
    
    setScore(s => s + points);
    setCombo(c => Math.min(c + 0.5, 3)); // Max combo 3x
    setFeedback('success');
    setGameState('result');
    setTimeout(handleNext, 1500);
  };

  const handleFailure = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCombo(1); // Reset combo
    setFeedback('fail');
    setGameState('result');
    setTimeout(handleNext, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
        <header className="p-4 flex items-center justify-between bg-white shadow-sm z-10 relative">
          <button onClick={() => router.push('/games')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-brand-orange font-bold">
              <Flame size={18} /> {combo}x
            </div>
            <div className="flex items-center gap-1 text-brand-black font-bold">
              <Trophy size={18} className="text-yellow-500" /> {Math.floor(score)}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6 items-center justify-center relative">
          {gameState === 'intro' && (
            <Card className="p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Zap size={40} className="text-brand-orange" />
              </div>
              <h2 className="text-2xl font-black mb-2">Speed Speak</h2>
              <p className="text-gray-600 mb-8">
                Translate the Hindi sentence to English as fast as you can. Don't think, just speak!
              </p>
              <Button onClick={handleStart} className="w-full text-lg h-14">
                Start Challenge
              </Button>
            </Card>
          )}

          {gameState === 'countdown' && (
            <div className="text-[120px] font-black text-brand-orange animate-bounce">
              {countdown}
            </div>
          )}

          {(gameState === 'playing' || gameState === 'result') && currentSentence && (
            <div className="w-full flex flex-col items-center max-w-sm">
              <TimerBar duration={currentSentence.time} timeLeft={timeLeft} className="mb-8" />
              
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-brand-black mb-4 leading-tight">
                  {currentSentence.hindi}
                </h2>
                {gameState === 'result' ? (
                  <p className={`text-xl font-bold ${feedback === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {currentSentence.english}
                  </p>
                ) : (
                  <div className="text-gray-300 font-bold text-xl blur-[3px] select-none">
                    {currentSentence.english}
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col items-center">
                <MicButton 
                  isRecording={isRecording} 
                  onToggle={() => {
                    if (isRecording) stopRecording();
                    else startRecording();
                  }}
                  disabled={gameState === 'result'}
                />
                <p className="mt-4 text-gray-500 font-medium text-sm h-6">
                  {transcript ? `"${transcript}"` : (isRecording ? "Listening..." : "")}
                </p>
              </div>

              {gameState === 'result' && (
                <div className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none`}>
                   <div className={`text-5xl font-black ${feedback === 'success' ? 'text-green-500' : 'text-red-500'} drop-shadow-lg scale-150 transition-all duration-300`}>
                     {feedback === 'success' ? '⚡ FAST!' : '❌ TOO SLOW'}
                   </div>
                </div>
              )}
            </div>
          )}

          {gameState === 'gameover' && (
            <Card className="p-8 text-center flex flex-col items-center w-full">
              <Trophy size={60} className="text-yellow-500 mb-4" />
              <h2 className="text-2xl font-black mb-2">Challenge Complete!</h2>
              <p className="text-gray-600 mb-6">You scored</p>
              <div className="text-5xl font-black text-brand-orange mb-8">{Math.floor(score)} XP</div>
              <div className="flex gap-4 w-full">
                <Button variant="ghost" onClick={() => router.push('/games')} className="flex-1">
                  Exit
                </Button>
                <Button onClick={() => {
                  setScore(0);
                  setCombo(1);
                  setCurrentIndex(0);
                  setGameState('countdown');
                  setCountdown(3);
                }} className="flex-1">
                  Play Again
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
