import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import type { DragDropExercise, DragDropSession, DropZoneId } from '../types'

const MASTERY_DELTA = 0.05

export function useDragDropSession(exercise: DragDropExercise): {
  session: DragDropSession
  placeItem: (itemId: string, zoneId: DropZoneId) => void
  removeItem: (itemId: string) => void
  submit: () => void
  reset: () => void
  allPlaced: boolean
} {
  const { user } = useAuth()
  const growPlant = useGrowPlant()

  const [currentMapping, setCurrentMapping] = useState<Record<string, DropZoneId>>({})
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [masteryEarned, setMasteryEarned] = useState(0)

  const allPlaced = exercise.items.every((item) => item.id in currentMapping)

  const placeItem = useCallback((itemId: string, zoneId: DropZoneId) => {
    if (submitted) return
    setCurrentMapping((prev) => ({ ...prev, [itemId]: zoneId }))
  }, [submitted])

  const removeItem = useCallback((itemId: string) => {
    if (submitted) return
    setCurrentMapping((prev) => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }, [submitted])

  const submit = useCallback(() => {
    if (!allPlaced || submitted) return

    const isCorrect = exercise.items.every(
      (item) => currentMapping[item.id] === exercise.correctMapping[item.id]
    )

    setSubmitted(true)
    setCorrect(isCorrect)

    if (isCorrect) {
      setMasteryEarned(MASTERY_DELTA)
      growPlant.mutate({ domain: exercise.domain, masteryDelta: MASTERY_DELTA }, { onError: () => {} })
      if (user) {
        supabase
          .rpc('award_coins', { p_user_id: user.id, p_delta: 15, p_reason: 'dragdrop_complete' })
          .then()
      }
    }
  }, [allPlaced, submitted, exercise, currentMapping, growPlant, user])

  const reset = useCallback(() => {
    setCurrentMapping({})
    setSubmitted(false)
    setCorrect(null)
    setMasteryEarned(0)
  }, [])

  const session: DragDropSession = {
    exercise,
    currentMapping,
    submitted,
    correct,
    masteryEarned,
  }

  return { session, placeItem, removeItem, submit, reset, allPlaced }
}
