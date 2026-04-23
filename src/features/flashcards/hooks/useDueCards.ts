import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { SkillDomain } from '@/features/garden/types'
import type { Flashcard } from '../types'

export const flashcardKeys = {
  all: ['flashcards'] as const,
  due: (userId: string, domain?: SkillDomain) =>
    [...flashcardKeys.all, 'due', userId, domain ?? 'all'] as const,
}

async function fetchDueCards(userId: string, domain?: SkillDomain): Promise<Flashcard[]> {
  // Get all published flashcards (domain column added by seed migration)
  let query = (supabase as any)
    .from('flashcards')
    .select('id, front, back, domain')
    .eq('is_published', true)

  if (domain) {
    query = query.eq('domain', domain)
  }

  const { data: allCards, error } = await query
  if (error) throw error
  if (!allCards?.length) return []

  const cardIds = (allCards as { id: string }[]).map((c) => c.id)
  const now = new Date().toISOString()

  // Get user's SM-2 review state for these cards
  const { data: reviews } = await (supabase as any)
    .from('user_flashcard_reviews')
    .select('flashcard_id, ease_factor, interval_days, due_at')
    .eq('user_id', userId)
    .in('flashcard_id', cardIds)

  const reviewedIds = new Set<string>((reviews ?? []).map((r: any) => r.flashcard_id))
  const dueMap = new Map<string, { ease_factor: number; interval_days: number; due_at: string }>(
    (reviews ?? [])
      .filter((r: any) => r.due_at <= now)
      .map((r: any) => [r.flashcard_id, r])
  )

  // Cards are due if never reviewed OR their due_at has passed
  return (allCards as { id: string; front: string; back: string; domain: string }[])
    .filter((card) => !reviewedIds.has(card.id) || dueMap.has(card.id))
    .map((card) => {
      const review = dueMap.get(card.id) ?? null
      return {
        id: card.id,
        domain: card.domain as SkillDomain,
        frontText: card.front,
        backText: card.back,
        easeFactor: review?.ease_factor ?? 2.5,
        intervalDays: review?.interval_days ?? 0,
        nextReviewAt: review?.due_at ?? now,
      }
    })
}

export function useDueCards(domain?: SkillDomain): {
  cards: Flashcard[]
  isLoading: boolean
  count: number
} {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const { data: cards = [], isLoading } = useQuery({
    queryKey: flashcardKeys.due(userId, domain),
    queryFn: () => fetchDueCards(userId, domain),
    enabled: !!userId,
    staleTime: 30_000,
  })

  return { cards, isLoading, count: cards.length }
}
