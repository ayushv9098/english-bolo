"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Trophy, Repeat } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { VOCAB, shuffle } from "@/lib/games/quizBank";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// WORD MATCH
// Flip cards and match each Hindi word with its English meaning.
// A memory game that quietly drills vocabulary.
// ─────────────────────────────────────────────────────────────
const PAIRS = 6;

type MCard = { key: string; pairId: number; label: string; lang: "hi" | "en" };
type Phase = "intro" | "playing" | "win";

function buildDeck(): MCard[] {
  const chosen = shuffle(VOCAB).slice(0, PAIRS);
  return shuffle(
    chosen.flatMap((p, idx) => [
      { key: `h${idx}`, pairId: idx, label: p.hi, lang: "hi" as const },
      { key: `e${idx}`, pairId: idx, label: p.en, lang: "en" as const },
    ])
  );
}

export default function WordMatchGame() {
  const router = useRouter();
  const { awardXP } = useGamification();

  const [phase, setPhase] = useState<Phase>("intro");
  const [cards, setCards] = useState<MCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);

  const lockedRef = useRef(false);
  const awardedRef = useRef(false);

  const start = () => {
    setCards(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    lockedRef.current = false;
    awardedRef.current = false;
    setPhase("playing");
  };

  const handleFlip = (card: MCard) => {
    if (
      lockedRef.current ||
      flipped.includes(card.key) ||
      matched.has(card.pairId) ||
      flipped.length >= 2
    )
      return;

    const nf = [...flipped, card.key];
    setFlipped(nf);

    if (nf.length === 2) {
      setMoves((m) => m + 1);
      lockedRef.current = true;
      const a = cards.find((c) => c.key === nf[0])!;
      const b = cards.find((c) => c.key === nf[1])!;
      if (a.pairId === b.pairId) {
        const willWin = matched.size + 1 === PAIRS;
        setTimeout(() => {
          setMatched((prev) => new Set(prev).add(a.pairId));
          setFlipped([]);
          lockedRef.current = false;
          if (willWin) setPhase("win");
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          lockedRef.current = false;
        }, 950);
      }
    }
  };

  const score = PAIRS * 20 + Math.max(0, 2 * PAIRS - moves) * 10;

  useEffect(() => {
    if (phase === "win" && !awardedRef.current) {
      awardedRef.current = true;
      awardXP(score, "Word Match!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isUp = (card: MCard) => flipped.includes(card.key) || matched.has(card.pairId);

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto">
        <header className="px-4 py-3 flex items-center justify-between bg-white shadow-sm z-10 sticky top-0">
          <button
            onClick={() => router.push("/games")}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-90 transition-transform"
          >
            <ArrowLeft size={24} className="text-brand-dark" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-brand-dark/60 font-black">
              <Repeat size={16} /> {moves}
            </div>
            <div className="flex items-center gap-1.5 text-brand-dark font-black">
              ✅ {matched.size}/{PAIRS}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6">
          {phase === "intro" && (
            <div className="flex-1 flex items-center justify-center">
              <Card padding="lg" className="text-center flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-[#8B7FFF] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 text-4xl rotate-3">
                  🧠
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">Word Match</h2>
                <p className="text-muted font-bold mb-8 leading-relaxed">
                  Flip the cards and match each Hindi word with its English
                  meaning. Fewer moves = more XP! 🃏
                </p>
                <Button onClick={start} fullWidth size="lg" className="text-lg h-14">
                  Start Matching
                </Button>
              </Card>
            </div>
          )}

          {phase === "playing" && (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {cards.map((card) => {
                const up = isUp(card);
                const done = matched.has(card.pairId);
                return (
                  <motion.button
                    key={card.key}
                    onClick={() => handleFlip(card)}
                    whileTap={{ scale: 0.94 }}
                    animate={{ rotateY: up ? 0 : 0, scale: done ? 0.96 : 1 }}
                    className={cn(
                      "aspect-square rounded-2xl flex items-center justify-center p-1.5 text-center font-black border-2 transition-colors",
                      !up && "bg-brand-purple/10 border-brand-purple/20 text-brand-purple/40 text-2xl",
                      up && !done && "bg-white border-brand-orange shadow-card",
                      done && "bg-green-50 border-green-400"
                    )}
                  >
                    {up ? (
                      <span
                        className={cn(
                          "leading-tight",
                          card.lang === "hi" ? "font-hindi text-lg text-brand-dark" : "text-sm text-brand-dark"
                        )}
                      >
                        {card.label}
                      </span>
                    ) : (
                      "?"
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {phase === "win" && (
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
                <h2 className="text-2xl font-black text-brand-dark mb-1">All Matched!</h2>
                <p className="text-muted font-bold mb-6">Solved in {moves} moves</p>
                <div className="text-5xl font-black text-brand-purple mb-8">
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
