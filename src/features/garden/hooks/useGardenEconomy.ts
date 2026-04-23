import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { gardenKeys } from './useGarden'
import { isPowerActive, isRentOverdue, rentCountdownMs } from '../lib/economy'
import type { GardenEconomy } from '../types'

type TickResult = { rent_delta: number; gold_delta: number }

async function fetchGardenEconomy(userId: string): Promise<GardenEconomy | null> {
  const { data, error } = await supabase
    .from('user_garden_economy' as any)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const row = data as any
  return {
    rentDueAt: row.rent_due_at,
    rentAmount: row.rent_amount,
    fireActiveUntil: row.fire_plant_active_until ?? null,
    goldActiveUntil: row.gold_plant_active_until ?? null,
    iceActiveUntil: row.ice_plant_active_until ?? null,
    lastPassiveCoinsAt: row.last_passive_coins_at ?? null,
  }
}

export interface GardenEconomyState {
  readonly data: GardenEconomy | null
  readonly isLoading: boolean
  readonly fireActive: boolean
  readonly goldActive: boolean
  readonly iceActive: boolean
  readonly rentOverdue: boolean
  readonly rentCountdownMs: number
}

export function useGardenEconomy(): GardenEconomyState {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const { data = null, isLoading } = useQuery({
    queryKey: gardenKeys.economy(userId),
    queryFn: () => fetchGardenEconomy(userId),
    enabled: !!userId,
    staleTime: 30_000,
  })

  return {
    data,
    isLoading,
    fireActive: isPowerActive(data?.fireActiveUntil ?? null),
    goldActive: isPowerActive(data?.goldActiveUntil ?? null),
    iceActive: isPowerActive(data?.iceActiveUntil ?? null),
    rentOverdue: isRentOverdue(data?.rentDueAt ?? null),
    rentCountdownMs: rentCountdownMs(data?.rentDueAt ?? null),
  }
}

export function useGardenTick() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (): Promise<TickResult> => {
      if (!user?.id) throw new Error('Not authenticated')
      const { data, error } = await supabase.rpc('tick_garden_economy' as any, {
        p_user_id: user.id,
      })
      if (error) throw error
      return data as TickResult
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
    },
  })
}
