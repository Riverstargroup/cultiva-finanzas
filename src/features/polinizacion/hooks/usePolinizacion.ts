import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { gardenKeys } from '@/features/garden/hooks/useGarden'

const SKILL_DOMAIN_MAP: Record<string, string> = {
  control_basics: 'control',
  budget_3_buckets: 'control',
  spending_leaks: 'control',
  debt_plan_30d: 'control',
  credit_basics: 'credito',
  credit_score: 'credito',
  min_payment_trap: 'credito',
  snowball_avalanche: 'credito',
  rate_compare: 'credito',
  fraud_basics: 'proteccion',
  identity_protection: 'proteccion',
  auto_saving: 'crecimiento',
  emergency_fund: 'crecimiento',
}

function getDomain(skillId: string): string {
  return SKILL_DOMAIN_MAP[skillId] ?? 'control'
}

export interface PolCard {
  id: string
  skillId: string
  front: string
  back: string
  difficulty: number
  domain: string
}

export function usePolinizacion() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [domainsTouched, setDomainsTouched] = useState<Set<string>>(new Set())
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionCoins, setSessionCoins] = useState(0)

  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['pollination-cards', user?.id],
    queryFn: async (): Promise<PolCard[]> => {
      if (!user?.id) return []

      const { data: flashcards, error } = await supabase
        .from('flashcards' as any)
        .select('id, skill_id, front, back, difficulty')
        .eq('is_published', true)
        .limit(12)

      if (error || !flashcards?.length) return []

      const cardIds = (flashcards as any[]).map((c) => c.id)
      const { data: reviews } = await supabase
        .from('user_flashcard_reviews' as any)
        .select('flashcard_id, repetitions')
        .eq('user_id', user.id)
        .in('flashcard_id', cardIds)

      const reviewMap = new Map(
        ((reviews as any[]) ?? []).map((r) => [r.flashcard_id, r.repetitions as number])
      )

      const sorted = ([...(flashcards as any[])] as any[]).sort(
        (a, b) => (reviewMap.get(a.id) ?? 0) - (reviewMap.get(b.id) ?? 0)
      )

      return sorted.slice(0, 6).map((c) => ({
        id: c.id,
        skillId: c.skill_id,
        front: c.front,
        back: c.back,
        difficulty: c.difficulty,
        domain: getDomain(c.skill_id),
      }))
    },
    enabled: !!user?.id,
    staleTime: 0,
  })

  const rateCard = useMutation({
    mutationFn: async ({ cardId, quality }: { cardId: string; quality: number }) => {
      if (!user?.id) throw new Error('Not authenticated')
      const { data, error } = await supabase.rpc('apply_flashcard_review' as any, {
        p_user_id: user.id,
        p_flashcard_id: cardId,
        p_quality: quality,
      })
      if (error) throw error
      return data
    },
    onSuccess: (_, { cardId }) => {
      const card = cards.find((c) => c.id === cardId)
      if (card) {
        setDomainsTouched((prev) => new Set([...prev, card.domain]))
      }
      setCurrentIndex((prev) => prev + 1)
    },
  })

  const completeSession = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated')
      const cardsReviewed = currentIndex
      const domains = Array.from(domainsTouched)

      for (const domain of domains) {
        await supabase.rpc('grow_plant' as any, {
          p_user_id: user.id,
          p_domain: domain,
          p_mastery_delta: 0.06,
        })
      }

      const coinsEarned = 15 * cardsReviewed
      if (coinsEarned > 0) {
        await supabase.rpc('award_coins' as any, {
          p_user_id: user.id,
          p_delta: coinsEarned,
          p_reason: 'pollination_session',
        })
      }

      await supabase
        .from('user_pollination_sessions' as any)
        .insert({
          user_id: user.id,
          completed_at: new Date().toISOString(),
          cards_reviewed: cardsReviewed,
          domains_touched: domains,
          coins_earned: coinsEarned,
        } as any)

      return { coinsEarned, domains }
    },
    onSuccess: (res) => {
      setSessionCoins(res.coinsEarned)
      setSessionComplete(true)
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
      queryClient.invalidateQueries({ queryKey: ['pollination-lock'] })
    },
  })

  return {
    cards,
    currentIndex,
    cardsLoading,
    sessionComplete,
    sessionCoins,
    domainsTouched,
    rateCard,
    completeSession,
  }
}
