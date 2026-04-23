import { useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useGrowPlant } from './useGarden'
import type { SkillDomain } from '../types'

/**
 * Fire-and-forget garden reward hook for mini-games and exercises.
 * All mutations are silent — they never block UI or show errors.
 */
export function useGardenReward() {
  const { user } = useAuth()
  const growPlant = useGrowPlant()

  const grow = useCallback(
    (domain: SkillDomain, masteryDelta: number) => {
      if (!user) return
      growPlant.mutate({ domain, masteryDelta }, { onError: () => {} })
    },
    [user, growPlant]
  )

  const awardCoins = useCallback(
    (amount: number, reason: string) => {
      if (!user) return
      supabase
        .rpc('award_coins', { p_user_id: user.id, p_delta: amount, p_reason: reason })
        .then()
    },
    [user]
  )

  /** Call when PresupuestoRapido finishes. Only rewards if score ≥ 60%. */
  const onPresupuestoComplete = useCallback(
    (score: number, total: number) => {
      if (total === 0 || score / total < 0.6) return
      const masteryDelta = 0.05 * (score / total)
      grow('control', masteryDelta)
    },
    [grow]
  )

  /** Call when InflacionChallenge finishes. */
  const onInflacionComplete = useCallback(
    (score: number, total: number) => {
      if (total === 0) return
      const masteryDelta = 0.04 * (score / total)
      grow('crecimiento', masteryDelta)
    },
    [grow]
  )

  /** Call when a drag-drop exercise is answered correctly. */
  const onDragDropComplete = useCallback(
    (domain: SkillDomain) => {
      grow(domain, 0.03)
      awardCoins(15, 'dragdrop_complete')
    },
    [grow, awardCoins]
  )

  return { onPresupuestoComplete, onInflacionComplete, onDragDropComplete }
}
