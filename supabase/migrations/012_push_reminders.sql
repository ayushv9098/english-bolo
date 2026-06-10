-- 012_push_reminders.sql
-- Web Push subscriptions + per-user daily reminder preferences.

-- 1. push_subscriptions (one row per browser/device subscription)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- 2. Reminder preferences on the users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reminder_time TEXT DEFAULT '20:30'; -- HH:MM, 24h
ALTER TABLE users ADD COLUMN IF NOT EXISTS reminder_tz TEXT;                    -- IANA tz, e.g. Asia/Kolkata
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reminder_sent TIMESTAMPTZ;      -- de-dupe guard

-- RLS: a user can only see/manage their own subscriptions.
-- (The scheduled sender uses the service-role key and bypasses RLS.)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own push subs" ON push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own push subs" ON push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own push subs" ON push_subscriptions FOR DELETE USING (auth.uid() = user_id);
