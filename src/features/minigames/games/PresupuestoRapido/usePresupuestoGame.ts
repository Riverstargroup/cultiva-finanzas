import { useState, useEffect, useRef } from 'react'
import { GASTOS } from './data'
import type { Zone } from './data'
import type { GameState } from '../../types'

export function usePresupuestoGame() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [timer, setTimer] = useState(60)
  const [classifications, setClassifications] = useState<Record<string, Zone>>({})
  const [score, setScore] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startGame = () => {
    clearTimer()
    setTimer(60)
    setClassifications({})
    setScore(0)
    setCurrentIndex(0)
    setGameState('playing')
  }

  useEffect(() => {
    if (gameState !== 'playing') return

    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearTimer()
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing' && timer === 0) {
      clearTimer()
      setGameState('done')
    }
  }, [timer, gameState])

  const classify = (itemId: string, zone: Zone) => {
    if (gameState !== 'playing') return

    const item = GASTOS.find(g => g.id === itemId)
    const isCorrect = item?.correct === zone

    setClassifications(prev => ({ ...prev, [itemId]: zone }))
    setScore(prev => (isCorrect ? prev + 10 : Math.max(0, prev - 5)))

    if (currentIndex >= GASTOS.length - 1) {
      clearTimer()
      setGameState('done')
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  return {
    gameState,
    timer,
    score,
    currentItem: GASTOS[currentIndex] ?? null,
    currentIndex,
    totalItems: GASTOS.length,
    startGame,
    classify,
  }
}
