"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Trophy, Coins } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { makeVocabQuestion, type MCQ } from "@/lib/games/quizBank";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// ENGLISH MONOPOLY
// Roll the dice, move around the board, and conquer world cities by
// answering English questions. Earn coins, build your empire.
// ─────────────────────────────────────────────────────────────
type TileType = "go" | "city" | "quiz" | "treasure" | "parking" | "toll";
type Tile = { r: number; c: number; type: TileType; name: string; emoji: string; reward?: number };

const BOARD: Tile[] = [
  { r: 1, c: 1, type: "go", name: "GO", emoji: "🏁" },
  { r: 1, c: 2, type: "city", name: "Mumbai", emoji: "🏙️" },
  { r: 1, c: 3, type: "quiz", name: "Quiz", emoji: "❓" },
  { r: 1, c: 4, type: "city", name: "London", emoji: "🎡" },
  { r: 1, c: 5, type: "treasure", name: "Treasure", emoji: "💰", reward: 50 },
  { r: 2, c: 5, type: "city", name: "Tokyo", emoji: "🗼" },
  { r: 3, c: 5, type: "toll", name: "Toll", emoji: "🚧" },
  { r: 4, c: 5, type: "city", name: "Dubai", emoji: "🏜️" },
  { r: 5, c: 5, type: "parking", name: "Bonus", emoji: "🅿️" },
  { r: 5, c: 4, type: "city", name: "Paris", emoji: "🥐" },
  { r: 5, c: 3, type: "quiz", name: "Quiz", emoji: "❓" },
  { r: 5, c: 2, type: "city", name: "Rome", emoji: "🏛️" },
  { r: 5, c: 1, type: "treasure", name: "Treasure", emoji: "💰", reward: 50 },
  { r: 4, c: 1, type: "city", name: "Sydney", emoji: "🌉" },
  { r: 3, c: 1, type: "quiz", name: "Quiz", emoji: "❓" },
  { r: 2, c: 1, type: "city", name: "Delhi", emoji: "🛕" },
];

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const TOTAL_ROLLS = 14;
const START_COINS = 200;

type Phase = "intro" | "playing" | "question" | "gameover";

export default function MonopolyGame() {
  const router = useRouter();
  const { awardGameXP } = useGamification();

  const [phase, setPhase] = useState<Phase>("intro");
  const [pos, setPos] = useState(0);
  const [coins, setCoins] = useState(START_COINS);
  const [owned, setOwned] = useState<Set<number>>(new Set());
  const [rollsLeft, setRollsLeft] = useState(TOTAL_ROLLS);
  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("Roll the dice to begin!");

  const [currentQ, setCurrentQ] = useState<MCQ | null>(null);
  const [currentTile, setCurrentTile] = useState(-1);
  const [selected, setSelected] = useState<string | null>(null);

  const rollsRef = useRef(TOTAL_ROLLS);
  const awardedRef = useRef(false);

  const start = () => {
    setPhase("playing");
    setPos(0);
    setCoins(START_COINS);
    setOwned(new Set());
    setRollsLeft(TOTAL_ROLLS);
    rollsRef.current = TOTAL_ROLLS;
    awardedRef.current = false;
    setMessage("Roll the dice to begin!");
  };

  const endTurn = () => {
    if (rollsRef.current <= 0) setPhase("gameover");
    else setPhase("playing");
  };

  const resolve = (idx: number) => {
    const tile = BOARD[idx];
    switch (tile.type) {
      case "go":
        setCoins((c) => c + 100);
        setMessage("Landed on GO! +₹100 🏁");
        endTurn();
        break;
      case "treasure":
        setCoins((c) => c + (tile.reward ?? 50));
        setMessage(`Treasure chest! +₹${tile.reward ?? 50} 💰`);
        endTurn();
        break;
      case "parking":
        setCoins((c) => c + 50);
        setMessage("Free bonus! +₹50 🅿️");
        endTurn();
        break;
      case "toll":
        setCoins((c) => Math.max(0, c - 30));
        setMessage("Toll booth! −₹30 🚧");
        endTurn();
        break;
      case "city":
        if (owned.has(idx)) {
          setCoins((c) => c + 20);
          setMessage(`${tile.name} is yours — rent +₹20`);
          endTurn();
        } else {
          setCurrentTile(idx);
          setCurrentQ(makeVocabQuestion());
          setSelected(null);
          setPhase("question");
        }
        break;
      case "quiz":
        setCurrentTile(idx);
        setCurrentQ(makeVocabQuestion());
        setSelected(null);
        setPhase("question");
        break;
    }
  };

  const doMove = (d: number) => {
    rollsRef.current -= 1;
    setRollsLeft(rollsRef.current);
    const raw = pos + d;
    const passedGo = raw >= BOARD.length;
    const np = raw % BOARD.length;
    if (passedGo) {
      setCoins((c) => c + 100);
      setMessage("Passed GO! +₹100 🏁");
    }
    setPos(np);
    setTimeout(() => resolve(np), 550);
  };

  const roll = () => {
    if (phase !== "playing" || isRolling || rollsRef.current <= 0) return;
    setIsRolling(true);
    let ticks = 0;
    const iv = setInterval(() => {
      setDice(1 + Math.floor(Math.random() * 6));
      ticks++;
      if (ticks > 9) {
        clearInterval(iv);
        const final = 1 + Math.floor(Math.random() * 6);
        setDice(final);
        setIsRolling(false);
        doMove(final);
      }
    }, 75);
  };

  const answer = (option: string) => {
    if (!currentQ || selected) return;
    setSelected(option);
    const correct = option === currentQ.answer;
    const tile = BOARD[currentTile];
    setTimeout(() => {
      if (correct) {
        if (tile.type === "city") {
          setOwned((o) => new Set(o).add(currentTile));
          setCoins((c) => c + 80);
          setMessage(`Conquered ${tile.name}! +₹80 🎉`);
        } else {
          setCoins((c) => c + 60);
          setMessage("Correct! +₹60 ✨");
        }
      } else {
        setMessage(`Oops! It was "${currentQ.answer}"`);
      }
      setCurrentQ(null);
      setSelected(null);
      setCurrentTile(-1);
      endTurn();
    }, 1200);
  };

  const finalScore = coins + owned.size * 25;

  // Award XP once when the game ends.
  useEffect(() => {
    if (phase === "gameover" && !awardedRef.current) {
      awardedRef.current = true;
      awardGameXP(finalScore, "real_life", "Real Life Mission!");
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
            <div className="flex items-center gap-1.5 text-yellow-600 font-black">
              <Coins size={18} className="fill-yellow-400/30" /> ₹{coins}
            </div>
            <div className="flex items-center gap-1.5 text-brand-dark font-black">
              🏆 {owned.size}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-5">
          {phase === "intro" && (
            <div className="flex-1 flex items-center justify-center">
              <Card padding="lg" className="text-center flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-[#8B7FFF] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 text-4xl rotate-3">
                  🎲
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">English Monopoly</h2>
                <p className="text-muted font-bold mb-8 leading-relaxed">
                  Roll the dice, travel the world, and conquer cities by
                  answering English questions. Build your empire! 🌍
                </p>
                <Button onClick={start} fullWidth size="lg" className="text-lg h-14">
                  Start Game
                </Button>
              </Card>
            </div>
          )}

          {(phase === "playing" || phase === "question") && (
            <div className="flex flex-col gap-4">
              {/* rolls left */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">
                  Rolls left: {rollsLeft}
                </span>
                <span className="text-[11px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">
                  Empire score: {finalScore}
                </span>
              </div>

              {/* BOARD */}
              <div className="relative grid grid-cols-5 grid-rows-5 gap-1.5 aspect-square">
                {BOARD.map((t, i) => (
                  <div
                    key={i}
                    style={{ gridRow: t.r, gridColumn: t.c }}
                    className={cn(
                      "relative rounded-xl bg-white border-2 border-gray-100 flex flex-col items-center justify-center shadow-sm transition-all",
                      owned.has(i) && "border-green-400 bg-green-50",
                      pos === i && "border-brand-orange ring-2 ring-brand-orange/40 scale-105 z-10"
                    )}
                  >
                    <span className="text-lg leading-none">{t.emoji}</span>
                    <span className="text-[7px] font-black text-brand-dark/50 uppercase tracking-tight mt-0.5">
                      {t.name}
                    </span>
                    {pos === i && (
                      <motion.span
                        layoutId="token"
                        className="absolute -top-2 -right-1 text-base drop-shadow"
                      >
                        🚀
                      </motion.span>
                    )}
                    {owned.has(i) && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                ))}

                {/* CENTER: dice + roll */}
                <div
                  style={{ gridArea: "2 / 2 / 5 / 5" }}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-brand-purple/5 to-brand-orange/5"
                >
                  <motion.div
                    animate={isRolling ? { rotate: [0, 20, -20, 0], scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0 }}
                    className="text-6xl leading-none"
                  >
                    {DICE_FACES[dice - 1]}
                  </motion.div>
                  <Button
                    onClick={roll}
                    disabled={isRolling || phase === "question"}
                    size="md"
                    className="px-6"
                  >
                    {isRolling ? "Rolling..." : "Roll 🎲"}
                  </Button>
                </div>
              </div>

              {/* message ticker */}
              <div className="text-center min-h-[24px]">
                <p className="text-sm font-black text-brand-dark">{message}</p>
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
                <h2 className="text-2xl font-black text-brand-dark mb-1">Empire Built!</h2>
                <p className="text-muted font-bold mb-6">
                  ₹{coins} coins · {owned.size} cities conquered
                </p>
                <div className="text-5xl font-black text-brand-purple mb-8">
                  +{finalScore} <span className="text-2xl">XP</span>
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

        {/* QUESTION MODAL */}
        <AnimatePresence>
          {phase === "question" && currentQ && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                className="bg-white rounded-card p-6 w-full max-w-md shadow-float"
              >
                <p className="text-[11px] font-black text-brand-purple uppercase tracking-[0.2em] mb-1 text-center">
                  {BOARD[currentTile]?.type === "city"
                    ? `Conquer ${BOARD[currentTile]?.name}`
                    : "Quiz time"}
                </p>
                <h3 className="text-3xl font-black text-brand-dark font-hindi text-center mb-6">
                  {currentQ.prompt}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => {
                    const isAnswer = opt === currentQ.answer;
                    const isPicked = opt === selected;
                    return (
                      <button
                        key={opt}
                        onClick={() => answer(opt)}
                        disabled={!!selected}
                        className={cn(
                          "py-4 rounded-xl font-black text-[15px] border-2 transition-all active:scale-95",
                          !selected && "bg-white border-gray-100 text-brand-dark hover:border-brand-purple/40",
                          selected && isAnswer && "bg-green-500 border-green-500 text-white",
                          selected && isPicked && !isAnswer && "bg-red-500 border-red-500 text-white",
                          selected && !isPicked && !isAnswer && "opacity-50 border-gray-100 text-brand-dark"
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
