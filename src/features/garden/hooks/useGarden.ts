import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { masteryToStage, healthToState } from '../lib/stage'
import { DOMAIN_TO_SPECIES } from '../types'
import type { GardenState, GardenPlot, Plant, SkillDomain } from '../types'

// Query key — single source of truth for cache invalidation
export const gardenKeys = {
  all: ['garden'] as const,
  plots: (userId: string) => [...gardenKeys.all, 'plots', userId] as const,
  coins: (userId: string) => [...gardenKeys.all, 'coins', userId] as const,
  economy: (userId: string) => [...gardenKeys.all, 'economy', userId] as const,
  shop: [...gardenKeys.all, 'shop'] as const,
  inventory: (userId: string) => [...gardenKeys.all, 'inventory', userId] as const,
}

export async function fetchGardenPlots(userId: string): Promise<GardenPlot[]> {
  const { data, error } = await supabase
    .from('user_garden_plots')
    .select('*, plant_species(*)')
    .eq('user_id', userId)
    .order('domain')

  if (error) throw error
  if (!data?.length) return []

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    domain: row.domain as SkillDomain,
    plant: {
      id: row.id,
      species: DOMAIN_TO_SPECIES[row.domain as SkillDomain],
      domain: row.domain as SkillDomain,
      mastery: row.mastery,
      stage: masteryToStage(row.mastery),
      health: row.health,
      healthState: healthToState(row.health),
      lastWateredAt: row.last_watered_at,
      plantedAt: row.updated_at,
    } satisfies Plant,
  }))
}

export async function fetchCoinBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_coin_balance')
    .select('coins')
    .eq('user_id', userId)
    .single()

  if (error) return 0
  return data?.coins ?? 0
}

async function initializeGarden(userId: string): Promise<void> {
  const { error } = await supabase.rpc('initialize_user_garden', { p_user_id: userId })
  if (error) throw error
}

export function useGarden(): GardenState {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const { data: plots = [], isLoading: plotsLoading } = useQuery({
    queryKey: gardenKeys.plots(userId),
    queryFn: () => fetchGardenPlots(userId),
    enabled: !!userId,
    staleTime: 30_000,
  })

  const { data: coins = 0, isLoading: coinsLoading } = useQuery({
    queryKey: gardenKeys.coins(userId),
    queryFn: () => fetchCoinBalance(userId),
    enabled: !!userId,
    staleTime: 10_000,
  })

  const totalMastery = plots.reduce((sum, p) => sum + p.plant.mastery, 0)

  return {
    plots,
    coins,
    totalMastery,
    streakDays: 0, // consumed from existing useStreak hook
    isLoading: plotsLoading || coinsLoading,
  }
}

export function useGrowPlant() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ domain, masteryDelta }: { domain: SkillDomain; masteryDelta: number }) => {
      if (!user?.id) throw new Error('Not authenticated')
      const { data, error } = await supabase.rpc('grow_plant', {
        p_user_id: user.id,
        p_domain: domain,
        p_mastery_delta: masteryDelta,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'No pudimos hacer crecer tu planta',
        description: 'Intenta de nuevo en unos momentos.',
      })
    },
  })
}

export function useInitGarden() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated')
      await initializeGarden(user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'No pudimos inicializar tu jardín',
        description: 'Recarga la página para intentarlo de nuevo.',
      })
    },
  })
}
