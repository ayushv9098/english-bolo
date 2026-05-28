-- Drop existing tables if re-running
DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS phrases CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  phone TEXT UNIQUE,
  name TEXT,
  goal TEXT,
  level TEXT,
  streak INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ,
  xp_points INTEGER DEFAULT 0,
  avatar_emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a public.users row when a new auth.users signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, phone)
  VALUES (new.id, new.phone);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Lessons Table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  situation TEXT,
  hindi_description TEXT,
  difficulty TEXT,
  category TEXT,
  audio_url TEXT,
  order_num INTEGER,
  duration_mins INTEGER
);

-- 3. Phrases Table
CREATE TABLE phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  english TEXT NOT NULL,
  hindi TEXT NOT NULL,
  pronunciation_guide TEXT
);

-- 4. User Progress Table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  pronunciation_score INTEGER,
  fluency_score INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  attempts INTEGER DEFAULT 1,
  UNIQUE(user_id, lesson_id)
);

-- 5. User Badges Table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- 6. Friendships Table
CREATE TABLE friendships (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, friend_id)
);

-- Set up basic RLS (Row Level Security) - allow all for MVP, or restrict as needed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);

ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view phrases" ON phrases FOR SELECT USING (true);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);