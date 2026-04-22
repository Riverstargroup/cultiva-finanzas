import { useState, useEffect, useRef } from 'react'
import { GASTOS, type Zone } from './data'
import type { GameState } from '../../types'

export function usePresupuestoGame() {
  const [timer, setTimer] = useState(60)
  const [classifications, setClassifications] = useState<Record<string, Zone>>({})
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<GameState>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startGame = () => {
    setTimer(60)
    setClassifications({})
    setScore(0)
    setGameState('playing')
  }

  useEffect(() => {
    if (gameState !== 'playing') return

    intervalRef.current = setInterval(() => {
      setTimer(t => (t <= 1 ? 0 : t - 1))
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing' && timer === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setGameState('done')
    }
  }, [timer, gameState])

  const classify = (itemId: string, zone: Zone) => {
    if (gameState !== 'playing') return

    const item = GASTOS.find(g => g.id === itemId)
    if (!item) return

    const correct = item.correct === zone
    setScore(prev => prev + (correct ? 10 : -5))

    setClassifications(prev => {
      const updated = { ...prev, [itemId]: zone }
      if (Object.keys(updated).length === GASTOS.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setGameState('done')
      }
      return updated
    })
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const currentItem = GASTOS.find(g => !classifications[g.id]) ?? null
  const classified = Object.keys(classifications).length

  return { timer, classifications, score, gameState, startGame, classify, currentItem, classified, total: GASTOS.length }
}
