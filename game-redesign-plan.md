# Game Redesign Implementation Plan

This plan outlines the complete replacement of the old Games section with 6 new speaking-focused games, adhering to the requirements: production-quality, mobile-first, using existing design system/auth, and handling all layers (DB, types, logic, UI).

## Phase 1: Database Setup & Typings (Supabase)

1. **New Migration File:** `supabase/migrations/005_new_games_schema.sql`
   - We will drop old game tables (`word_pairs`, `jumbled_sentences`, `sentence_prompts`).
   - Create tables for the new games:
     - `game_progress` (Generic game stats for XP, streaks, level progression).
     - `speed_speak_sentences` (Level, Hindi, English).
     - `chat_race_scenarios` (Difficulty, Initial message, 3 options with scores).
     - `real_life_missions` (Mission location, Brief, Objectives checklist).
     - `survival_chapters` (Story nodes, expected user intents, required hearts).
     - `daily_challenges` (Date, Topic, Type).
     - `user_hearts` (Tracks hearts for survival mode, updates over time/with tasks).
2. **RLS Policies:** Add strict row-level security for reading challenges and writing scores/progress to these new tables.
3. **TypeScript Types:** Update `src/types/index.ts` to include interfaces for:
   - `SpeedSpeakSentence`, `ChatRaceScenario`, `RealLifeMission`, `SurvivalChapter`, `DailyChallenge`.
   - Update `GameSession` type.

## Phase 2: Cleanup Old Code

1. **Delete Folders:**
   - `src/app/(app)/games/jumbled-sentence`
   - `src/app/(app)/games/role-play`
   - `src/app/(app)/games/sentence-duel`
   - `src/app/(app)/games/word-blitz`
2. **Delete APIs:**
   - `src/app/api/games/role-play`
   - `src/app/api/games/sentence-duel`
3. **Delete Old Migrations/SQL:** We'll do this safely via the new migration.

## Phase 3: Routing & Navigation Updates

1. **Games Hub Dashboard:** `src/app/(app)/games/page.tsx`
   - Redesign the main games page to feature the 6 new games as visually distinct cards.
   - Show the user's current global XP and Game Streak.
2. **Navigation:** Verify `BottomNav.tsx` works smoothly with the new hub.

## Phase 4: Implementation of 6 New Games (Sequential Execution)

For each game, we will create a dedicated folder under `src/app/(app)/games/` and a corresponding API route (if needed for AI generation/validation).

### Game 1: Speed Speak Challenge
- **Path:** `src/app/(app)/games/speed-speak/page.tsx`
- **Components:** `TimerBar`, `MicButton`, `ComboMultiplier`.
- **Logic:** Fast-paced state machine, speech recognition (Web Speech API as standard/fallback).

### Game 2: Chat Reply Race
- **Path:** `src/app/(app)/games/chat-race/page.tsx`
- **Components:** `ChatUI` (WhatsApp style), `QuickReplyChips`.
- **Logic:** Time-based scoring, immediate visual feedback.

### Game 3: Real Life Missions
- **Path:** `src/app/(app)/games/real-life/page.tsx`
- **Components:** `MissionMap`, `MissionChecklist`, `AvatarNPC`.
- **Logic:** Integration with AI endpoint for dynamic NPC dialogue.

### Game 4: AI Conversation Partner
- **Path:** `src/app/(app)/games/ai-partner/page.tsx`
- **Components:** `TopicSelector`, `CallInterface` (waveform animation), `PostCallReport`.
- **Logic:** Full duplex real-time logic simulation using AI route.

### Game 5: English Survival Mode
- **Path:** `src/app/(app)/games/survival/page.tsx`
- **Components:** `HeartsDisplay`, `StoryCard`, `VoicePromptArea`.
- **Logic:** Narrative branching, penalize heart loss on fail, Boss encounter triggers.

### Game 6: Daily Challenge
- **Path:** `src/app/(app)/games/daily-challenge/page.tsx`
- **Components:** `DailyCard`, `WeeklyStampGrid`, `RewardChest`.
- **Logic:** Lock/Unlock based on local date, special streak rewards.

## Final Output Expected Tree
```
src/
├── app/
│   ├── (app)/
│   │   ├── games/
│   │   │   ├── page.tsx (Hub Dashboard)
│   │   │   ├── speed-speak/page.tsx
│   │   │   ├── chat-race/page.tsx
│   │   │   ├── real-life/page.tsx
│   │   │   ├── ai-partner/page.tsx
│   │   │   ├── survival/page.tsx
│   │   │   └── daily-challenge/page.tsx
│   │   └── ...
│   ├── api/
│   │   └── ai/
│   │       ├── validate-speech/route.ts
│   │       ├── npc-chat/route.ts
│   │       └── ...
├── components/
│   ├── games/
│   │   ├── TimerBar.tsx
│   │   ├── MicButton.tsx
│   │   ├── ChatUI.tsx
│   │   └── ...
└── types/
    └── index.ts (Updated)
supabase/
└── migrations/
    └── 005_new_games_schema.sql
```
