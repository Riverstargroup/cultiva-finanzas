import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { gardenKeys } from '@/features/garden/hooks/useGarden'
import { retosKeys } from './useRetos'
import { startOfWeek, format } from 'date-fns'

export function useHarvest() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      challengeId,
      rewardCoins,
    }: {
      challengeId: string
      rewardCoins: number
    }) => {
      if (!user?.id) throw new Error('Not authenticated')

      await supabase
        .from('user_weekly_challenges' as any)
        .update({ harvested: true } as any)
        .eq('id', challengeId)
        .eq('user_id', user.id)

      if (rewardCoins > 0) {
        await supabase.rpc('award_coins' as any, {
          p_user_id: user.id,
          p_delta: rewardCoins,
          p_reason: 'challenge_harvest',
        })
      }

      return { coinsEarned: rewardCoins }
    },
    onSuccess: () => {
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
      queryClient.invalidateQueries({ queryKey: retosKeys.weekly(user?.id ?? '', weekStart) })
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
    },
  })
}
