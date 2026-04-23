import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { gardenKeys } from '@/features/garden/hooks/useGarden'
import { flashcardKeys } from './useDueCards'
import type { Flashcard, FlashcardRating } from '../types'

export interface SessionStats {
  total: number
  reviewed: number
  ratingSum: number
  startTime: number
}

export interface FlashcardSessionState {
  cards: Flashcard[]
  currentIndex: number
  flipped: boolean
  completed: boolean
  stats: SessionStats
  isRating: boolean
}

export interface FlashcardSessionActions {
  onFlip: () => void
  onRate: (rating: FlashcardRating) => Promise<void>
}

export function useFlashcardSession(cards: Flashcard[]): FlashcardSessionState & FlashcardSessionActions {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [isRating, setIsRating] = useState(false)
  const [stats, setStats] = useState<SessionStats>({
    total: cards.length,
    reviewed: 0,
    ratingSum: 0,
    startTime: Date.now(),
  })

  const onFlip = useCallback(() => {
    if (!flipped && !isRating) {
      setFlipped(true)
    }
  }, [flipped, isRating])

  const onRate = useCallback(async (rating: FlashcardRating) => {
    if (!user?.id || isRating) return

    const card = cards[currentIndex]
    if (!card) return

    setIsRating(true)

    try {
      const { error } = await supabase.rpc('apply_flashcard_review', {
        p_user_id: user.id,
        p_flashcard_id: card.id,
        p_quality: rating,
      })

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
      queryClient.invalidateQueries({ queryKey: flashcardKeys.all })

      const nextIndex = currentIndex + 1
      const newReviewed = stats.reviewed + 1

      setStats((prev) => ({
        ...prev,
        reviewed: newReviewed,
        ratingSum: prev.ratingSum + rating,
      }))

      if (nextIndex >= cards.length) {
        setCompleted(true)
      } else {
        setCurrentIndex(nextIndex)
        setFlipped(false)
      }
    } catch (err) {
      console.error('Error applying flashcard review:', err)
      toast({
        variant: 'destructive',
        title: 'No se pudo guardar tu respuesta',
        description: 'Intenta de nuevo en unos momentos.',
      })
    } finally {
      setIsRating(false)
    }
  }, [user?.id, isRating, cards, currentIndex, stats.reviewed, queryClient, toast])

  return {
    cards,
    currentIndex,
    flipped,
    completed,
    stats,
    isRating,
    onFlip,
    onRate,
  }
}
