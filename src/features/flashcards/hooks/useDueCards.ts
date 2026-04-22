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
  let query = supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_at', new Date().toISOString())
    .order('next_review_at', { ascending: true })

  if (domain) {
    query = query.eq('domain', domain)
  }

  const { data, error } = await query

  if (error) throw error
  if (!data?.length) return []

  return data.map((row) => ({
    id: row.id,
    domain: row.domain as SkillDomain,
    frontText: row.front_text,
    backText: row.back_text,
    easeFactor: row.ease_factor,
    intervalDays: row.interval_days,
    nextReviewAt: row.next_review_at,
  }))
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
