"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Film, Trophy, Sun, Phone, PhoneOff, MicOff, Mic } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

import { useGamification } from "@/context/GamificationContext";

const TOPICS = [
  { id: 1, title: "Bollywood Movies", icon: Film, color: "bg-purple-500" },
  { id: 2, title: "Cricket Match", icon: Trophy, color: "bg-blue-500" },
  { id: 3, title: "My Daily Routine", icon: Sun, color: "bg-orange-500" },
];

export default function AIPartnerGame() {
  const router = useRouter();
  const { isRecording, transcript, startRecording, stopRecording, setTranscript } = useSpeech();
  const { awardXP } = useGamification();
  
  const [view, setView] = useState<'topics' | 'calling' | 'active' | 'report'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<typeof TOPICS[0] | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === 'active') {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [view]);

  // Handle user speech stopping -> trigger AI response
  useEffect(() => {
    if (view === 'active' && !isRecording && transcript.length > 5) {
      setIsAiSpeaking(true);
      // Mock AI thinking/speaking time
      setTimeout(() => {
        setIsAiSpeaking(false);
        setTranscript("");
      }, 3000);
    }
  }, [isRecording, transcript, view, setTranscript]);

  const handleStartCall = (topic: typeof TOPICS[0]) => {
    setSelectedTopic(topic);
    setView('calling');
    setTimeout(() => {
      setView('active');
      setIsAiSpeaking(true);
      setTimeout(() => {
        setIsAiSpeaking(false);
      }, 2000);
    }, 2000);
  };

  const handleEndCall = () => {
    if (isRecording) stopRecording();
    setView('report');
    awardXP(Math.max(10, callDuration * 2), "Great Conversation!");
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startRecording();
    } else {
      setIsMuted(true);
      stopRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-gray-900 text-white">
        {view === 'topics' && (
          <div className="flex-1 bg-gray-50 text-brand-black flex flex-col">
            <header className="p-4 flex items-center bg-white shadow-sm sticky top-0">
              <button onClick={() => router.push('/games')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <h1 className="font-bold text-lg ml-2">Choose Topic</h1>
            </header>

            <div className="flex-1 p-6 space-y-4">
              {TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => handleStartCall(topic)}
                  className="w-full bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md ${topic.color}`}>
                    <topic.icon size={28} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{topic.title}</h3>
                    <p className="text-sm text-gray-500">Tap to call AI</p>
                  </div>
                  <div className="ml-auto">
                    <Phone className="text-green-500" size={24} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'calling' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-800 to-black">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-8 animate-pulse relative">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping" />
              {selectedTopic && (() => {
                const IconComponent = selectedTopic.icon;
                return <IconComponent size={50} className="text-white opacity-50" />;
              })()}
            </div>
            <h2 className="text-3xl font-light mb-2">Connecting...</h2>
            <p className="text-gray-400">AI Partner</p>
          </div>
        )}

        {view === 'active' && (
          <div className="flex-1 flex flex-col p-6 bg-gradient-to-b from-gray-800 to-black relative overflow-hidden">
            {/* Visualizer Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className={`w-64 h-64 rounded-full bg-blue-500 blur-[100px] transition-all duration-1000 ${isAiSpeaking ? 'scale-150 opacity-30' : (isRecording ? 'bg-orange-500 scale-110 opacity-20' : '')}`} />
            </div>

            <div className="flex justify-between items-center z-10">
               <div className="w-10" />
               <div className="text-center">
                 <h2 className="text-xl font-medium">{selectedTopic?.title}</h2>
                 <p className="text-gray-400 text-sm font-mono">{formatTime(callDuration)}</p>
               </div>
               <div className="w-10 flex justify-end">
                 <div className={`w-3 h-3 rounded-full ${isAiSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`} />
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center z-10">
               <div className="h-32 flex items-center justify-center w-full mb-8">
                 {isAiSpeaking ? (
                   <div className="flex items-center gap-1 h-16">
                     {[1, 2, 3, 4, 5, 6].map(i => (
                       <div key={i} className="w-3 bg-blue-400 rounded-full animate-pulse" style={{ 
                         height: `${Math.random() * 100 + 20}%`,
                         animationDelay: `${i * 100}ms`,
                         animationDuration: '0.8s'
                       }} />
                     ))}
                   </div>
                 ) : (
                   <div className="flex items-center gap-1 h-16 opacity-50">
                     <div className="w-3 h-2 bg-gray-500 rounded-full" />
                     <div className="w-3 h-2 bg-gray-500 rounded-full" />
                     <div className="w-3 h-2 bg-gray-500 rounded-full" />
                   </div>
                 )}
               </div>

               <div className="h-24 w-full px-4 text-center">
                 {transcript && !isAiSpeaking && (
                   <p className="text-lg text-white/90 animate-in fade-in slide-in-from-bottom-2">
                     "{transcript}"
                   </p>
                 )}
                 {isAiSpeaking && (
                   <p className="text-lg text-blue-300 animate-pulse">
                     AI is speaking...
                   </p>
                 )}
               </div>
            </div>

            <div className="pb-10 pt-4 flex justify-center gap-8 z-10">
              <button 
                onClick={toggleMute}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-white text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
              </button>

              <button 
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white transition-transform active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              >
                <PhoneOff size={28} />
              </button>
            </div>
          </div>
        )}

        {view === 'report' && (
          <div className="flex-1 bg-gray-50 text-brand-black flex flex-col p-6 items-center justify-center">
            <Card className="p-8 w-full max-w-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Phone className="text-purple-500" size={40} />
              </div>
              <h2 className="text-2xl font-black mb-2">Call Ended</h2>
              <p className="text-gray-500 mb-6">Duration: {formatTime(callDuration)}</p>

              <div className="w-full bg-gray-100 rounded-xl p-4 mb-8 text-left">
                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Feedback</h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  Great job keeping the conversation going! You used the word "fantastic" correctly.
                  <br/><br/>
                  <span className="text-brand-orange font-medium">Tip:</span> Try to say "I went" instead of "I goed".
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="text-sm font-bold text-gray-400 uppercase">XP Earned</div>
                <div className="text-4xl font-black text-purple-500">+{Math.max(10, callDuration * 2)} XP</div>
              </div>

              <Button onClick={() => setView('topics')} className="w-full h-14 text-lg">
                Done
              </Button>
            </Card>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
