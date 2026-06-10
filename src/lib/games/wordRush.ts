// ─────────────────────────────────────────────────────────────
// WORD RUSH — content bank
// A large, categorized pool of Hindi → English sentences. Each game
// session pulls a randomized, *fresh* set so the player keeps learning
// new sentences instead of seeing the same handful repeat.
//
// To add more content: just append objects below (or, later, swap
// getWordRushSession() to read from a Supabase `word_rush_sentences`
// table — the shape is the same).
// ─────────────────────────────────────────────────────────────

export type Sentence = {
  id: string;
  hindi: string;
  english: string;
  category: string;
  distractors?: string[]; // extra wrong words mixed into the word bank
};

export const WORD_RUSH_BANK: Sentence[] = [
  // ── Everyday basics ──
  { id: "e1", category: "Daily", hindi: "मैं अभी जा रहा हूँ", english: "I am going now", distractors: ["the", "to"] },
  { id: "e2", category: "Daily", hindi: "मुझे आपकी मदद चाहिए", english: "I need your help", distractors: ["the", "want"] },
  { id: "e3", category: "Daily", hindi: "मुझे समझ नहीं आया", english: "I did not understand", distractors: ["do", "you"] },
  { id: "e4", category: "Daily", hindi: "कृपया थोड़ा रुकिए", english: "Please wait a moment", distractors: ["the", "for"] },
  { id: "e5", category: "Daily", hindi: "मुझे देर हो रही है", english: "I am getting late", distractors: ["was", "to"] },
  { id: "e6", category: "Daily", hindi: "मैं थक गया हूँ", english: "I am very tired", distractors: ["was", "the"] },
  { id: "e7", category: "Daily", hindi: "चलो घर चलते हैं", english: "Let us go home", distractors: ["to", "the"] },
  { id: "e8", category: "Daily", hindi: "मुझे यह पसंद है", english: "I like this", distractors: ["am", "the"] },

  // ── Questions ──
  { id: "q1", category: "Questions", hindi: "क्या तुम कल आ सकते हो?", english: "Can you come tomorrow", distractors: ["will", "go"] },
  { id: "q2", category: "Questions", hindi: "यह कितने का है?", english: "How much is this", distractors: ["many", "are"] },
  { id: "q3", category: "Questions", hindi: "तुम कहाँ जा रहे हो?", english: "Where are you going", distractors: ["is", "to"] },
  { id: "q4", category: "Questions", hindi: "तुम्हारा नाम क्या है?", english: "What is your name", distractors: ["are", "my"] },
  { id: "q5", category: "Questions", hindi: "क्या आप मेरी मदद कर सकते हैं?", english: "Can you help me please", distractors: ["will", "the"] },
  { id: "q6", category: "Questions", hindi: "अभी कितने बजे हैं?", english: "What is the time now", distractors: ["are", "much"] },
  { id: "q7", category: "Questions", hindi: "तुम कैसे हो?", english: "How are you", distractors: ["is", "you"] },

  // ── Restaurant / food ──
  { id: "f1", category: "Food", hindi: "मुझे एक ग्लास पानी चाहिए", english: "I need a glass of water", distractors: ["want", "the"] },
  { id: "f2", category: "Food", hindi: "चलो कुछ खाने चलते हैं", english: "Let us go eat something", distractors: ["to", "the"] },
  { id: "f3", category: "Food", hindi: "बिल लेकर आइए", english: "Please bring the bill", distractors: ["a", "for"] },
  { id: "f4", category: "Food", hindi: "यह खाना बहुत स्वादिष्ट है", english: "This food is very tasty", distractors: ["are", "bad"] },
  { id: "f5", category: "Food", hindi: "मुझे भूख लगी है", english: "I am hungry", distractors: ["was", "the"] },
  { id: "f6", category: "Food", hindi: "मैं चाय नहीं पीता", english: "I do not drink tea", distractors: ["am", "coffee"] },

  // ── Shopping ──
  { id: "s1", category: "Shopping", hindi: "यह बहुत महंगा है", english: "This is very expensive", distractors: ["are", "cheap"] },
  { id: "s2", category: "Shopping", hindi: "क्या इसमें छूट मिलेगी?", english: "Can I get a discount", distractors: ["will", "the"] },
  { id: "s3", category: "Shopping", hindi: "मुझे यह वाला चाहिए", english: "I want this one", distractors: ["am", "the"] },
  { id: "s4", category: "Shopping", hindi: "क्या यह दूसरे रंग में है?", english: "Is this in another color", distractors: ["are", "the"] },

  // ── Work / school ──
  { id: "w1", category: "Work", hindi: "मैं पाँच बजे फ्री हूँ", english: "I am free at five", distractors: ["was", "the"] },
  { id: "w2", category: "Work", hindi: "मैं आपको बाद में फ़ोन करूँगा", english: "I will call you later", distractors: ["am", "now"] },
  { id: "w3", category: "Work", hindi: "मीटिंग कब शुरू होगी?", english: "When will the meeting start", distractors: ["is", "end"] },
  { id: "w4", category: "Work", hindi: "मैंने काम पूरा कर लिया", english: "I have finished the work", distractors: ["am", "for"] },
  { id: "w5", category: "Work", hindi: "मुझे थोड़ा और समय चाहिए", english: "I need a little more time", distractors: ["want", "the"] },

  // ── Travel / directions ──
  { id: "t1", category: "Travel", hindi: "स्टेशन कितनी दूर है?", english: "How far is the station", distractors: ["much", "are"] },
  { id: "t2", category: "Travel", hindi: "मुझे एयरपोर्ट जाना है", english: "I have to go to the airport", distractors: ["am", "for"] },
  { id: "t3", category: "Travel", hindi: "कृपया मुझे रास्ता बताइए", english: "Please show me the way", distractors: ["a", "for"] },
  { id: "t4", category: "Travel", hindi: "अगली ट्रेन कब है?", english: "When is the next train", distractors: ["are", "bus"] },
  { id: "t5", category: "Travel", hindi: "मैं रास्ता भूल गया", english: "I lost my way", distractors: ["am", "the"] },

  // ── Feelings / social ──
  { id: "g1", category: "Social", hindi: "आपसे मिलकर अच्छा लगा", english: "Nice to meet you", distractors: ["the", "are"] },
  { id: "g2", category: "Social", hindi: "मुझे माफ़ कर दीजिए", english: "I am very sorry", distractors: ["was", "the"] },
  { id: "g3", category: "Social", hindi: "आपका बहुत बहुत धन्यवाद", english: "Thank you very much", distractors: ["the", "are"] },
  { id: "g4", category: "Social", hindi: "कोई बात नहीं", english: "It does not matter", distractors: ["is", "the"] },
  { id: "g5", category: "Social", hindi: "मुझे आज बहुत खुशी है", english: "I am very happy today", distractors: ["was", "sad"] },
  { id: "g6", category: "Social", hindi: "फिर मिलेंगे", english: "See you again", distractors: ["the", "me"] },

  // ── Weather / longer ──
  { id: "l1", category: "Weather", hindi: "आज मौसम बहुत अच्छा है", english: "The weather is very nice today", distractors: ["are", "bad"] },
  { id: "l2", category: "Weather", hindi: "लगता है आज बारिश होगी", english: "I think it will rain today", distractors: ["was", "the"] },
  { id: "l3", category: "Daily", hindi: "मैं तुम्हारा इंतज़ार कर रहा हूँ", english: "I am waiting for you", distractors: ["was", "the"] },
  { id: "l4", category: "Daily", hindi: "क्या तुमने खाना खा लिया?", english: "Have you eaten your food", distractors: ["is", "the"] },
];

const SEEN_KEY = "wordrush_seen_v1";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function readSeen(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeSeen(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

/**
 * Build a fresh game session: prefers sentences the player hasn't seen yet,
 * resets the "seen" memory once the whole bank is exhausted, and ramps the
 * difficulty (shorter → longer) within the session.
 */
export function getWordRushSession(count = 8): Sentence[] {
  let seen = readSeen();
  let pool = WORD_RUSH_BANK.filter((s) => !seen.includes(s.id));

  // Exhausted the bank → start a new cycle.
  if (pool.length < count) {
    seen = [];
    pool = [...WORD_RUSH_BANK];
  }

  const picked = shuffle(pool)
    .slice(0, count)
    .sort((a, b) => a.english.split(" ").length - b.english.split(" ").length);

  writeSeen([...seen, ...picked.map((p) => p.id)]);
  return picked;
}
