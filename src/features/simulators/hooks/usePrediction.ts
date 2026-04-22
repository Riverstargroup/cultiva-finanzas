import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { gardenKeys } from '@/features/garden/hooks/useGarden'
import type { Prediction } from '../types'

export const predictionKeys = {
  all: ['predictions'] as const,
  byScenario: (scenarioId: string) => ['predictions', scenarioId] as const,
}

export function usePrediction(scenarioId: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: prediction = null, isLoading } = useQuery({
    queryKey: predictionKeys.byScenario(scenarioId),
    queryFn: async (): Promise<Prediction | null> => {
      if (!user?.id || !scenarioId) return null
      const { data, error } = await supabase
        .from('user_predictions' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('scenario_id', scenarioId)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const d = data as any
      return {
        id: d.id,
        userId: d.user_id,
        scenarioId: d.scenario_id,
        predictedValue: Number(d.predicted_value),
        actualValue: d.actual_value !== null ? Number(d.actual_value) : null,
        wasCorrect: d.was_correct,
        coinsEarned: d.coins_earned ?? 0,
        createdAt: d.created_at,
      }
    },
    enabled: !!user?.id && !!scenarioId,
    staleTime: 60_000,
  })

  const savePrediction = useMutation({
    mutationFn: async (predictedValue: number) => {
      if (!user?.id) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('user_predictions' as any)
        .insert({ user_id: user.id, scenario_id: scenarioId, predicted_value: predictedValue } as any)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: predictionKeys.byScenario(scenarioId) }),
  })

  const revealOutcome = useMutation({
    mutationFn: async ({
      predictionId,
      predictedValue,
      actualValue,
    }: {
      predictionId: string
      predictedValue: number
      actualValue: number
    }) => {
      if (!user?.id) throw new Error('Not authenticated')
      await supabase
        .from('user_predictions' as any)
        .update({ actual_value: actualValue } as any)
        .eq('id', predictionId)

      const isCorrect =
        actualValue !== 0 && Math.abs(predictedValue - actualValue) / Math.abs(actualValue) <= 0.10

      if (isCorrect) {
        await supabase.rpc('award_coins' as any, {
          p_user_id: user.id,
          p_delta: 50,
          p_reason: 'prediction_correct',
        })
      }

      return { isCorrect, coinsEarned: isCorrect ? 50 : 0 }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: predictionKeys.byScenario(scenarioId) })
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
    },
  })

  return { prediction, isLoading, savePrediction, revealOutcome }
}
