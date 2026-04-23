import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { gardenKeys, useGrowPlant } from './useGarden'
import type { SkillDomain } from '../types'

interface GardenRewardOptions {
  domain: SkillDomain
  masteryDelta: number
  coins?: number
  reason?: string
}

export function useGardenReward() {
  const growPlant = useGrowPlant()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  function reward({ domain, masteryDelta, coins, reason }: GardenRewardOptions) {
    growPlant.mutate({ domain, masteryDelta })

    if (coins && user?.id) {
      supabase
        .rpc('award_coins', {
          p_user_id: user.id,
          p_delta: coins,
          p_reason: reason ?? 'activity_complete',
        })
        .then(() => queryClient.invalidateQueries({ queryKey: gardenKeys.all }))
    }
  }

  return { reward, isLoading: growPlant.isPending }
}
