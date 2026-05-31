-- 009_game_meta.sql

-- 1. game_meta (Stores metadata and reward info for games)
CREATE TABLE IF NOT EXISTS game_meta (
  game_key TEXT PRIMARY KEY, -- 'speed_speak', 'chat_race', 'real_life', 'ai_partner', 'survival', 'daily_challenge'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  base_xp_reward INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed initial game metadata
INSERT INTO game_meta (game_key, title, description, emoji, base_xp_reward) VALUES
('speed_speak', 'Speed Speak', 'Fast-paced Hindi to English speaking race.', '⚡', 20),
('chat_race', 'Chat Reply', 'Pick the best English reply in a fast chat.', '💬', 30),
('real_life', 'Real Life Missions', 'Survive real scenarios like cafes and stations.', '📍', 50),
('ai_partner', 'AI Partner', 'Talk to our AI bot for real speaking practice.', '🤖', 100),
('survival', 'Survival Mode', 'Keep your hearts by speaking correct English.', '❤️', 40),
('daily_challenge', 'Daily Challenge', 'One speaking mission a day for huge XP.', '🏆', 150)
ON CONFLICT (game_key) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  emoji = EXCLUDED.emoji,
  base_xp_reward = EXCLUDED.base_xp_reward;

-- RLS
ALTER TABLE game_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view game meta" ON game_meta FOR SELECT USING (true);
