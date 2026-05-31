-- 1. Sentence Prompts Table
CREATE TABLE IF NOT EXISTS sentence_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_sentence TEXT NOT NULL, -- e.g., "Yesterday I _____ to the market"
  hint TEXT, -- e.g., "(past tense of 'go')"
  level TEXT DEFAULT 'Bilkul nahi',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sentence_prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view sentence_prompts" ON sentence_prompts;
CREATE POLICY "Anyone can view sentence_prompts" ON sentence_prompts FOR SELECT USING (true);

-- 2. Seed 20 Prompts
INSERT INTO sentence_prompts (prompt_sentence, hint, level) VALUES
('Yesterday I _____ to the market', '(past tense of ''go'')', 'Bilkul nahi'),
('She _____ a doctor', '(is/am/are)', 'Bilkul nahi'),
('We _____ playing cricket right now', '(is/am/are)', 'Bilkul nahi'),
('I have _____ my homework', '(past participle of ''finish'')', 'Bilkul nahi'),
('They _____ to Mumbai last week', '(past tense of ''travel'')', 'Bilkul nahi'),
('My brother _____ to music every day', '(listens/listen)', 'Bilkul nahi'),
('If it rains, I _____ stay at home', '(will/would)', 'Bilkul nahi'),
('He is _____ than me', '(comparative form of ''tall'')', 'Bilkul nahi'),
('I don''t _____ any money', '(have/has)', 'Bilkul nahi'),
('Can you _____ me the salt?', '(give/gave)', 'Bilkul nahi'),
('There _____ many apples in the basket', '(is/are)', 'Bilkul nahi'),
('Please _____ the door', '(open/opened)', 'Bilkul nahi'),
('I am _____ in Delhi', '(living/live)', 'Bilkul nahi'),
('She _____ a beautiful dress yesterday', '(bought/buy)', 'Bilkul nahi'),
('We should _____ our elders', '(respect/respects)', 'Bilkul nahi'),
('I _____ seen this movie before', '(have/has)', 'Bilkul nahi'),
('He _____ not like coffee', '(does/do)', 'Bilkul nahi'),
('Look! The birds are _____', '(flying/fly)', 'Bilkul nahi'),
('I want to _____ an engineer', '(become/became)', 'Bilkul nahi'),
('Did you _____ the news?', '(hear/heard)', 'Bilkul nahi');

-- 3. Create speaking_sessions table
CREATE TABLE IF NOT EXISTS speaking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES sentence_prompts(id),
  user_response TEXT,
  score INTEGER, -- 0-10
  ideal_answer TEXT,
  grammar_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for speaking_sessions
ALTER TABLE speaking_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own speaking sessions" ON speaking_sessions;
CREATE POLICY "Users can view own speaking sessions" ON speaking_sessions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own speaking sessions" ON speaking_sessions;
CREATE POLICY "Users can insert own speaking sessions" ON speaking_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
