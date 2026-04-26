import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { gardenKeys, useGrowPlant } from './useGarden'
import type { SkillDomain } from '../types'

interface GardenRewardOptions {
  domain: SkillDomain
  masteryDelta: number
  coins?: number
  coinReason?: string
}

export function useGardenReward() {
  const growPlant = useGrowPlant()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  function grantReward({ domain, masteryDelta, coins, coinReason }: GardenRewardOptions) {
    growPlant.mutate({ domain, masteryDelta })

    if (coins && user?.id) {
      supabase
        .rpc('award_coins' as any, {
          p_user_id: user.id,
          p_amount: coins,
          p_reason: coinReason ?? 'activity_complete',
        })
        .then(() => queryClient.invalidateQueries({ queryKey: gardenKeys.all }))
        .catch(() => { /* non-critical */ })
    }
  }

  return { grantReward, isLoading: growPlant.isPending }
}
