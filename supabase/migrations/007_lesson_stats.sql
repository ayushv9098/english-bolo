-- 007_lesson_stats.sql

-- Add missing columns to lessons table for gamification and content stats
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS xp_reward int DEFAULT 50;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS word_count int DEFAULT 5;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS quiz_count int DEFAULT 5;
