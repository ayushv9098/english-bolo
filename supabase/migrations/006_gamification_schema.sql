-- 006_gamification_schema.sql

-- 1. user_stats (Extends users table with gamification data)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  total_xp INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Beginner', -- Beginner, Speaker, Communicator, Fluent, English Warrior, English Master
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  shields INTEGER DEFAULT 0,
  boosters INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create user_stats on new user signup
CREATE OR REPLACE FUNCTION public.create_user_stats()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_stats (user_id) VALUES (new.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach to existing users insert trigger or create a new one
DROP TRIGGER IF EXISTS on_auth_user_created_stats ON auth.users;
CREATE TRIGGER on_auth_user_created_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_stats();

-- 2. achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- First Mission, Streak, XP, etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL, -- e.g., 'xp', 'streak', 'missions'
  requirement_value INTEGER NOT NULL
);

-- 3. user_achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 4. city_locations (For map progression)
CREATE TABLE IF NOT EXISTS city_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  required_xp INTEGER DEFAULT 0,
  order_num INTEGER NOT NULL
);

-- 5. inventory_items (Avatars, themes)
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL, -- 'avatar', 'theme'
  name TEXT NOT NULL,
  asset_url TEXT,
  rarity TEXT DEFAULT 'common'
);

-- 6. user_inventory
CREATE TABLE IF NOT EXISTS user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT FALSE
);

-- 7. loot_boxes
CREATE TABLE IF NOT EXISTS loot_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  box_type TEXT DEFAULT 'standard',
  is_opened BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE city_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view city locations" ON city_locations FOR SELECT USING (true);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view inventory items" ON inventory_items FOR SELECT USING (true);

ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own inventory" ON user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON user_inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE loot_boxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own loot boxes" ON loot_boxes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own loot boxes" ON loot_boxes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own loot boxes" ON loot_boxes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed initial data for city locations and basic achievements
INSERT INTO city_locations (name, description, required_xp, order_num) VALUES
('Chai Stall', 'Your journey begins here.', 0, 1),
('Bus Stop', 'Learn to commute.', 100, 2),
('Restaurant', 'Order your favorite food.', 500, 3),
('Railway Station', 'Travel across the country.', 1500, 4),
('Airport', 'Prepare for international flights.', 3000, 5),
('Job Interview Office', 'Secure your dream job.', 5000, 6),
('International City', 'Speak like a native.', 10000, 7)
ON CONFLICT DO NOTHING;

INSERT INTO achievements (category, title, description, xp_reward, requirement_type, requirement_value) VALUES
('xp', 'First 100 XP', 'Earn your first 100 XP', 50, 'xp', 100),
('streak', '7 Day Streak', 'Play for 7 days in a row', 200, 'streak', 7),
('streak', '30 Day Streak', 'Play for 30 days in a row', 1000, 'streak', 30),
('rank', 'English Warrior', 'Reach the English Warrior rank', 500, 'rank', 15000)
ON CONFLICT DO NOTHING;