export type Level = "Bilkul nahi" | "Thoda" | "Kaam chalata";

export type Goal = "Interview" | "Job" | "Travel" | "Confidence";

export type User = {
  id: string;
  phone: string;
  name?: string;
  goal?: Goal;
  level?: Level;
  xp: number;
  streak: number;
  last_active: string;
  created_at: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  hindi_title: string;
  xp_reward: number;
  level: Level;
  category: string;
};

export type Phrase = {
  id: string;
  lesson_id: string;
  english: string;
  hindi: string;
  audio_url?: string;
  context_hindi: string;
};

export type UserProgress = {
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  completed_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon_url: string;
};

export type LessonStep = "Context" | "Listen" | "Learn" | "Speak" | "Result";

export type GameSession = {
  id: string;
  user_id: string;
  game_type: string;
  score: number;
  xp_earned: number;
  created_at: string;
};

export type SpeakingSession = {
  id: string;
  user_id: string;
  prompt_id: string;
  user_response: string;
  score: number;
  ideal_answer: string;
  grammar_note: string | null;
  created_at: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// NEW GAME TYPES
export type GameProgress = {
  id: string;
  user_id: string;
  game_type: 'speed_speak' | 'chat_race' | 'real_life' | 'ai_partner' | 'survival' | 'daily_challenge';
  xp_earned: number;
  level_reached: number;
  highest_streak: number;
  updated_at: string;
};

export type SpeedSpeakSentence = {
  id: string;
  level: Level;
  hindi_text: string;
  english_text: string;
  time_limit_seconds: number;
};

export type ChatRaceScenario = {
  id: string;
  level: Level;
  scenario_context: string;
  ai_message: string;
  correct_reply: string;
  mediocre_reply: string;
  wrong_reply: string;
};

export type RealLifeMission = {
  id: string;
  location: string;
  title: string;
  brief: string;
  objectives: string[];
  ai_persona_prompt: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type SurvivalChapter = {
  id: string;
  chapter_number: number;
  title: string;
  setting_description: string;
  boss_encounter: boolean;
  required_intent: string;
  failure_penalty_hearts: number;
};

export type DailyChallenge = {
  id: string;
  challenge_date: string;
  title: string;
  task_prompt: string;
  xp_reward: number;
};

// GAMIFICATION TYPES
export type UserStats = {
  user_id: string;
  total_xp: number;
  rank: 'Beginner' | 'Speaker' | 'Communicator' | 'Fluent' | 'English Warrior' | 'English Master';
  current_streak: number;
  max_streak: number;
  shields: number;
  boosters: number;
  last_login: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  category: string;
  title: string;
  description: string;
  icon_url?: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};

export type CityLocation = {
  id: string;
  name: string;
  description?: string;
  required_xp: number;
  order_num: number;
};

export type InventoryItem = {
  id: string;
  item_type: 'avatar' | 'theme';
  name: string;
  asset_url?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type UserInventory = {
  id: string;
  user_id: string;
  item_id: string;
  acquired_at: string;
  is_equipped: boolean;
};

export type LootBox = {
  id: string;
  user_id: string;
  box_type: 'standard' | 'premium';
  is_opened: boolean;
  earned_at: string;
  opened_at?: string;
};

