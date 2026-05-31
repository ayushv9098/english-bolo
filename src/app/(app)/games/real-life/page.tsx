"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, MapPin, Coffee, Train, Stethoscope, Briefcase, CheckCircle2, Circle } from "lucide-react";
import { MicButton } from "@/components/games/MicButton";
import { useSpeech } from "@/hooks/useSpeech";
import { useGamification } from "@/context/GamificationContext";

// Mock missions
const MISSIONS = [
  { 
    id: 1, 
    location: "Chai Shop", 
    icon: Coffee,
    title: "Order a Chai", 
    objectives: [
      { text: "Greet the seller", hints: ["hello", "hi", "good morning"] },
      { text: "Ask for one tea", hints: ["one tea", "a cup of tea", "give me tea"] },
      { text: "Ask for the price", hints: ["how much", "price", "cost"] }
    ], 
    npcStart: "Namaste! What can I get for you today?",
    color: "bg-orange-500",
    requiredXP: 0
  },
  { 
    id: 2, 
    location: "Railway Station", 
    icon: Train,
    title: "Buy a Ticket", 
    objectives: [
      { text: "Ask for a ticket to Delhi", hints: ["ticket", "delhi"] },
      { text: "Ask the departure time", hints: ["time", "when", "depart"] }
    ], 
    npcStart: "Next in line! Where do you want to go?",
    color: "bg-blue-500",
    requiredXP: 1500
  },
  { 
    id: 3, 
    location: "Doctor", 
    icon: Stethoscope,
    title: "Explain your fever", 
    objectives: [
      { text: "Say you have a fever", hints: ["fever", "sick", "hot"] },
      { text: "Ask for medicine", hints: ["medicine", "pills", "tablet"] }
    ], 
    npcStart: "Hello. What seems to be the problem today?",
    color: "bg-green-500",
    requiredXP: 3000
  },
];

export default function RealLifeMissionsGame() {
  const router = useRouter();
  const { isRecording, transcript, startRecording, stopRecording, setTranscript } = useSpeech();
  const { totalXP, awardXP } = useGamification();
  
  const [view, setView] = useState<'map' | 'briefing' | 'mission' | 'result'>('map');
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null);
  const [completedObjectives, setCompletedObjectives] = useState<boolean[]>([]);
  const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
  const [score, setScore] = useState(0);

  const activeMission = MISSIONS.find(m => m.id === selectedMissionId);

  const startBriefing = (id: number) => {
    setSelectedMissionId(id);
    setView('briefing');
  };

  const startMission = () => {
    if (!activeMission) return;
    setCompletedObjectives(new Array(activeMission.objectives.length).fill(false));
    setMessages([{ sender: 'ai', text: activeMission.npcStart }]);
    setTranscript("");
    setView('mission');
  };

  // Mock AI response logic based on transcript
  useEffect(() => {
    if (view === 'mission' && activeMission && transcript && !isRecording) {
      const lowerTranscript = transcript.toLowerCase();
      
      setMessages(prev => [...prev, { sender: 'user', text: transcript }]);
      setTranscript(""); // clear it

      let newCompleted = [...completedObjectives];
      let objectiveMet = false;

      // Check against objectives
      activeMission.objectives.forEach((obj, idx) => {
        if (!newCompleted[idx]) {
          const isMatch = obj.hints.some(hint => lowerTranscript.includes(hint));
          if (isMatch) {
            newCompleted[idx] = true;
            objectiveMet = true;
          }
        }
      });

      setCompletedObjectives(newCompleted);

      // AI Response
      setTimeout(() => {
        if (objectiveMet) {
          const allDone = newCompleted.every(Boolean);
          if (allDone) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Perfect, here you go. Have a great day!" }]);
            setTimeout(() => {
              setScore(50);
              awardXP(50, "Mission Accomplished!");
              setView('result');
            }, 2000);
          } else {
            setMessages(prev => [...prev, { sender: 'ai', text: "Got it. What else?" }]);
          }
        } else {
          setMessages(prev => [...prev, { sender: 'ai', text: "I'm sorry, I didn't quite catch that." }]);
        }
      }, 1000);
    }
  }, [isRecording, transcript, view, activeMission, completedObjectives, setTranscript]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
        <header className="p-4 flex items-center justify-between bg-white shadow-sm z-10 sticky top-0">
          <button 
            onClick={() => view === 'map' ? router.push('/games') : setView('map')} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-brand-black">Real Life Missions</h1>
          <div className="w-10"></div> {/* spacer */}
        </header>

        {view === 'map' && (
          <div className="flex-1 p-4 relative overflow-hidden bg-[#E5E5F7]">
            {/* Simple Map UI */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-400 to-transparent" style={{ backgroundSize: '20px 20px' }} />
            
            <div className="relative z-10 space-y-6 mt-8">
              {MISSIONS.map((mission, index) => {
                const isLocked = totalXP < mission.requiredXP;
                return (
                <div key={mission.id} className={`flex items-center gap-4 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <button 
                    onClick={() => !isLocked && startBriefing(mission.id)}
                    disabled={isLocked}
                    className={`relative flex flex-col items-center group ${isLocked ? 'opacity-50 grayscale' : ''}`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg ${mission.color} hover:scale-105 transition-transform border-4 border-white`}>
                      <mission.icon size={28} />
                    </div>
                    <div className="mt-2 bg-white px-3 py-1 rounded-full shadow-sm text-sm font-bold text-gray-800 border border-gray-100">
                      {mission.location}
                    </div>
                    {isLocked && (
                      <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
                        {mission.requiredXP} XP
                      </div>
                    )}
                  </button>
                </div>
              )})}
            </div>
          </div>
        )}

        {view === 'briefing' && activeMission && (
          <div className="flex-1 flex flex-col p-6 items-center justify-center">
            <Card className="p-8 w-full">
              <div className="flex justify-center mb-6">
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg ${activeMission.color}`}>
                   <activeMission.icon size={40} />
                 </div>
              </div>
              <h2 className="text-2xl font-black text-center mb-2">{activeMission.location}</h2>
              <p className="text-gray-600 text-center mb-8">{activeMission.title}</p>
              
              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-800 border-b pb-2">Your Objectives:</h3>
                {activeMission.objectives.map((obj, i) => (
                  <div key={i} className="flex gap-3 text-gray-700">
                    <Circle size={20} className="text-gray-300 shrink-0 mt-0.5" />
                    <span>{obj.text}</span>
                  </div>
                ))}
              </div>

              <Button onClick={startMission} className="w-full h-14 text-lg">
                Enter Location
              </Button>
            </Card>
          </div>
        )}

        {view === 'mission' && activeMission && (
          <div className="flex-1 flex flex-col bg-white">
            {/* Objective Tracker */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex flex-col gap-2">
                {activeMission.objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {completedObjectives[i] ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                    <span className={completedObjectives[i] ? "text-gray-400 line-through" : "text-gray-800 font-medium"}>
                      {obj.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
               {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'user' ? 'bg-brand-orange text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                    <p className="text-[16px]">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isRecording && transcript && (
                <div className="flex justify-end opacity-70">
                  <div className="max-w-[80%] bg-brand-orange text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                    <p>{transcript}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mic Controls */}
            <div className="p-6 bg-white border-t flex flex-col items-center">
              <MicButton 
                isRecording={isRecording} 
                onToggle={() => {
                  if (isRecording) stopRecording();
                  else startRecording();
                }} 
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                {isRecording ? "Tap to stop & send" : "Tap to speak"}
              </p>
            </div>
          </div>
        )}

        {view === 'result' && (
          <div className="flex-1 flex flex-col p-6 items-center justify-center">
            <Card className="p-8 text-center flex flex-col items-center w-full">
              <CheckCircle2 size={60} className="text-green-500 mb-4" />
              <h2 className="text-2xl font-black mb-2">Mission Accomplished!</h2>
              <p className="text-gray-600 mb-6">You survived the {activeMission?.location}</p>
              <div className="text-5xl font-black text-brand-orange mb-8">+{score} XP</div>
              
              <Button onClick={() => setView('map')} className="w-full">
                Back to Map
              </Button>
            </Card>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
