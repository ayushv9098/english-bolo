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
