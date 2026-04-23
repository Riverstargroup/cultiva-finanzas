import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useGrowPlant } from './useGarden'
import { useQueryClient } from '@tanstack/react-query'
import { gardenKeys } from './useGarden'
import type { SkillDomain } from '../types'

interface RewardOptions {
  domain: SkillDomain
  masteryDelta: number
  coins?: number
  coinReason?: string
}

export function useGardenReward() {
  const { user } = useAuth()
  const growPlant = useGrowPlant()
  const queryClient = useQueryClient()

  const grantReward = async ({ domain, masteryDelta, coins, coinReason }: RewardOptions) => {
    if (!user?.id) return

    growPlant.mutate({ domain, masteryDelta })

    if (coins && coins > 0) {
      try {
        await supabase.rpc('award_coins' as any, {
          p_user_id: user.id,
          p_amount: coins,
          p_reason: coinReason ?? 'game_complete',
        })
        queryClient.invalidateQueries({ queryKey: gardenKeys.coins(user.id) })
      } catch {
        // non-critical
      }
    }
  }

  return { grantReward, isPending: growPlant.isPending }
}
