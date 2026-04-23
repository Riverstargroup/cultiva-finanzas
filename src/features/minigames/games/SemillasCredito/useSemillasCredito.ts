import { useCallback, useState } from 'react'
import { CARD_POOL, type CreditCard } from './data'

const DECK_SIZE = 10
const INITIAL_SCORE = 650
const MIN_SCORE = 300
const MAX_SCORE = 850

export type SemillasGameState = 'idle' | 'playing' | 'done'
export type SwipeDirection = 'left' | 'right'

export interface SwipeRecord {
  readonly card: CreditCard
  readonly chose: SwipeDirection
  readonly correct: boolean
  readonly scoreAfter: number
}

interface UseSemillasCreditoResult {
  readonly state: SemillasGameState
  readonly currentCard: CreditCard | null
  readonly deckIndex: number
  readonly score: number
  readonly history: readonly SwipeRecord[]
  readonly total: number
  startGame: () => void
  swipe: (direction: SwipeDirection) => void
}

function shuffleAndPick(count: number): CreditCard[] {
  const pool: CreditCard[] = [...CARD_POOL]
  const out: CreditCard[] = []
  while (out.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length)
    out.push(pool[idx])
    pool.splice(idx, 1)
  }
  return out
}

function clamp(n: number, lo: number, hi: number): number {
  if (n < lo) return lo
  if (n > hi) return hi
  return n
}

function isCorrectChoice(card: CreditCard, direction: SwipeDirection): boolean {
  if (card.impact === 'neutral') return true
  if (direction === 'right' && card.impact === 'builds') return true
  if (direction === 'left' && card.impact === 'hurts') return true
  return false
}

export function useSemillasCredito(): UseSemillasCreditoResult {
  const [state, setState] = useState<SemillasGameState>('idle')
  const [deck, setDeck] = useState<readonly CreditCard[]>([])
  const [deckIndex, setDeckIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(INITIAL_SCORE)
  const [history, setHistory] = useState<readonly SwipeRecord[]>([])

  const startGame = useCallback(() => {
    setDeck(shuffleAndPick(DECK_SIZE))
    setDeckIndex(0)
    setScore(INITIAL_SCORE)
    setHistory([])
    setState('playing')
  }, [])

  const swipe = useCallback(
    (direction: SwipeDirection) => {
      setState((currentState) => {
        if (currentState !== 'playing') return currentState
        return currentState
      })

      const card = deck[deckIndex]
      if (!card) return

      const correct = isCorrectChoice(card, direction)
      const delta = card.scoreDelta
      const signed = correct ? delta : -delta
      const nextScore = clamp(score + signed, MIN_SCORE, MAX_SCORE)

      const record: SwipeRecord = {
        card,
        chose: direction,
        correct,
        scoreAfter: nextScore,
      }

      setScore(nextScore)
      setHistory((prev) => [...prev, record])

      const nextIndex = deckIndex + 1
      setDeckIndex(nextIndex)
      if (nextIndex >= deck.length) {
        setState('done')
      }
    },
    [deck, deckIndex, score],
  )

  const currentCard = state === 'playing' ? deck[deckIndex] ?? null : null

  return {
    state,
    currentCard,
    deckIndex,
    score,
    history,
    total: deck.length || DECK_SIZE,
    startGame,
    swipe,
  }
}
