-- 1. Jumbled Sentences Table
CREATE TABLE IF NOT EXISTS jumbled_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hindi_sentence TEXT NOT NULL,
  correct_words JSONB NOT NULL, -- Array of strings: ["I", "am", "hungry"]
  level TEXT DEFAULT 'Bilkul nahi',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE jumbled_sentences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view jumbled_sentences" ON jumbled_sentences;
CREATE POLICY "Anyone can view jumbled_sentences" ON jumbled_sentences FOR SELECT USING (true);

-- 2. Seed 15 Sentences
INSERT INTO jumbled_sentences (hindi_sentence, correct_words, level) VALUES
('मैं भूखा हूँ', '["I", "am", "hungry"]', 'Bilkul nahi'),
('क्या आप मेरी मदद कर सकते हैं?', '["Can", "you", "help", "me?"]', 'Bilkul nahi'),
('वह स्कूल जा रहा है', '["He", "is", "going", "to", "school"]', 'Bilkul nahi'),
('मुझे प्यास लगी है', '["I", "am", "thirsty"]', 'Bilkul nahi'),
('बाहर बारिश हो रही है', '["It", "is", "raining", "outside"]', 'Bilkul nahi'),
('यह मेरा घर है', '["This", "is", "my", "house"]', 'Bilkul nahi'),
('आप कैसे हैं?', '["How", "are", "you?"]', 'Bilkul nahi'),
('मुझे यह फिल्म पसंद है', '["I", "like", "this", "movie"]', 'Bilkul nahi'),
('वह बहुत तेज़ दौड़ता है', '["He", "runs", "very", "fast"]', 'Bilkul nahi'),
('हम क्रिकेट खेल रहे हैं', '["We", "are", "playing", "cricket"]', 'Bilkul nahi'),
('सूरज पूर्व से उगता है', '["The", "sun", "rises", "in", "the", "east"]', 'Bilkul nahi'),
('मेरे पास एक कुत्ता है', '["I", "have", "a", "dog"]', 'Bilkul nahi'),
('आज मौसम बहुत अच्छा है', '["The", "weather", "is", "very", "good", "today"]', 'Bilkul nahi'),
('कृपया बैठ जाइए', '["Please", "sit", "down"]', 'Bilkul nahi'),
('मुझे देर हो रही है', '["I", "am", "getting", "late"]', 'Bilkul nahi');
