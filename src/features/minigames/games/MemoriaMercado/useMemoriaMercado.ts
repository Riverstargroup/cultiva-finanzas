import { useState, useEffect, useRef, useCallback } from 'react'
import { buildDeck, PAIRS, type MemoryCard, type InstrumentId } from './data'

const INITIAL_TIMER = 90
const TOTAL_PAIRS = 6
const MISMATCH_HIDE_MS = 800

export type MemoriaGameState = 'idle' | 'playing' | 'done'

interface UseMemoriaMercadoResult {
  state: MemoriaGameState
  cards: readonly MemoryCard[]
  flippedIds: readonly string[]
  matchedKeys: readonly InstrumentId[]
  misses: number
  timer: number
  won: boolean
  total: number
  startGame: () => void
  flipCard: (id: string) => void
}

export function useMemoriaMercado(): UseMemoriaMercadoResult {
  const [state, setState] = useState<MemoriaGameState>('idle')
  const [cards, setCards] = useState<readonly MemoryCard[]>([])
  const [flippedIds, setFlippedIds] = useState<readonly string[]>([])
  const [matchedKeys, setMatchedKeys] = useState<readonly InstrumentId[]>([])
  const [misses, setMisses] = useState<number>(0)
  const [timer, setTimer] = useState<number>(INITIAL_TIMER)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mismatchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const won = matchedKeys.length === TOTAL_PAIRS

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const clearMismatchTimeout = () => {
    if (mismatchTimeoutRef.current) {
      clearTimeout(mismatchTimeoutRef.current)
      mismatchTimeoutRef.current = null
    }
  }

  const startGame = useCallback(() => {
    clearTimer()
    clearMismatchTimeout()
    setCards(buildDeck(PAIRS))
    setFlippedIds([])
    setMatchedKeys([])
    setMisses(0)
    setTimer(INITIAL_TIMER)
    setState('playing')
  }, [])

  // Timer
  useEffect(() => {
    if (state !== 'playing') return
    intervalRef.current = setInterval(() => {
      setTimer((t) => (t <= 1 ? 0 : t - 1))
    }, 1000)
    return () => clearTimer()
  }, [state])

  // Time up
  useEffect(() => {
    if (state === 'playing' && timer === 0) {
      clearTimer()
      clearMismatchTimeout()
      setState('done')
    }
  }, [timer, state])

  // Win condition
  useEffect(() => {
    if (state === 'playing' && matchedKeys.length === TOTAL_PAIRS) {
      clearTimer()
      clearMismatchTimeout()
      setState('done')
    }
  }, [matchedKeys, state])

  // Unmount cleanup
  useEffect(() => {
    return () => {
      clearTimer()
      clearMismatchTimeout()
    }
  }, [])

  const flipCard = useCallback(
    (id: string) => {
      if (state !== 'playing') return
      if (flippedIds.length >= 2) return
      if (flippedIds.includes(id)) return
      const card = cards.find((c) => c.id === id)
      if (!card) return
      if (matchedKeys.includes(card.pairKey)) return

      const nextFlipped = [...flippedIds, id]
      setFlippedIds(nextFlipped)

      if (nextFlipped.length === 2) {
        const [firstId, secondId] = nextFlipped
        const first = cards.find((c) => c.id === firstId)
        const second = cards.find((c) => c.id === secondId)
        if (!first || !second) return

        if (first.pairKey === second.pairKey) {
          // Match
          setMatchedKeys((prev) => [...prev, first.pairKey])
          setFlippedIds([])
        } else {
          // Mismatch — flip back after delay
          setMisses((m) => m + 1)
          mismatchTimeoutRef.current = setTimeout(() => {
            setFlippedIds([])
            mismatchTimeoutRef.current = null
          }, MISMATCH_HIDE_MS)
        }
      }
    },
    [state, flippedIds, cards, matchedKeys],
  )

  return {
    state,
    cards,
    flippedIds,
    matchedKeys,
    misses,
    timer,
    won,
    total: TOTAL_PAIRS,
    startGame,
    flipCard,
  }
}
