"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, MessageSquare, Check, X, Clock } from "lucide-react";
import { TimerBar } from "@/components/games/TimerBar";
import { useGamification } from "@/context/GamificationContext";

// Mock scenarios (would be fetched from chat_race_scenarios)
const SCENARIOS = [
  { ai: "Hey, are you free this evening?", time: 8, options: [
      { text: "Sounds good, I'm free!", points: 15 },
      { text: "I am having free time.", points: 5 },
      { text: "What is evening?", points: 0 }
  ]},
  { ai: "We should check out that new cafe.", time: 8, options: [
      { text: "Yeah, let's do it!", points: 15 },
      { text: "We go to cafe yes.", points: 5 },
      { text: "I not go.", points: 0 }
  ]},
  { ai: "Can you send me the files by 5 PM?", time: 8, options: [
      { text: "Sure, I'll send them right away.", points: 15 },
      { text: "I sending you 5 PM.", points: 5 },
      { text: "No files.", points: 0 }
  ]},
  { ai: "Sorry I'm running a bit late!", time: 8, options: [
      { text: "No worries, take your time.", points: 15 },
      { text: "You are late.", points: 5 },
      { text: "Why late?", points: 0 }
  ]}
];

export default function ChatRaceGame() {
  const router = useRouter();
  const { awardXP } = useGamification();
  const [gameState, setGameState] = useState<'intro' | 'chatting' | 'gameover'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiPatience, setAiPatience] = useState(100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const patienceRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setGameState('chatting');
    triggerAiMessage(SCENARIOS[0].ai);
  };

  const triggerAiMessage = (msg: string) => {
    setIsAiTyping(true);
    setShowOptions(false);
    setTimeout(() => {
      setIsAiTyping(false);
      setMessages(prev => [...prev, { sender: 'ai', text: msg }]);
      setShowOptions(true);
      setTimeLeft(SCENARIOS[currentIndex].time);
      setAiPatience(100);
      startTimer();
    }, 1500); // Simulate typing delay
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (patienceRef.current) clearInterval(patienceRef.current);

    const totalTime = SCENARIOS[currentIndex].time;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    patienceRef.current = setInterval(() => {
      setAiPatience(prev => {
        if (prev <= 0) return 0;
        return prev - (100 / (totalTime * 10)); // shrink patience bar
      });
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (patienceRef.current) clearInterval(patienceRef.current);
  };

  const handleTimeout = () => {
    stopTimer();
    setMessages(prev => [...prev, { sender: 'ai', text: "Hello?? Are you there?" }]);
    setTimeout(() => advance(0), 1500);
  };

  const handleReply = (option: { text: string, points: number }) => {
    stopTimer();
    setShowOptions(false);
    setMessages(prev => [...prev, { sender: 'user', text: option.text }]);
    setScore(s => s + option.points);
    setTimeout(() => advance(option.points), 1000);
  };

  const advance = (pointsEarned: number) => {
    // Optional: AI reaction based on points
    let reaction = "👍";
    if (pointsEarned === 5) reaction = "🤔";
    if (pointsEarned === 0) reaction = "🤨";

    setMessages(prev => [...prev, { sender: 'ai', text: reaction }]);

    setTimeout(() => {
      if (currentIndex + 1 >= SCENARIOS.length) {
        setGameState('gameover');
        awardXP(score, "Chat Race Complete!");
      } else {
        setCurrentIndex(prev => prev + 1);
        triggerAiMessage(SCENARIOS[currentIndex + 1].ai);
      }
    }, 1000);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping, showOptions]);

  // Cleanup
  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#ECE5DD] flex flex-col max-w-md mx-auto relative">
        <header className="px-4 py-3 flex items-center bg-[#075E54] text-white shadow-md z-10 sticky top-0">
          <button onClick={() => router.push('/games')} className="p-2 -ml-2 rounded-full hover:bg-white/10">
            <ArrowLeft size={24} />
          </button>
          <div className="ml-2 flex-1">
            <h1 className="font-bold text-lg">Alex (AI)</h1>
            <p className="text-xs text-white/80">{isAiTyping ? 'typing...' : 'online'}</p>
          </div>
          <div className="font-bold bg-white/20 px-3 py-1 rounded-full text-sm">
            {score} XP
          </div>
        </header>

        {gameState === 'intro' && (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 z-20 absolute inset-0">
            <Card className="p-8 text-center flex flex-col items-center max-w-sm">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-black mb-2">Chat Reply Race</h2>
              <p className="text-gray-600 mb-8">
                Read the message and select the most natural English reply before their patience runs out!
              </p>
              <Button onClick={handleStart} className="w-full text-lg h-14 bg-blue-500 hover:bg-blue-600">
                Start Chatting
              </Button>
            </Card>
          </div>
        )}

        {gameState === 'chatting' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'user' ? 'bg-[#DCF8C6] text-black rounded-tr-sm' : 'bg-white text-black rounded-tl-sm'}`}>
                    <p className="text-[15px]">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {showOptions && (
              <div className="bg-gray-100 p-4 border-t animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className={aiPatience < 30 ? "text-red-500" : "text-gray-500"} />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-100 ease-linear ${aiPatience < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${aiPatience}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {SCENARIOS[currentIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleReply(opt)}
                      className="bg-white border text-left px-4 py-3 rounded-xl shadow-sm active:bg-gray-50 transition-colors font-medium text-gray-800"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {gameState === 'gameover' && (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 z-20 absolute inset-0">
            <Card className="p-8 text-center flex flex-col items-center w-full">
              <MessageSquare size={60} className="text-blue-500 mb-4" />
              <h2 className="text-2xl font-black mb-2">Chat Finished!</h2>
              <p className="text-gray-600 mb-6">Your Chat Score</p>
              <div className="text-5xl font-black text-blue-500 mb-8">{score} XP</div>
              <div className="flex gap-4 w-full">
                <Button variant="ghost" onClick={() => router.push('/games')} className="flex-1">
                  Exit
                </Button>
                <Button onClick={() => {
                  setScore(0);
                  setCurrentIndex(0);
                  setMessages([]);
                  setGameState('chatting');
                  triggerAiMessage(SCENARIOS[0].ai);
                }} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-transparent">
                  Play Again
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
