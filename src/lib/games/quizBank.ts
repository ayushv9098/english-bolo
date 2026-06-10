// ─────────────────────────────────────────────────────────────
// Shared content bank for the quiz-style games (Monopoly, Survival
// Quiz, Word Match, Fill the Blank). One vocabulary list + sentence
// list powers everything, so adding content here enriches every game.
// ─────────────────────────────────────────────────────────────
import { WORD_RUSH_BANK } from "./wordRush";

export type VocabPair = { hi: string; en: string };

export const VOCAB: VocabPair[] = [
  { hi: "पानी", en: "Water" },
  { hi: "खाना", en: "Food" },
  { hi: "घर", en: "House" },
  { hi: "किताब", en: "Book" },
  { hi: "दोस्त", en: "Friend" },
  { hi: "पैसा", en: "Money" },
  { hi: "समय", en: "Time" },
  { hi: "काम", en: "Work" },
  { hi: "रास्ता", en: "Road" },
  { hi: "गाड़ी", en: "Car" },
  { hi: "स्कूल", en: "School" },
  { hi: "बाज़ार", en: "Market" },
  { hi: "डॉक्टर", en: "Doctor" },
  { hi: "खुश", en: "Happy" },
  { hi: "दुखी", en: "Sad" },
  { hi: "बड़ा", en: "Big" },
  { hi: "छोटा", en: "Small" },
  { hi: "तेज़", en: "Fast" },
  { hi: "धीमा", en: "Slow" },
  { hi: "गरम", en: "Hot" },
  { hi: "ठंडा", en: "Cold" },
  { hi: "नया", en: "New" },
  { hi: "पुराना", en: "Old" },
  { hi: "सुंदर", en: "Beautiful" },
  { hi: "आसान", en: "Easy" },
  { hi: "मुश्किल", en: "Difficult" },
  { hi: "सच", en: "Truth" },
  { hi: "झूठ", en: "Lie" },
  { hi: "दिन", en: "Day" },
  { hi: "रात", en: "Night" },
  { hi: "सुबह", en: "Morning" },
  { hi: "शाम", en: "Evening" },
  { hi: "कल", en: "Tomorrow" },
  { hi: "सप्ताह", en: "Week" },
  { hi: "महीना", en: "Month" },
  { hi: "साल", en: "Year" },
  { hi: "माँ", en: "Mother" },
  { hi: "पिता", en: "Father" },
  { hi: "भाई", en: "Brother" },
  { hi: "बहन", en: "Sister" },
  { hi: "बच्चा", en: "Child" },
  { hi: "शहर", en: "City" },
  { hi: "गाँव", en: "Village" },
  { hi: "नौकरी", en: "Job" },
  { hi: "रंग", en: "Colour" },
  { hi: "फूल", en: "Flower" },
  { hi: "पेड़", en: "Tree" },
  { hi: "आसमान", en: "Sky" },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type MCQ = {
  prompt: string; // the Hindi word/sentence shown
  answer: string; // the correct English option
  options: string[]; // shuffled, includes the answer
};

/** One multiple-choice vocab question (Hindi → English) with 3 distractors. */
export function makeVocabQuestion(): MCQ {
  const pair = VOCAB[Math.floor(Math.random() * VOCAB.length)];
  const distractors = shuffle(VOCAB.filter((v) => v.en !== pair.en))
    .slice(0, 3)
    .map((v) => v.en);
  return {
    prompt: pair.hi,
    answer: pair.en,
    options: shuffle([pair.en, ...distractors]),
  };
}

/** A deck of `n` vocab questions with unique answers. */
export function getVocabQuiz(n: number): MCQ[] {
  const pairs = shuffle(VOCAB).slice(0, n);
  return pairs.map((pair) => {
    const distractors = shuffle(VOCAB.filter((v) => v.en !== pair.en))
      .slice(0, 3)
      .map((v) => v.en);
    return {
      prompt: pair.hi,
      answer: pair.en,
      options: shuffle([pair.en, ...distractors]),
    };
  });
}

export type FillBlank = {
  hindi: string;
  tokens: string[]; // full english sentence split into words
  blankIndex: number; // which token is hidden
  answer: string;
  options: string[]; // shuffled choices for the blank
};

/** `n` fill-in-the-blank rounds built from the Word Rush sentence bank. */
export function getFillBlanks(n: number): FillBlank[] {
  const usable = WORD_RUSH_BANK.filter((s) => s.english.split(" ").length >= 3);
  const allWords = Array.from(
    new Set(WORD_RUSH_BANK.flatMap((s) => s.english.split(" ")))
  );
  return shuffle(usable)
    .slice(0, n)
    .map((s) => {
      const tokens = s.english.split(" ");
      // Blank a non-first word so there's always context before it.
      const blankIndex = 1 + Math.floor(Math.random() * (tokens.length - 1));
      const answer = tokens[blankIndex];
      const distractors = shuffle(
        allWords.filter((w) => w.toLowerCase() !== answer.toLowerCase())
      ).slice(0, 3);
      return {
        hindi: s.hindi,
        tokens,
        blankIndex,
        answer,
        options: shuffle([answer, ...distractors]),
      };
    });
}
