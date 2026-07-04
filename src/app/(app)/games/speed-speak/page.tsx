"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { TimerBar } from "@/components/games/TimerBar";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Zap, Trophy, Flame, Check, X, Star } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { getWordRushSession, type Sentence } from "@/lib/games/wordRush";

// ─────────────────────────────────────────────────────────────
// WORD RUSH
// Tap the scrambled English words in the correct order to translate
// the Hindi sentence — before the timer runs out. No mic needed.
// Each session pulls a fresh, randomized set from the content bank
// (see src/lib/games/wordRush.ts) so the player keeps learning new
// sentences instead of repeating the same ones.
// ─────────────────────────────────────────────────────────────
const ROUNDS_PER_SESSION = 8;

type Chip = { id: string; word: string };

const normalize = (t: string) =>
  t.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const timeFor = (english: string) => Math.max(9, english.split(" ").length * 3);

type GameState = "intro" | "countdown" | "playing" | "feedback" | "gameover";

export default function WordRushGame() {
  const router = useRouter();
  const { awardXP } = useGamification();

  const [gameState, setGameState] = useState<GameState>("intro");
  const [session, setSession] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);

  const [bank, setBank] = useState<Chip[]>([]);
  const [built, setBuilt] = useState<Chip[]>([]);
  const [feedback, setFeedback] = useState<"success" | "fail" | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lockedRef = useRef(false); // prevents double-eval / taps during transition
  const sessionRef = useRef<Sentence[]>([]); // synchronous source of truth for logic

  const sentence = session[currentIndex];
  const tokens = sentence ? sentence.english.split(" ") : [];

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setupRound = useCallback((index: number) => {
    const s = sessionRef.current[index];
    const toks = s.english.split(" ");
    const chips: Chip[] = [
      ...toks.map((w, i) => ({ id: `t${i}`, word: w })),
      ...(s.distractors ?? []).map((w, i) => ({ id: `d${i}`, word: w })),
    ];
    const t = timeFor(s.english);
    setBank(shuffle(chips));
    setBuilt([]);
    setFeedback(null);
    setDuration(t);
    setTimeLeft(t);
    lockedRef.current = false;
  }, []);

  const handleStart = () => {
    const picked = getWordRushSession(ROUNDS_PER_SESSION);
    sessionRef.current = picked;
    setSession(picked);
    setScore(0);
    setCombo(1);
    setCorrectCount(0);
    setCurrentIndex(0);
    setCountdown(3);
    setGameState("countdown");
  };

  // ── Countdown ──
  useEffect(() => {
    if (gameState !== "countdown") return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 800);
      return () => clearTimeout(t);
    }
    setupRound(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGameState("playing");
  }, [gameState, countdown, setupRound]);

  const advance = () => {
    if (currentIndex + 1 >= sessionRef.current.length) {
      setGameState("gameover");
      return;
    }
    const next = currentIndex + 1;
    setCurrentIndex(next);
    setupRound(next);
    setGameState("playing");
  };

  const handleSuccess = () => {
    lockedRef.current = true;
    stopTimer();
    const speedBonus = timeLeft > duration / 2 ? 5 : 0;
    const points = Math.round((10 + speedBonus) * combo);
    setScore((s) => s + points);
    setCorrectCount((c) => c + 1);
    setCombo((c) => Math.min(c + 0.5, 3));
    setFeedback("success");
    setGameState("feedback");
    setTimeout(advance, 1100);
  };

  const handleTimeout = () => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    stopTimer();
    setCombo(1);
    setFeedback("fail");
    setGameState("feedback");
    setTimeout(advance, 2000);
  };

  // Wrong arrangement (full row, incorrect) — forgiving: shake + reset, no penalty
  const handleWrong = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setBank((prev) => shuffle([...prev, ...built]));
      setBuilt([]);
    }, 450);
  };

  // ── Per-round timer ──
  useEffect(() => {
    if (gameState !== "playing") return;
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
  }, [gameState, currentIndex]);

  // ── Auto-evaluate when the build row is full ──
  useEffect(() => {
    if (gameState !== "playing" || lockedRef.current) return;
    if (built.length !== tokens.length) return;

    const guess = normalize(built.map((c) => c.word).join(" "));
    const answer = normalize(sentence.english);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (guess === answer) handleSuccess();
    else handleWrong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built, gameState]);

  // Award XP once the game is over
  useEffect(() => {
    if (gameState === "gameover" && score > 0) {
      awardXP(score, "Word Rush Complete!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // ── Chip interactions ──
  const pickWord = (chip: Chip) => {
    if (gameState !== "playing" || lockedRef.current) return;
    setBank((prev) => prev.filter((c) => c.id !== chip.id));
    setBuilt((prev) => [...prev, chip]);
  };

  const removeWord = (chip: Chip) => {
    if (gameState !== "playing" || lockedRef.current) return;
    setBuilt((prev) => prev.filter((c) => c.id !== chip.id));
    setBank((prev) => [...prev, chip]);
  };

  const useHint = () => {
    if (gameState !== "playing" || lockedRef.current) return;
    const expected = normalize(tokens[built.length] ?? "");
    if (!expected) return;
    const chip = bank.find((c) => normalize(c.word) === expected);
    if (!chip) return;
    setCombo(1); // hint resets combo
    pickWord(chip);
  };

  useEffect(() => () => stopTimer(), [stopTimer]);

  // ─────────────────────────────────────────────
  return (
    <PageTransition>
      <div className="min-h-screen bg-surface flex flex-col w-full max-w-md md:max-w-2xl mx-auto relative">
        {/* HEADER */}
        <header className="px-4 md:px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur-md z-10 sticky top-0 border-b border-white/50 md:rounded-b-3xl">
          <button
            onClick={() => router.push("/games")}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-90 transition-transform"
          >
            <ArrowLeft size={24} className="text-brand-dark" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-brand-orange font-black">
              <Flame size={18} className="fill-brand-orange/20" /> {combo}x
            </div>
            <div className="flex items-center gap-1.5 text-brand-dark font-black">
              <Trophy size={18} className="text-yellow-500 fill-yellow-400/30" />
              {score}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6 relative">
          {/* INTRO */}
          {gameState === "intro" && (
            <div className="flex-1 flex items-center justify-center">
              <Card padding="lg" className="text-center flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-orange to-[#FF8C61] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-orange-200 rotate-3">
                  <Zap size={40} className="text-white fill-white/30" />
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">Word Rush</h2>
                <p className="text-muted font-bold mb-8 leading-relaxed">
                  Tap the English words in the right order to translate the
                  Hindi sentence — before the timer runs out! ⚡
                </p>
                <Button onClick={handleStart} fullWidth size="lg" className="text-lg h-14">
                  Start Rush
                </Button>
              </Card>
            </div>
          )}

          {/* COUNTDOWN */}
          {gameState === "countdown" && (
            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[140px] font-black text-brand-orange leading-none"
                >
                  {countdown === 0 ? "GO!" : countdown}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* PLAYING / FEEDBACK */}
          {(gameState === "playing" || gameState === "feedback") && (
            <div className="flex flex-col h-full">
              {/* Progress + Timer */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">
                    Round {currentIndex + 1} / {session.length}
                  </span>
                  <span className="text-[11px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">
                    {Math.ceil(timeLeft)}s
                  </span>
                </div>
                <TimerBar duration={duration} timeLeft={timeLeft} />
              </div>

              {/* Hindi prompt */}
              <div className="text-center mb-6">
                <p className="text-[11px] font-black text-brand-dark/30 uppercase tracking-[0.2em] mb-2">
                  Translate this
                </p>
                <h2 className="text-3xl font-black text-brand-dark font-hindi leading-snug">
                  {sentence.hindi}
                </h2>
              </div>

              {/* BUILD AREA */}
              <motion.div
                animate={isShaking ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className={`min-h-[88px] rounded-card border-2 border-dashed p-3 flex flex-wrap gap-2 content-start items-start transition-colors ${
                  feedback === "success"
                    ? "border-green-400 bg-green-50"
                    : feedback === "fail"
                    ? "border-red-300 bg-red-50"
                    : isShaking
                    ? "border-red-300 bg-red-50"
                    : "border-brand-orange/30 bg-white"
                }`}
              >
                {/* On timeout, reveal the correct answer */}
                {feedback === "fail"
                  ? tokens.map((w, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-2 rounded-xl bg-green-500 text-white font-black text-[15px] shadow-sm"
                      >
                        {w}
                      </span>
                    ))
                  : built.map((chip) => (
                      <motion.button
                        key={chip.id}
                        layout
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeWord(chip)}
                        className={`px-3.5 py-2 rounded-xl font-black text-[15px] shadow-sm ${
                          feedback === "success"
                            ? "bg-green-500 text-white"
                            : "bg-brand-orange text-white"
                        }`}
                      >
                        {chip.word}
                      </motion.button>
                    ))}

                {built.length === 0 && !feedback && (
                  <span className="text-muted font-bold text-sm self-center mx-auto py-2">
                    Tap the words below 👇
                  </span>
                )}
              </motion.div>

              {/* WORD BANK */}
              <div className="flex flex-wrap gap-2.5 justify-center mt-6 flex-1 content-start">
                {bank.map((chip) => (
                  <motion.button
                    key={chip.id}
                    layout
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => pickWord(chip)}
                    disabled={gameState !== "playing"}
                    className="px-4 py-2.5 rounded-xl bg-white border-2 border-gray-100 text-brand-dark font-black text-[15px] shadow-card active:border-brand-orange/40"
                  >
                    {chip.word}
                  </motion.button>
                ))}
              </div>

              {/* Hint */}
              {gameState === "playing" && (
                <button
                  onClick={useHint}
                  className="mt-4 mx-auto text-[13px] font-black text-brand-orange/70 hover:text-brand-orange flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Star size={14} className="fill-brand-orange/20" />
                  Use a hint (resets combo)
                </button>
              )}

              {/* Feedback burst */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-0 top-1/3 flex justify-center pointer-events-none z-30"
                  >
                    <div
                      className={`flex items-center gap-2 px-6 py-3 rounded-pill font-black text-2xl shadow-float ${
                        feedback === "success"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {feedback === "success" ? (
                        <>
                          <Check size={28} strokeWidth={3} /> Perfect!
                        </>
                      ) : (
                        <>
                          <X size={28} strokeWidth={3} /> Time&apos;s up!
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* GAME OVER */}
          {gameState === "gameover" && (
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
                <h2 className="text-2xl font-black text-brand-dark mb-1">Rush Complete!</h2>
                <p className="text-muted font-bold mb-6">
                  {correctCount} / {session.length} sentences correct
                </p>
                <div className="text-5xl font-black text-brand-orange mb-8">
                  +{score} <span className="text-2xl">XP</span>
                </div>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/games")}
                    fullWidth
                  >
                    Exit
                  </Button>
                  <Button onClick={handleStart} fullWidth>
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
