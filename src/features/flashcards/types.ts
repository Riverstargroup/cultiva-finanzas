import type { SkillDomain } from '@/features/garden/types'

export interface Flashcard {
  id: string
  domain: SkillDomain
  front_text: string
  back_text: string
  ease_factor: number
  interval_days: number
  next_review_at: string
  user_id: string
}

export type FlashcardRating = 0 | 1 | 2 | 3 | 4

export const RATING_LABELS: Record<FlashcardRating, string> = {
  0: 'Otra vez',
  1: 'Difícil',
  2: 'Bien',
  3: 'Fácil',
  4: 'Perfecto',
}

export const RATING_COLORS: Record<FlashcardRating, string> = {
  0: 'bg-red-500 hover:bg-red-600',
  1: 'bg-orange-400 hover:bg-orange-500',
  2: 'bg-yellow-400 hover:bg-yellow-500',
  3: 'bg-lime-500 hover:bg-lime-600',
  4: 'bg-green-500 hover:bg-green-600',
}
