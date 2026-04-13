// Manual types for learning engine tables (until types.ts auto-regenerates)

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  estimated_minutes: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  feedback: string;
  is_best: boolean;
}

export interface RecallChoice {
  id: string;
  text: string;
}

export interface RecallQuestion {
  id: string;
  question: string;
  choices: RecallChoice[];
  correct_choice_id: string;
  explanation: string;
}

export interface Scenario {
  id: string;
  course_id: string;
  order_index: number;
  title: string;
  prompt: string;
  coaching: string;
  options: ScenarioOption[];
  recall: RecallQuestion[];
  mission: string | null;
  tags: string[];
  created_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_scenarios: string[];
  mastery_score: number;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface UserScenarioState {
  id: string;
  user_id: string;
  course_id: string;
  scenario_id: string;
  repetitions: number;
  interval_days: number;
  ease_factor: number;
  next_due_at: string;
  last_quality: number;
  last_score: number;
  last_attempt_at: string | null;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface UserActivityDay {
  id: string;
  user_id: string;
  day: string;
  minutes: number;
  created_at: string;
}

export interface Skill {
  id: string;
  domain: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  mastery: number;
  status: string;
  updated_at: string;
}

export interface UserMission {
  id: string;
  user_id: string;
  scenario_id: string;
  status: string;
  done_at: string | null;
}
