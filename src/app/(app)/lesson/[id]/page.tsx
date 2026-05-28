"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Volume2, Mic, CheckCircle2, BookOpen, Star, Zap, ChevronRight, Play, RefreshCw
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { updateUserStreakAndXP } from "@/lib/streak";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [lesson, setLesson] = useState<any>(null);
  const [phrases, setPhrases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1);
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);

  // Scoring
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [fluencyScore, setFluencyScore] = useState(0);
  
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
        recognitionRef.current.lang = 'en-IN'; // Indian English

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
      calculateScore();
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

  const calculateScore = () => {
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
     expectedWords.forEach(w => {
       if (spokenWords.includes(w)) match++;
     });
     
     const rawScore = Math.floor((match / expectedWords.length) * 10);
     const finalScore = Math.max(3, Math.min(10, rawScore));
     
     setPronunciationScore(finalScore);
     setFluencyScore(finalScore >= 8 ? 9 : Math.max(2, finalScore - 1));
  };

  const handleNextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && lesson) {
         await supabase.from("user_progress").upsert({
            user_id: user.id,
            lesson_id: lesson.id,
            pronunciation_score: pronunciationScore || 7, // Fallbacks if skipped
            fluency_score: fluencyScore || 7,
         }, { onConflict: 'user_id, lesson_id' });

         let bonus = 0;
         if (pronunciationScore >= 8) bonus += 20;
         if (fluencyScore >= 8) bonus += 20;
         await updateUserStreakAndXP(supabase, user.id, 50 + bonus);
      }
    } catch(err) {
      console.error(err);
    }
    router.push("/lessons");
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center font-bold text-muted">Loading lesson...</div>;
  if (!lesson || phrases.length === 0) return <div className="min-h-screen bg-surface flex items-center justify-center font-bold text-muted">Lesson content unavailable.</div>;

  const currentPhrase = phrases[currentPhraseIdx];
  const progressPercent = (step / 5) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-brand-orange/20 animate-in fade-in duration-500">
      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-surface px-4 pt-6 pb-2">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-brand-dark" />
            </button>
            <h2 className="text-lg font-bold text-brand-dark truncate px-2">{lesson.title}</h2>
            <span className="text-sm font-bold text-muted bg-white px-3 py-1 rounded-pill shadow-sm shrink-0">
              {step} of 5
            </span>
          </div>
          <ProgressBar value={progressPercent} size="md" color="orange" className="mb-2" />
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col gap-8 pb-32">
        
        {/* STEP 1: CONTEXT */}
        {step === 1 && (
          <div className="flex flex-col gap-8 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[13px] font-bold text-brand-orange uppercase tracking-wider">Step 1 — Context</span>
              <h3 className="text-2xl font-bold text-center text-brand-dark">Situation</h3>
            </div>
            <Card className="p-8 text-center border-none shadow-sm flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                <BookOpen size={32} className="text-brand-orange" />
              </div>
              <p className="text-lg font-medium text-brand-dark leading-relaxed">
                {lesson.situation}
              </p>
              <p className="hindi text-muted">
                {lesson.hindi_description}
              </p>
            </Card>
            <Button className="mt-4 py-4 rounded-pill" onClick={handleNextStep}>Got it, Let's go <ChevronRight size={18} className="ml-1" /></Button>
          </div>
        )}

        {/* STEP 2: LISTEN */}
        {step === 2 && (
          <div className="flex flex-col gap-8 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[13px] font-bold text-brand-orange uppercase tracking-wider">Step 2 — Listen</span>
              <h3 className="text-xl font-bold text-center text-brand-dark">Listen carefully</h3>
            </div>
            <Card className="p-8 flex flex-col items-center text-center gap-6 border-none shadow-sm">
              <p className="text-[22px] font-bold text-brand-dark leading-tight">
                "{currentPhrase.english}"
              </p>
              <p className="hindi italic text-lg text-muted/80">
                {currentPhrase.hindi}
              </p>
              <button 
                onClick={() => speakText(currentPhrase.english)}
                className="w-16 h-16 rounded-full bg-brand-purple text-white flex items-center justify-center hover:bg-brand-purple/90 transition-colors shadow-sm mt-2 active:scale-95"
              >
                <Volume2 className="w-8 h-8" />
              </button>
            </Card>
            <Button className="mt-4 py-4 rounded-pill" onClick={handleNextStep}>Next <ChevronRight size={18} className="ml-1" /></Button>
          </div>
        )}

        {/* STEP 3: LEARN */}
        {step === 3 && (
          <div className="flex flex-col gap-8 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[13px] font-bold text-brand-orange uppercase tracking-wider">Step 3 — Learn</span>
              <h3 className="text-xl font-bold text-center text-brand-dark">Pronunciation</h3>
            </div>
            <Card className="p-8 flex flex-col gap-6 border-none shadow-sm">
              <div className="flex flex-wrap justify-center gap-2 text-[16px] font-medium text-brand-dark">
                {currentPhrase.pronunciation_guide.split(" | ").map((word: string, i: number) => (
                  <span key={i} className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    {word}
                  </span>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted mb-2">Practice speaking this out loud.</p>
                <p className="font-bold text-brand-dark text-lg">"{currentPhrase.english}"</p>
              </div>
            </Card>
            <Button className="mt-4 py-4 rounded-pill" onClick={handleNextStep}>I'm ready to speak <ChevronRight size={18} className="ml-1" /></Button>
          </div>
        )}

        {/* STEP 4: SPEAK */}
        {step === 4 && (
          <div className="flex flex-col gap-8 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[13px] font-bold text-brand-orange uppercase tracking-wider">Step 4 — Speak</span>
              <h3 className="text-xl font-bold text-center text-brand-dark">Your turn to speak</h3>
            </div>
            
            <Card className="p-8 text-center gap-6 border-none shadow-sm flex flex-col">
              <h3 className="text-[22px] font-bold text-brand-dark leading-tight px-4">
                "{currentPhrase.english}"
              </h3>
              {transcript && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm font-medium text-brand-dark">You said:</p>
                  <p className="text-brand-orange font-medium mt-1">"{transcript}"</p>
                </div>
              )}
            </Card>

            <div className="flex flex-col items-center gap-6 mt-2">
              <p className="text-muted font-medium text-sm">
                {recordingState === "idle" ? "Tap mic and speak" : 
                 recordingState === "recording" ? "Listening..." : 
                 "Done! Tap next or try again."}
              </p>

              <div className="relative">
                {recordingState === "recording" && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-brand-orange/20 animate-ping" />
                    <div className="absolute -inset-4 rounded-full border-2 border-brand-orange/10 animate-pulse" />
                  </>
                )}
                <button
                  onClick={toggleRecording}
                  className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-float transition-all active:scale-90 ${
                    recordingState === "recording" ? "bg-red-500 scale-110" : "bg-brand-orange"
                  } ${recordingState === "done" ? "bg-green-500" : ""}`}
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
              className="mt-6 py-4 rounded-pill" 
              disabled={recordingState !== "done"}
              onClick={handleNextStep}
            >
              See Results <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 5: RESULT */}
        {step === 5 && (
          <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2 mt-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-brand-dark">Excellent!</h2>
              <p className="text-muted">You completed this lesson</p>
            </div>

            <Card className="p-6 mt-4 border-none shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Star size={24} className="text-brand-orange" />
                  <span className="font-bold text-brand-dark">Pronunciation</span>
                </div>
                <span className="text-2xl font-black text-brand-orange">{pronunciationScore}/10</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap size={24} className="text-brand-purple" />
                  <span className="font-bold text-brand-dark">Fluency</span>
                </div>
                <span className="text-2xl font-black text-brand-purple">{fluencyScore}/10</span>
              </div>
            </Card>

            <Button 
              className="mt-8 py-4 rounded-pill text-lg shadow-sm" 
              onClick={handleFinish}
              isLoading={loading}
            >
              Claim XP & Finish
            </Button>
          </div>
        )}

      </main>
    </div>
  );
}
