"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Mic, RefreshCw, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const PRACTICE_PHRASES = [
  { en: "Could you please help me?", hi: "Kya aap meri madad kar sakte hain?" },
  { en: "I would like to order coffee.", hi: "Main coffee order karna chahunga." },
  { en: "Where is the nearest hospital?", hi: "Sabse paas hospital kahan hai?" }
];

export default function SpeakPracticePage() {
  const router = useRouter();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "done">("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const initSpeech = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && !recognitionRef.current) {
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
  };

  const toggleRecording = () => {
    initSpeech();
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

  const handleNext = () => {
    setPhraseIdx((prev) => (prev + 1) % PRACTICE_PHRASES.length);
    setRecordingState("idle");
    setTranscript("");
  };

  const currentPhrase = PRACTICE_PHRASES[phraseIdx];

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
            <h2 className="text-lg font-bold text-brand-dark">Quick Speak</h2>
          </div>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-pill uppercase tracking-widest">
            Free Practice
          </span>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-xl font-bold text-center text-brand-dark">Read out loud</h3>
        </div>
        
        <Card className="p-8 text-center gap-6 border-none shadow-sm flex flex-col">
          <h3 className="text-[22px] font-bold text-brand-dark leading-tight px-4">
            "{currentPhrase.en}"
          </h3>
          <p className="hindi italic text-sm text-muted/80 mt-[-10px]">
            {currentPhrase.hi}
          </p>

          {transcript && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">You said</p>
              <p className="text-brand-orange font-medium text-lg">"{transcript}"</p>
            </div>
          )}
        </Card>

        <div className="flex flex-col items-center gap-6 mt-2">
          <p className="text-muted font-medium text-sm">
            {recordingState === "idle" ? "Tap mic to practice" : 
             recordingState === "recording" ? "Listening..." : 
             "Great job! Try the next one."}
          </p>

          <div className="relative">
            {recordingState === "recording" && (
              <>
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                <div className="absolute -inset-4 rounded-full border-2 border-green-500/10 animate-pulse" />
              </>
            )}
            <button
              onClick={toggleRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-float transition-all active:scale-90 ${
                recordingState === "recording" ? "bg-red-500 scale-110" : "bg-green-500"
              } ${recordingState === "done" ? "bg-green-600" : ""}`}
            >
              {recordingState === "done" ? (
                <RefreshCw className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>
          </div>
        </div>

        {recordingState === "done" && (
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