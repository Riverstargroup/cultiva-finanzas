import { useState, useEffect, useRef, useCallback } from 'react'
import { GASTOS, type Gasto, type Zone } from './data'

const ROUND_SIZE = 8
const INITIAL_TIMER = 90

export const PASS_THRESHOLD = 60

export type PresupuestoGameState = 'idle' | 'playing' | 'done'

export interface LastResult {
  readonly chipId: string
  readonly correct: boolean
}

interface UsePresupuestoGameResult {
  gameState: PresupuestoGameState
  timer: number
  placements: Record<string, Zone>
  score: number
  lastResult: LastResult | null
  currentItems: readonly Gasto[]
  unplacedItems: readonly Gasto[]
  startGame: () => void
  dropChip: (chipId: string, zone: Zone) => void
  total: number
}

function pickRandomItems(count: number): readonly Gasto[] {
  const pool = [...GASTOS]
  const result: Gasto[] = []
  while (result.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool[idx])
    pool.splice(idx, 1)
  }
  return result
}

export function usePresupuestoGame(): UsePresupuestoGameResult {
  const [gameState, setGameState] = useState<PresupuestoGameState>('idle')
  const [timer, setTimer] = useState<number>(INITIAL_TIMER)
  const [placements, setPlacements] = useState<Record<string, Zone>>({})
  const [score, setScore] = useState<number>(0)
  const [lastResult, setLastResult] = useState<LastResult | null>(null)
  const [currentItems, setCurrentItems] = useState<readonly Gasto[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startGame = useCallback(() => {
    clearTimer()
    setCurrentItems(pickRandomItems(ROUND_SIZE))
    setPlacements({})
    setScore(0)
    setLastResult(null)
    setTimer(INITIAL_TIMER)
    setGameState('playing')
  }, [])

  useEffect(() => {
    if (gameState !== 'playing') return
    intervalRef.current = setInterval(() => {
      setTimer((t) => (t <= 1 ? 0 : t - 1))
    }, 1000)
    return () => clearTimer()
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing' && timer === 0) {
      clearTimer()
      setGameState('done')
    }
  }, [timer, gameState])

  useEffect(() => () => clearTimer(), [])

  const dropChip = useCallback(
    (chipId: string, zone: Zone) => {
      if (gameState !== 'playing') return
      if (placements[chipId]) return
      const item = currentItems.find((g) => g.id === chipId)
      if (!item) return

      const correct = item.correct === zone
      setScore((prev) => {
        const next = prev + (correct ? 10 : -2)
        return next < 0 ? 0 : next
      })
      setLastResult({ chipId, correct })

      setPlacements((prev) => {
        const updated = { ...prev, [chipId]: zone }
        if (Object.keys(updated).length === currentItems.length) {
          clearTimer()
          setGameState('done')
        }
        return updated
      })
    },
    [gameState, placements, currentItems],
  )

  const unplacedItems = currentItems.filter((item) => !placements[item.id])

  return {
    gameState,
    timer,
    placements,
    score,
    lastResult,
    currentItems,
    unplacedItems,
    startGame,
    dropChip,
    total: currentItems.length || ROUND_SIZE,
  }
}
