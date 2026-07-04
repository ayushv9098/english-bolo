"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { TimerBar } from "@/components/games/TimerBar";
import { ArrowLeft, Heart, Trophy } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { makeVocabQuestion, type MCQ } from "@/lib/games/quizBank";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// SURVIVAL QUIZ
// Endless vocab questions. 3 hearts. The timer gets faster as your
// streak grows. How long can you survive?
// ─────────────────────────────────────────────────────────────
const MAX_HEARTS = 3;
const QUESTION_TIME = 7;

type Phase = "intro" | "playing" | "gameover";

export default function SurvivalGame() {
  const router = useRouter();
  const { awardGameXP } = useGamification();

  const [phase, setPhase] = useState<Phase>("intro");
  const [q, setQ] = useState<MCQ | null>(null);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [duration, setDuration] = useState(QUESTION_TIME);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartsRef = useRef(MAX_HEARTS);
  const lockedRef = useRef(false);
  const awardedRef = useRef(false);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const nextQuestion = (nextStreak: number) => {
    const t = Math.max(3, QUESTION_TIME - Math.floor(nextStreak / 3));
    setQ(makeVocabQuestion());
    setSelected(null);
    setDuration(t);
    setTimeLeft(t);
    lockedRef.current = false;
  };

  const start = () => {
    setPhase("playing");
    setHearts(MAX_HEARTS);
    heartsRef.current = MAX_HEARTS;
    setStreak(0);
    setScore(0);
    awardedRef.current = false;
    nextQuestion(0);
  };

  const loseHeart = () => {
    heartsRef.current -= 1;
    setHearts(heartsRef.current);
    setStreak(0);
    if (heartsRef.current <= 0) {
      setPhase("gameover");
    } else {
      setTimeout(() => nextQuestion(0), 1200);
    }
  };

  const handleTimeout = () => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    stopTimer();
    setSelected("__timeout__");
    loseHeart();
  };

  // timer
  useEffect(() => {
    if (phase !== "playing" || !q) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          handleTimeout();
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, phase]);

  const answer = (option: string) => {
    if (lockedRef.current || !q) return;
    lockedRef.current = true;
    stopTimer();
    setSelected(option);
    if (option === q.answer) {
      const ns = streak + 1;
      setStreak(ns);
      setBest((b) => Math.max(b, ns));
      setScore((s) => s + 10 + ns * 2); // streak bonus
      setTimeout(() => nextQuestion(ns), 700);
    } else {
      loseHeart();
    }
  };

  useEffect(() => {
    if (phase === "gameover" && !awardedRef.current) {
      awardedRef.current = true;
      stopTimer();
      if (score > 0) awardGameXP(score, "survival", "Survival Quiz!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => stopTimer(), []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface flex flex-col w-full max-w-md md:max-w-2xl mx-auto relative">
        <header className="px-4 md:px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur-md z-10 sticky top-0 border-b border-white/50 md:rounded-b-3xl">
          <button
            onClick={() => router.push("/games")}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-90 transition-transform"
          >
            <ArrowLeft size={24} className="text-brand-dark" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                size={22}
                className={cn(
                  "transition-all",
                  i < hearts ? "text-red-500 fill-red-500" : "text-gray-200 fill-gray-200"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-brand-dark font-black">
            <Trophy size={18} className="text-yellow-500 fill-yellow-400/30" /> {score}
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6">
          {phase === "intro" && (
            <div className="flex-1 flex items-center justify-center">
              <Card padding="lg" className="text-center flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-red-200 text-4xl rotate-3">
                  ❤️
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">Survival Quiz</h2>
                <p className="text-muted font-bold mb-8 leading-relaxed">
                  3 lives. Endless questions. The clock speeds up as your
                  streak grows. How long can you survive? 🔥
                </p>
                <Button onClick={start} fullWidth size="lg" className="text-lg h-14">
                  Start Surviving
                </Button>
              </Card>
            </div>
          )}

          {phase === "playing" && q && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">
                  Streak: {streak} 🔥
                </span>
                <span className="text-[11px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">
                  {Math.ceil(timeLeft)}s
                </span>
              </div>
              <TimerBar duration={duration} timeLeft={timeLeft} className="mb-10" />

              <div className="text-center mb-10">
                <p className="text-[11px] font-black text-brand-dark/30 uppercase tracking-[0.2em] mb-2">
                  What does this mean?
                </p>
                <h2 className="text-4xl font-black text-brand-dark font-hindi">{q.prompt}</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                {q.options.map((opt) => {
                  const isAnswer = opt === q.answer;
                  const isPicked = opt === selected;
                  const revealed = selected !== null;
                  return (
                    <button
                      key={opt}
                      onClick={() => answer(opt)}
                      disabled={revealed}
                      className={cn(
                        "py-5 rounded-card font-black text-base border-2 transition-all active:scale-95",
                        !revealed && "bg-white border-gray-100 text-brand-dark hover:border-brand-orange/40",
                        revealed && isAnswer && "bg-green-500 border-green-500 text-white",
                        revealed && isPicked && !isAnswer && "bg-red-500 border-red-500 text-white",
                        revealed && !isPicked && !isAnswer && "opacity-50 border-gray-100 text-brand-dark"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "gameover" && (
            <div className="flex-1 flex items-center justify-center">
              <Card padding="lg" className="text-center flex flex-col items-center w-full">
                <AnimatePresence>
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-200"
                  >
                    <Trophy size={42} className="text-white fill-white/30" />
                  </motion.div>
                </AnimatePresence>
                <h2 className="text-2xl font-black text-brand-dark mb-1">Game Over!</h2>
                <p className="text-muted font-bold mb-6">Best streak: {best} 🔥</p>
                <div className="text-5xl font-black text-red-500 mb-8">
                  +{score} <span className="text-2xl">XP</span>
                </div>
                <div className="flex gap-3 w-full">
                  <Button variant="ghost" onClick={() => router.push("/games")} fullWidth>
                    Exit
                  </Button>
                  <Button onClick={start} fullWidth>
                    Try Again
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
