"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Trophy, Flame } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { getFillBlanks, type FillBlank } from "@/lib/games/quizBank";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// FILL THE BLANK
// A word is missing from the English sentence — pick the right one.
// Builds sentence sense, not just isolated words.
// ─────────────────────────────────────────────────────────────
const ROUNDS = 8;

type Phase = "intro" | "playing" | "gameover";

export default function FillTheBlankGame() {
  const router = useRouter();
  const { awardXP } = useGamification();

  const [phase, setPhase] = useState<Phase>("intro");
  const [rounds, setRounds] = useState<FillBlank[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const lockedRef = useRef(false);
  const awardedRef = useRef(false);

  const current = rounds[index];

  const start = () => {
    setRounds(getFillBlanks(ROUNDS));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setSelected(null);
    lockedRef.current = false;
    awardedRef.current = false;
    setPhase("playing");
  };

  const answer = (option: string) => {
    if (lockedRef.current || !current) return;
    lockedRef.current = true;
    setSelected(option);
    const correct = option.toLowerCase() === current.answer.toLowerCase();
    if (correct) {
      const ns = streak + 1;
      setStreak(ns);
      setScore((s) => s + 10 + ns * 2);
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (index + 1 >= rounds.length) {
        setPhase("gameover");
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
        lockedRef.current = false;
      }
    }, 1100);
  };

  useEffect(() => {
    if (phase === "gameover" && !awardedRef.current) {
      awardedRef.current = true;
      if (score > 0) awardXP(score, "Fill the Blank!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-brand-orange font-black">
              <Flame size={18} className="fill-brand-orange/20" /> {streak}
            </div>
            <div className="flex items-center gap-1.5 text-brand-dark font-black">
              <Trophy size={18} className="text-yellow-500 fill-yellow-400/30" /> {score}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6">
          {phase === "intro" && (
            <div className="flex-1 flex items-center justify-center">
              <Card padding="lg" className="text-center flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-200 text-4xl rotate-3">
                  ✏️
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">Fill the Blank</h2>
                <p className="text-muted font-bold mb-8 leading-relaxed">
                  One word is missing from each English sentence. Pick the
                  right one to complete it! 🧩
                </p>
                <Button onClick={start} fullWidth size="lg" className="text-lg h-14">
                  Start Challenge
                </Button>
              </Card>
            </div>
          )}

          {phase === "playing" && current && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">
                  Question {index + 1} / {rounds.length}
                </span>
              </div>

              {/* Hindi hint */}
              <p className="text-center text-muted font-hindi text-lg font-bold mb-6">
                {current.hindi}
              </p>

              {/* Sentence with blank */}
              <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-3 mb-12 px-2">
                {current.tokens.map((word, i) => {
                  if (i === current.blankIndex) {
                    const filled = selected ?? "";
                    const correct = selected && selected.toLowerCase() === current.answer.toLowerCase();
                    return (
                      <span
                        key={i}
                        className={cn(
                          "min-w-[80px] text-center px-3 py-1.5 rounded-xl font-black text-xl border-b-4",
                          !selected && "border-brand-orange text-brand-orange/30 bg-orange-50/60",
                          selected && correct && "border-green-500 text-green-600 bg-green-50",
                          selected && !correct && "border-red-500 text-red-600 bg-red-50"
                        )}
                      >
                        {selected ? (correct ? filled : current.answer) : "_____"}
                      </span>
                    );
                  }
                  return (
                    <span key={i} className="text-xl font-black text-brand-dark">
                      {word}
                    </span>
                  );
                })}
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                {current.options.map((opt) => {
                  const isAnswer = opt.toLowerCase() === current.answer.toLowerCase();
                  const isPicked = opt === selected;
                  const revealed = selected !== null;
                  return (
                    <button
                      key={opt}
                      onClick={() => answer(opt)}
                      disabled={revealed}
                      className={cn(
                        "py-4 rounded-card font-black text-base border-2 transition-all active:scale-95",
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
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-200"
                >
                  <Trophy size={42} className="text-white fill-white/30" />
                </motion.div>
                <h2 className="text-2xl font-black text-brand-dark mb-1">Challenge Complete!</h2>
                <p className="text-muted font-bold mb-6">
                  {correctCount} / {rounds.length} correct
                </p>
                <div className="text-5xl font-black text-brand-orange mb-8">
                  +{score} <span className="text-2xl">XP</span>
                </div>
                <div className="flex gap-3 w-full">
                  <Button variant="ghost" onClick={() => router.push("/games")} fullWidth>
                    Exit
                  </Button>
                  <Button onClick={start} fullWidth>
                    Play Again
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
