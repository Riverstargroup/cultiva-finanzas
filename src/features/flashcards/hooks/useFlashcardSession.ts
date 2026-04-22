import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { gardenKeys } from '@/features/garden/hooks/useGarden'
import { flashcardKeys } from './useDueCards'
import type { Flashcard, FlashcardRating } from '../types'

interface RatingResult {
  cardId: string
  rating: FlashcardRating
}

interface SessionState {
  currentIndex: number
  isFlipped: boolean
  results: RatingResult[]
  isDone: boolean
}

export function useFlashcardSession(cards: Flashcard[]) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [state, setState] = useState<SessionState>({
    currentIndex: 0,
    isFlipped: false,
    results: [],
    isDone: cards.length === 0,
  })

  const reviewMutation = useMutation({
    mutationFn: async ({ cardId, rating }: { cardId: string; rating: FlashcardRating }) => {
      const { error } = await supabase.rpc('apply_flashcard_review', {
        p_user_id: user!.id,
        p_card_id: cardId,
        p_rating: rating,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
      queryClient.invalidateQueries({ queryKey: flashcardKeys.all })
    },
  })

  const flip = () => {
    setState(s => ({ ...s, isFlipped: true }))
  }

  const onRate = (rating: FlashcardRating) => {
    const card = cards[state.currentIndex]
    if (!card) return

    reviewMutation.mutate({ cardId: card.id, rating })

    setState(s => {
      const results = [...s.results, { cardId: card.id, rating }]
      const nextIndex = s.currentIndex + 1
      const isDone = nextIndex >= cards.length
      return {
        currentIndex: nextIndex,
        isFlipped: false,
        results,
        isDone,
      }
    })
  }

  return {
    currentCard: cards[state.currentIndex] ?? null,
    currentIndex: state.currentIndex,
    totalCards: cards.length,
    isFlipped: state.isFlipped,
    isDone: state.isDone,
    results: state.results,
    flip,
    onRate,
    isPending: reviewMutation.isPending,
  }
}
