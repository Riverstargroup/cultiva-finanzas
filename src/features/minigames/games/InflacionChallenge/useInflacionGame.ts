import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { gardenKeys } from '@/features/garden/hooks/useGarden'
import { useAuth } from '@/contexts/AuthContext'
import { PRODUCTOS } from './data'

interface GuessResult {
  correct: boolean
  errorPct: number
  guess: number
}

export function useInflacionGame() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<GuessResult[]>([])
  const [done, setDone] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const current = PRODUCTOS[currentIndex] ?? null

  useEffect(() => {
    if (!current) return
    const min = Math.round(current.price2020 * 0.5)
    const max = Math.round(current.price2020 * 3)
    setSliderValue(Math.round((min + max) / 2))
    setRevealed(false)
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const guess = () => {
    if (!current || revealed) return
    const errorPct = Math.abs(sliderValue - current.price2025) / current.price2025
    const correct = errorPct < 0.15
    setResults(prev => [...prev, { correct, errorPct, guess: sliderValue }])
    setRevealed(true)
  }

  const next = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= PRODUCTOS.length) {
      const allResults = [...results]
      const anyCorrect = allResults.some(r => r.correct)
      setDone(true)
      if (anyCorrect && user?.id) {
        supabase
          .rpc('award_coins', { p_user_id: user.id, p_amount: 30, p_reason: 'inflation_guess' })
          .then(() => queryClient.invalidateQueries({ queryKey: gardenKeys.all }))
      }
    } else {
      setCurrentIndex(nextIndex)
    }
  }

  const lastResult = results[results.length - 1] ?? null
  const min = current ? Math.round(current.price2020 * 0.5) : 0
  const max = current ? Math.round(current.price2020 * 3) : 100

  return {
    current,
    currentIndex,
    sliderValue,
    setSliderValue,
    revealed,
    results,
    lastResult,
    done,
    guess,
    next,
    min,
    max,
    total: PRODUCTOS.length,
  }
}
