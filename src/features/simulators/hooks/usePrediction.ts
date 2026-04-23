import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { PREDICTION_CORRECT_THRESHOLD, PREDICTION_CORRECT_COINS } from '../types'

interface UsePredictionOptions {
  userId: string | undefined
  scenarioId: string | undefined
}

interface UsePredictionReturn {
  /** prediction id returned after saving — needed to update with actual result */
  predictionId: string | null
  /** predicted value set by user (0-100) */
  predictedValue: number | null
  /** save prediction before starting scenario */
  savePrediction: (predicted: number) => Promise<void>
  /** call after scenario completes with actual score (0-100) */
  resolvePrediction: (actual: number) => Promise<{ wasCorrect: boolean; coinsEarned: number }>
  saving: boolean
  error: string | null
}

export function usePrediction({ userId, scenarioId }: UsePredictionOptions): UsePredictionReturn {
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [predictedValue, setPredictedValue] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const savePrediction = async (predicted: number): Promise<void> => {
    if (!userId || !scenarioId) return
    setSaving(true)
    setError(null)
    try {
      const { data, error: dbError } = await supabase
        .from('user_predictions')
        .insert({
          user_id: userId,
          scenario_id: scenarioId,
          predicted_value: predicted,
        })
        .select('id')
        .single()

      if (dbError) throw dbError
      setPredictionId(data.id)
      setPredictedValue(predicted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando predicción')
    } finally {
      setSaving(false)
    }
  }

  const resolvePrediction = async (
    actual: number
  ): Promise<{ wasCorrect: boolean; coinsEarned: number }> => {
    if (!userId || !predictionId || predictedValue === null) {
      return { wasCorrect: false, coinsEarned: 0 }
    }

    const wasCorrect = Math.abs(predictedValue - actual) <= PREDICTION_CORRECT_THRESHOLD
    const coinsEarned = wasCorrect ? PREDICTION_CORRECT_COINS : 0

    try {
      await supabase
        .from('user_predictions')
        .update({
          actual_value: actual,
          was_correct: wasCorrect,
          coins_earned: coinsEarned,
        })
        .eq('id', predictionId)

      if (wasCorrect) {
        await supabase.rpc('award_coins', {
          p_user_id: userId,
          p_delta: PREDICTION_CORRECT_COINS,
          p_reason: 'prediction_correct',
        })
      }
    } catch {
      // Non-critical: prediction resolve failure shouldn't block scenario completion
    }

    return { wasCorrect, coinsEarned }
  }

  return { predictionId, predictedValue, savePrediction, resolvePrediction, saving, error }
}
