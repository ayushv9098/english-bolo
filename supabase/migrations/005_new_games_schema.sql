-- 005_new_games_schema.sql
-- Drop old game tables if they exist
DROP TABLE IF EXISTS word_pairs CASCADE;
DROP TABLE IF EXISTS jumbled_sentences CASCADE;
DROP TABLE IF EXISTS sentence_prompts CASCADE;

-- 1. game_progress
CREATE TABLE game_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL, -- 'speed_speak', 'chat_race', 'real_life', 'ai_partner', 'survival', 'daily_challenge'
  xp_earned INTEGER DEFAULT 0,
  level_reached INTEGER DEFAULT 1,
  highest_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_type)
);

-- 2. speed_speak_sentences
CREATE TABLE speed_speak_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL, -- e.g., 'Bilkul nahi', 'Thoda', 'Kaam chalata'
  hindi_text TEXT NOT NULL,
  english_text TEXT NOT NULL,
  time_limit_seconds INTEGER DEFAULT 10
);

-- 3. chat_race_scenarios
CREATE TABLE chat_race_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  scenario_context TEXT,
  ai_message TEXT NOT NULL,
  correct_reply TEXT NOT NULL,
  mediocre_reply TEXT NOT NULL,
  wrong_reply TEXT NOT NULL
);

-- 4. real_life_missions
CREATE TABLE real_life_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL, -- e.g., 'Chai Shop', 'Restaurant'
  title TEXT NOT NULL,
  brief TEXT NOT NULL,
  objectives JSONB NOT NULL, -- Array of strings
  ai_persona_prompt TEXT NOT NULL,
  difficulty TEXT NOT NULL
);

-- 5. survival_chapters
CREATE TABLE survival_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  setting_description TEXT NOT NULL,
  boss_encounter BOOLEAN DEFAULT FALSE,
  required_intent TEXT NOT NULL,
  failure_penalty_hearts INTEGER DEFAULT 1
);

-- 6. daily_challenges
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE UNIQUE NOT NULL,
  title TEXT NOT NULL,
  task_prompt TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 100
);

-- RLS
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON game_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON game_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE speed_speak_sentences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view speed speak sentences" ON speed_speak_sentences FOR SELECT USING (true);

ALTER TABLE chat_race_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view chat race scenarios" ON chat_race_scenarios FOR SELECT USING (true);

ALTER TABLE real_life_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view real life missions" ON real_life_missions FOR SELECT USING (true);

ALTER TABLE survival_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view survival chapters" ON survival_chapters FOR SELECT USING (true);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view daily challenges" ON daily_challenges FOR SELECT USING (true);