-- 1. Word Pairs Table
CREATE TABLE IF NOT EXISTS word_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hindi_word TEXT NOT NULL,
  english_answers JSONB NOT NULL, -- Array of strings: ["apple", "apples"]
  level TEXT DEFAULT 'Bilkul nahi',
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL, -- 'word-blitz'
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE word_pairs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view word_pairs" ON word_pairs;
CREATE POLICY "Anyone can view word_pairs" ON word_pairs FOR SELECT USING (true);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own sessions" ON game_sessions;
CREATE POLICY "Users can view own sessions" ON game_sessions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own sessions" ON game_sessions;
CREATE POLICY "Users can insert own sessions" ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Seed 20 Beginner Words
TRUNCATE word_pairs; -- Clear old if any
INSERT INTO word_pairs (hindi_word, english_answers, level, category) VALUES
('सेब', '["apple"]', 'Bilkul nahi', 'Fruits'),
('केला', '["banana"]', 'Bilkul nahi', 'Fruits'),
('पानी', '["water"]', 'Bilkul nahi', 'Basics'),
('किताब', '["book"]', 'Bilkul nahi', 'Objects'),
('घर', '["home", "house"]', 'Bilkul nahi', 'Objects'),
('दोस्त', '["friend"]', 'Bilkul nahi', 'People'),
('स्कूल', '["school"]', 'Bilkul nahi', 'Places'),
('बिल्ली', '["cat"]', 'Bilkul nahi', 'Animals'),
('कुत्ता', '["dog"]', 'Bilkul nahi', 'Animals'),
('सूरज', '["sun"]', 'Bilkul nahi', 'Nature'),
('चाँद', '["moon"]', 'Bilkul nahi', 'Nature'),
('दूध', '["milk"]', 'Bilkul nahi', 'Drinks'),
('चाय', '["tea"]', 'Bilkul nahi', 'Drinks'),
('खाना', '["food", "eat"]', 'Bilkul nahi', 'Basics'),
('गाड़ी', '["car"]', 'Bilkul nahi', 'Transport'),
('हवा', '["air", "wind"]', 'Bilkul nahi', 'Nature'),
('पेड़', '["tree"]', 'Bilkul nahi', 'Nature'),
('फूल', '["flower"]', 'Bilkul nahi', 'Nature'),
('हाथ', '["hand"]', 'Bilkul nahi', 'Body'),
('आँख', '["eye"]', 'Bilkul nahi', 'Body');
