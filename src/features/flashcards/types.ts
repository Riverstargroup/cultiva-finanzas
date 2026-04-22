import type { SkillDomain } from '@/features/garden/types'

export interface Flashcard {
  id: string
  domain: SkillDomain
  frontText: string
  backText: string
  easeFactor: number
  intervalDays: number
  nextReviewAt: string
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
  0: 'bg-red-500',
  1: 'bg-orange-400',
  2: 'bg-blue-500',
  3: 'bg-green-400',
  4: 'bg-emerald-500',
}
