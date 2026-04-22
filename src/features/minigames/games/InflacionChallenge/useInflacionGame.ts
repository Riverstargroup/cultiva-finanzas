import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { gardenKeys } from '@/features/garden/hooks/useGarden'
import { useAuth } from '@/contexts/AuthContext'
import { PRODUCTOS } from './data'

const ERROR_THRESHOLD = 0.15

interface GuessResult {
  productId: string
  guess: number
  correct: boolean
  errorPct: number
}

export function useInflacionGame() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<GuessResult[]>([])
  const [done, setDone] = useState(false)
  const [coinsAwarded, setCoinsAwarded] = useState(false)

  const currentProduct = PRODUCTOS[currentIndex]
  const sliderMin = Math.round(currentProduct.price2020 * 0.5)
  const sliderMax = Math.round(currentProduct.price2020 * 3)

  useEffect(() => {
    setSliderValue(Math.round((sliderMin + sliderMax) / 2))
  }, [currentIndex])

  const guess = () => {
    if (revealed) return
    const errorPct = Math.abs(sliderValue - currentProduct.price2025) / currentProduct.price2025
    const correct = errorPct < ERROR_THRESHOLD
    setResults(prev => [...prev, { productId: currentProduct.id, guess: sliderValue, correct, errorPct }])
    setRevealed(true)
  }

  const next = () => {
    if (currentIndex >= PRODUCTOS.length - 1) {
      setDone(true)
    } else {
      setCurrentIndex(prev => prev + 1)
      setRevealed(false)
    }
  }

  useEffect(() => {
    if (!done || coinsAwarded || !user?.id) return
    const anyCorrect = results.some(r => r.correct)
    if (anyCorrect) {
      supabase
        .rpc('award_coins', {
          p_user_id: user.id,
          p_amount: 30,
          p_reason: 'inflation_guess',
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: gardenKeys.all })
        })
      setCoinsAwarded(true)
    }
  }, [done, coinsAwarded, results])

  const currentResult = results.find(r => r.productId === currentProduct.id)

  return {
    currentProduct,
    currentIndex,
    totalProducts: PRODUCTOS.length,
    sliderValue,
    setSliderValue,
    sliderMin,
    sliderMax,
    revealed,
    results,
    done,
    coinsAwarded,
    currentResult,
    guess,
    next,
  }
}
