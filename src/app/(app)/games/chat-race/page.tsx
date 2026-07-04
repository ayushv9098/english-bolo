"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { getQuickReplySession, type Scenario } from "@/lib/games/quickReply";

// ─────────────────────────────────────────────────────────────
// QUICK REPLY
// Read the chat message and pick the most natural English reply.
// Content is randomized each session so it never repeats.
// ─────────────────────────────────────────────────────────────
const ROUNDS = 6;

type Phase = "intro" | "chatting" | "gameover";
type Msg = { sender: "ai" | "user"; text: string };

export default function QuickReplyGame() {
  const router = useRouter();
  const { awardGameXP } = useGamification();

  const [phase, setPhase] = useState<Phase>("intro");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const indexRef = useRef(0);
  const awardedRef = useRef(false);
  const scenRef = useRef<Scenario[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const start = () => {
    const session = getQuickReplySession(ROUNDS);
    scenRef.current = session;
    setScenarios(session);
    setIndex(0);
    indexRef.current = 0;
    setScore(0);
    setMessages([]);
    awardedRef.current = false;
    setPhase("chatting");
    triggerAiMessage(session[0].ai);
  };

  const triggerAiMessage = (text: string) => {
    setIsAiTyping(true);
    setShowOptions(false);
    setTimeout(() => {
      setIsAiTyping(false);
      setMessages((prev) => [...prev, { sender: "ai", text }]);
      setShowOptions(true);
    }, 1300);
  };

  const handleReply = (text: string, points: number) => {
    setShowOptions(false);
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setScore((s) => s + points);

    // AI reaction
    const reaction = points >= 15 ? "👍 Perfect!" : points >= 5 ? "🙂 Got it." : "🤨 Hmm?";
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "ai", text: reaction }]);
      setTimeout(() => {
        const next = indexRef.current + 1;
        if (next >= scenRef.current.length) {
          setPhase("gameover");
        } else {
          indexRef.current = next;
          setIndex(next);
          triggerAiMessage(scenRef.current[next].ai);
        }
      }, 900);
    }, 600);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping, showOptions]);

  useEffect(() => {
    if (phase === "gameover" && !awardedRef.current) {
      awardedRef.current = true;
      if (score > 0) awardGameXP(score, "chat_race", "Quick Reply!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const current = scenarios[index];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#ECE5DD] flex flex-col w-full max-w-md md:max-w-2xl mx-auto relative">
        <header className="px-4 md:px-6 py-4 flex items-center bg-[#075E54] text-white shadow-md z-10 sticky top-0 md:rounded-b-3xl">
          <button
            onClick={() => router.push("/games")}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-90 transition-transform"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ml-1 text-lg">
            🤖
          </div>
          <div className="ml-2 flex-1">
            <h1 className="font-bold text-[15px] leading-tight">Alex</h1>
            <p className="text-[11px] text-white/80">{isAiTyping ? "typing…" : "online"}</p>
          </div>
          <div className="font-bold bg-white/20 px-3 py-1 rounded-full text-sm">{score} XP</div>
        </header>

        {phase === "intro" && (
          <div className="flex-1 flex items-center justify-center p-6 bg-surface z-20 absolute inset-0">
            <Card padding="lg" className="text-center flex flex-col items-center w-full">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                <MessageSquare size={38} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-brand-dark mb-2">Quick Reply</h2>
              <p className="text-muted font-bold mb-8 leading-relaxed">
                Read each message and pick the most natural English reply.
                Sound like a native! 💬
              </p>
              <Button onClick={start} fullWidth size="lg" className="text-lg h-14 bg-[#075E54]">
                Start Chatting
              </Button>
            </Card>
          </div>
        )}

        {phase === "chatting" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 shadow-sm text-[15px] ${
                      msg.sender === "user"
                        ? "bg-[#DCF8C6] text-black rounded-tr-sm"
                        : "bg-white text-black rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {showOptions && current && (
              <div className="bg-gray-100 p-4 border-t animate-in slide-in-from-bottom-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2 text-center">
                  Pick your reply
                </p>
                <div className="flex flex-col gap-2">
                  {current.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleReply(opt.text, opt.points)}
                      className="bg-white border-2 border-transparent text-left px-4 py-3 rounded-xl shadow-sm active:scale-[0.98] hover:border-blue-200 transition-all font-bold text-gray-800"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {phase === "gameover" && (
          <div className="flex-1 flex items-center justify-center p-6 bg-surface z-20 absolute inset-0">
            <Card padding="lg" className="text-center flex flex-col items-center w-full">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                <MessageSquare size={38} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-brand-dark mb-1">Chat Finished!</h2>
              <p className="text-muted font-bold mb-6">Nice conversation 🎉</p>
              <div className="text-5xl font-black text-[#075E54] mb-8">
                +{score} <span className="text-2xl">XP</span>
              </div>
              <div className="flex gap-3 w-full">
                <Button variant="ghost" onClick={() => router.push("/games")} fullWidth>
                  Exit
                </Button>
                <Button onClick={start} fullWidth className="bg-[#075E54]">
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
