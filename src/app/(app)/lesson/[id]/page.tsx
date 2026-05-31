"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Volume2, Mic, CheckCircle2, BookOpen, Star, Zap, ChevronRight, Play, RefreshCw, MessageSquare, Send, Check
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { updateUserStreakAndXP } from "@/lib/streak";
import { useGamification } from "@/context/GamificationContext";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import PageTransition from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";
import confetti from "canvas-confetti";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const { awardXP } = useGamification();

  const [lesson, setLesson] = useState<any>(null);
  const [phrases, setPhrases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STEP-BASED NAVIGATION (1: Context, 2: Dialogue, 3: Learning, 4: Speaking, 5: Quiz, 6: Result)
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);

  // Scoring
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [fluencyScore, setFluencyScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  
  // Dialogue State
  const [visibleDialogueIdx, setVisibleDialogueIdx] = useState(0);

  // Quiz State
  const [selectedOption, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);

  // Speech Rec
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "done">("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Load Data
  useEffect(() => {
    async function loadData() {
      const { data: lessonData } = await supabase.from("lessons").select("*").eq("id", id).single();
      const { data: phrasesData } = await supabase.from("phrases").select("*").eq("lesson_id", id);
      
      setLesson(lessonData);
      setPhrases(phrasesData || []);
      setLoading(false);
    }
    loadData();

    // Init Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN'; 

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
             currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onend = () => {
           setRecordingState("done");
        };
      }
    }
  }, [id, supabase]);

  useEffect(() => {
    if (recordingState === "done") {
      calculateSpeakingScore();
    }
  }, [recordingState]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser. Try Chrome.");
      return;
    }

    if (recordingState === "idle") {
      setTranscript("");
      setRecordingState("recording");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Mic start error", e);
        setRecordingState("idle");
      }
    } else if (recordingState === "recording") {
      recognitionRef.current.stop();
      setRecordingState("done");
    } else {
      setRecordingState("idle");
      setTranscript("");
    }
  };

  const calculateSpeakingScore = () => {
     if (!phrases[currentPhraseIdx]) return;
     const expected = phrases[currentPhraseIdx].english.toLowerCase().replace(/[^a-z ]/g, "");
     const spoken = transcript.toLowerCase().replace(/[^a-z ]/g, "");
     
     if (!spoken) {
       setPronunciationScore(0);
       return;
     }

     const expectedWords = expected.split(" ");
     const spokenWords = spoken.split(" ");
     
     let match = 0;
     expectedWords.forEach((w: string) => {
       if (spokenWords.includes(w)) match++;
     });
     
     const rawScore = Math.floor((match / expectedWords.length) * 10);
     const finalScore = Math.max(3, Math.min(10, rawScore));
     
     setPronunciationScore(finalScore);
     setFluencyScore(finalScore >= 8 ? 9 : Math.max(2, finalScore - 1));
  };

  const handleQuizSubmit = (option: string, correct: string) => {
    if (isCorrect !== null) return;
    setSelectedId(option);
    
    if (option === correct) {
      setIsCorrect(true);
      setQuizScore(100);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
    } else {
      setIsCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(200);
    }
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      // Reset step states
      setIsCorrect(null);
      setSelectedId(null);

      if (nextStep === totalSteps) {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100]);
        }
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B35', '#6C63FF', '#22C55E', '#FFD700']
        });
      }
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && lesson) {
         await supabase.from("user_progress").upsert({
            user_id: user.id,
            lesson_id: lesson.id,
            pronunciation_score: pronunciationScore || 7,
            fluency_score: fluencyScore || 7,
         }, { onConflict: 'user_id, lesson_id' });

         const baseXP = 40;
         const durationXP = (lesson.duration_mins || 5) * 10;
         const difficultyXP = lesson.difficulty === 'ADVANCED' ? 20 : 0;
         const quizBonus = quizScore === 100 ? 30 : 0;
         const totalBaseXP = baseXP + durationXP + difficultyXP + quizBonus;

         let performanceBonus = 0;
         if (pronunciationScore >= 8) performanceBonus += 20;
         if (fluencyScore >= 8) performanceBonus += 20;
         
         const finalXP = totalBaseXP + performanceBonus;

         await awardXP(finalXP, `Lesson Mastered: ${lesson.title}`);
         await updateUserStreakAndXP(supabase, user.id, 0); 
         
         toast.success(`Excellent! +${finalXP} XP awarded`);
      }
    } catch(err) {
      console.error(err);
      toast.error("Error saving progress");
    }
    router.push("/lessons");
  };

  if (loading) {
    return (
      <PageTransition className="flex flex-col min-h-screen bg-surface px-4 pt-6">
        <div className="max-w-md mx-auto w-full flex items-center justify-between mb-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="w-16 h-6 rounded-pill" />
        </div>
        <Skeleton className="h-2 w-full max-w-md mx-auto rounded-full mb-8" />
        <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col gap-8">
           <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-8 w-48 rounded-full" />
           </div>
           <Card className="p-8 border-none shadow-card flex flex-col items-center gap-6">
             <Skeleton className="w-20 h-20 rounded-full" />
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-4 w-3/4" />
           </Card>
        </main>
      </PageTransition>
    );
  }

  if (!lesson || phrases.length === 0) return <div className="min-h-screen bg-surface flex items-center justify-center font-bold text-muted">Content loading...</div>;

  const currentPhrase = phrases[currentPhraseIdx];
  const progressPercent = (step / totalSteps) * 100;

  // Mock dialogue characters
  const charA = "Sam";
  const charB = "Rohan";

  return (
    <PageTransition className="flex flex-col min-h-screen bg-surface selection:bg-brand-orange/20 pb-20 font-sans">
      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md px-4 pt-5 pb-1.5 border-b border-white/50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => router.back()}
              className="p-1.5 hover:bg-black/5 rounded-full transition-colors active:scale-90"
            >
              <ArrowLeft className="w-5 h-5 text-brand-dark" strokeWidth={3} />
            </button>
            <div className="flex-1 px-4 overflow-hidden">
               <h2 className="text-[10px] font-black text-brand-dark truncate text-center uppercase tracking-widest opacity-30">{lesson.title}</h2>
            </div>
            <span className="text-[10px] font-black text-brand-orange bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg shadow-sm shrink-0 uppercase">
              Step {step}/{totalSteps}
            </span>
          </div>
          <ProgressBar value={progressPercent} size="sm" color="orange" className="mb-1" />
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-5 flex flex-col pb-28">
        
        {/* STEP 1: CONTEXT */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-1">
                <Zap size={20} className="text-brand-orange" />
              </div>
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">Step 1 — Situation</span>
              <h3 className="text-2xl font-black text-brand-dark tracking-tight leading-none">Set the Scene</h3>
            </div>
            
            <Card className="p-6 text-center border-none shadow-card bg-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50/50 rounded-bl-[80px] -z-0" />
               <p className="text-lg font-bold text-brand-dark leading-relaxed relative z-10">
                "{lesson.situation}"
              </p>
              <div className="h-[1px] bg-gray-100 w-12 mx-auto my-5" />
              <p className="hindi text-muted font-bold text-base relative z-10">
                {lesson.hindi_description}
              </p>
            </Card>
            
            <Button className="mt-2 h-14 rounded-xl text-base font-black shadow-lg shadow-orange-100" onClick={handleNextStep}>
              Ready to start! <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 2: IMMERSIVE DIALOGUE */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center text-center gap-1.5 mb-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Step 2 — Conversation</span>
              <h3 className="text-2xl font-black text-brand-dark tracking-tight leading-none">Listen & Learn</h3>
            </div>

            <div className="flex flex-col gap-3">
              {phrases.map((p, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.3 }}
                   className={cn(
                     "flex flex-col max-w-[85%]",
                     idx % 2 === 0 ? "self-start items-start" : "self-end items-end"
                   )}
                 >
                   <span className="text-[9px] font-black text-muted mb-0.5 px-1 uppercase tracking-wider">{idx % 2 === 0 ? charA : charB}</span>
                   <div className={cn(
                     "p-3.5 rounded-xl shadow-sm border",
                     idx % 2 === 0 
                      ? "bg-white border-gray-100 rounded-tl-none text-brand-dark" 
                      : "bg-blue-500 border-blue-400 rounded-tr-none text-white"
                   )}>
                     <p className="font-bold text-[14px] leading-snug">{p.english}</p>
                     <p className={cn("text-[10px] mt-0.5 font-medium italic", idx % 2 === 0 ? "text-muted" : "text-blue-100")}>{p.hindi}</p>
                   </div>
                   <button 
                     onClick={() => speakText(p.english)}
                     className="mt-1 p-1.5 rounded-full hover:bg-black/5 text-brand-dark/20 hover:text-brand-orange transition-all"
                   >
                     <Volume2 size={14} />
                   </button>
                 </motion.div>
              ))}
            </div>

            <Button className="mt-4 h-12 rounded-xl font-black text-sm" onClick={handleNextStep}>
              Understood <ChevronRight size={18} />
            </Button>
          </div>
        )}

        {/* STEP 3: PRONUNCIATION */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center text-center gap-1.5">
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Step 3 — Pronunciation</span>
              <h3 className="text-2xl font-black text-brand-dark tracking-tight leading-none">Break it down</h3>
            </div>

            <Card className="p-6 flex flex-col gap-6 border-none shadow-card bg-white items-center">
              <div className="flex flex-wrap justify-center gap-2.5">
                {currentPhrase.pronunciation_guide.split(" | ").map((word: string, i: number) => (
                  <motion.span 
                    key={i} 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-purple-50 px-3 py-2 rounded-xl border border-purple-100 text-brand-purple font-black text-[14px] shadow-sm"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              
              <div className="text-center space-y-3 w-full">
                <div className="w-10 h-1 bg-gray-100 mx-auto rounded-full" />
                <p className="font-black text-brand-dark text-xl tracking-tight leading-tight">
                  "{currentPhrase.english}"
                </p>
                <button 
                  onClick={() => speakText(currentPhrase.english)}
                  className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-200 active:scale-90 transition-transform"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </Card>

            <Button className="mt-2 h-14 rounded-xl font-black text-base shadow-lg shadow-purple-50" onClick={handleNextStep}>
              Ready to speak <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 4: VOICE CHALLENGE */}
        {step === 4 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center text-center gap-1.5">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Step 4 — Voice Challenge</span>
              <h3 className="text-2xl font-black text-brand-dark tracking-tight leading-none">Now, you speak!</h3>
            </div>
            
            <Card className="p-6 text-center gap-5 border-none shadow-card bg-white flex flex-col relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-rose-50 rounded-full blur-2xl opacity-50" />
              <h3 className="text-[18px] font-black text-brand-dark leading-tight px-2 relative z-10">
                "{currentPhrase.english}"
              </h3>
              {transcript && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Your Transcription</p>
                  <p className="text-brand-orange font-bold text-base italic leading-tight">"{transcript}"</p>
                </motion.div>
              )}
            </Card>

            <div className="flex flex-col items-center gap-5 mt-2">
              <div className="text-center space-y-0.5">
                <p className={cn(
                  "font-black text-[10px] uppercase tracking-widest",
                  recordingState === "recording" ? "text-red-500" : "text-muted"
                )}>
                  {recordingState === "idle" ? "Hold mic and speak" : 
                   recordingState === "recording" ? "Recording..." : 
                   "Great Effort!"}
                </p>
                {recordingState === "done" && (
                   <p className="text-[10px] font-bold text-green-500">Practice complete. Ready for quiz?</p>
                )}
              </div>

              <div className="relative">
                {recordingState === "recording" && (
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                )}
                <button
                  onClick={toggleRecording}
                  className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center shadow-float transition-all active:scale-90 ${
                    recordingState === "recording" ? "bg-red-500" : 
                    recordingState === "done" ? "bg-green-500" : "bg-brand-orange"
                  }`}
                >
                  {recordingState === "done" ? (
                    <RefreshCw className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              className="mt-4 h-14 rounded-xl font-black text-base" 
              disabled={recordingState !== "done"}
              onClick={handleNextStep}
            >
              Take the Quiz <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 5: MASTERY QUIZ */}
        {step === 5 && (
           <div className={cn("flex flex-col gap-6 animate-in slide-in-from-right-4", shake && "animate-shake")}>
             <div className="flex flex-col items-center text-center gap-1.5">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Step 5 — Mastery Quiz</span>
                <h3 className="text-2xl font-black text-brand-dark tracking-tight leading-none">Choose the meaning</h3>
             </div>

             <Card className="p-6 text-center border-none shadow-card bg-white">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">Sentence</p>
                <h3 className="text-[18px] font-black text-brand-dark">"{currentPhrase.english}"</h3>
             </Card>

             <div className="grid gap-2.5">
               {[currentPhrase.hindi, "Main ghar ja raha hoon", "Dost banao"].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizSubmit(opt, currentPhrase.hindi)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 font-bold text-left transition-all flex items-center justify-between group",
                      selectedOption === opt 
                        ? (isCorrect ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700")
                        : "bg-white border-[#F5EDE8] text-brand-dark hover:border-brand-orange/30"
                    )}
                  >
                    <span className="hindi text-base">{opt}</span>
                    {selectedOption === opt && (
                      isCorrect ? <CheckCircle2 size={18} className="text-green-500" /> : <Zap size={18} className="text-red-500" />
                    )}
                  </button>
               ))}
             </div>

             {isCorrect !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-5 rounded-xl border flex flex-col gap-1.5 items-center text-center",
                    isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  )}
                >
                  <p className={cn("font-black text-base", isCorrect ? "text-green-700" : "text-red-700")}>
                    {isCorrect ? "Brilliant! You nailed it." : "Oops! Incorrect meaning."}
                  </p>
                  <p className="text-[12px] font-medium opacity-60">
                    {isCorrect ? "You've mastered this phrase." : "Don't worry, try to remember the context."}
                  </p>
                  <Button 
                    className={cn("mt-3 w-full h-12 rounded-xl font-black text-sm", isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600")}
                    onClick={handleNextStep}
                  >
                    {isCorrect ? "Continue →" : "Next Lesson →"}
                  </Button>
                </motion.div>
             )}
           </div>
        )}

        {/* STEP 6: RESULT */}
        {step === 6 && (
          <div className="flex flex-col gap-5 animate-in zoom-in-95 duration-700">
            <div className="text-center space-y-3 pt-2">
              <div className="w-20 h-20 bg-green-100 rounded-[24px] flex items-center justify-center mx-auto mb-3 border-4 border-white shadow-lg rotate-3 group">
                <Star size={40} className="text-green-500 fill-green-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-3xl font-black text-brand-dark tracking-tight leading-none">Lesson Mastered!</h2>
                <p className="text-muted font-bold text-[14px]">You're one step closer to fluency.</p>
              </div>
            </div>

            <Card className="p-5 mt-2 border-none shadow-card bg-white flex flex-col gap-3">
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Star size={18} className="text-brand-orange fill-brand-orange" />
                  </div>
                  <span className="font-black text-brand-dark text-sm">Speaking</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-brand-dark">{pronunciationScore}/10</span>
                  <p className="text-[9px] font-black text-brand-orange uppercase tracking-widest">SCORE</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2.5">
                   <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Check size={18} className="text-blue-500" strokeWidth={4} />
                  </div>
                  <span className="font-black text-brand-dark text-sm">Quiz Accuracy</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-brand-dark">{quizScore}%</span>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">PERFECT</p>
                </div>
              </div>
            </Card>

            <Button 
              className="mt-4 h-16 rounded-xl text-lg font-black shadow-xl shadow-orange-200 group active:scale-95" 
              onClick={handleFinish}
              isLoading={loading}
            >
              Claim Your XP
              <Zap size={20} className="ml-2 fill-white animate-pulse" />
            </Button>
          </div>
        )}

      </main>

      {/* Global Shake Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </PageTransition>
  );
}
