import { useCallback, useState } from 'react'
import { ROUNDS, type SavingsRound } from './data'

export type AhorraCosechaState = 'idle' | 'swinging' | 'revealing' | 'done'

export interface SavingsAttempt {
  round: SavingsRound
  chosenPct: number
  deltaPct: number
  inBand: boolean
  pointsEarned: number
}

interface UseAhorraCosechaResult {
  state: AhorraCosechaState
  roundIndex: number
  currentRound: SavingsRound
  attempts: SavingsAttempt[]
  lastAttempt: SavingsAttempt | null
  totalPoints: number
  won: boolean
  totalRounds: number
  startGame: () => void
  tap: (chosenPct: number) => void
  nextRound: () => void
}

const WIN_THRESHOLD = 3

export function useAhorraCosecha(): UseAhorraCosechaResult {
  const [state, setState] = useState<AhorraCosechaState>('idle')
  const [roundIndex, setRoundIndex] = useState<number>(0)
  const [attempts, setAttempts] = useState<SavingsAttempt[]>([])

  const currentRound = ROUNDS[roundIndex] ?? ROUNDS[0]
  const totalPoints = attempts.reduce((sum, a) => sum + a.pointsEarned, 0)
  const won = attempts.filter((a) => a.inBand).length >= WIN_THRESHOLD
  const lastAttempt = attempts[attempts.length - 1] ?? null

  const startGame = useCallback(() => {
    setRoundIndex(0)
    setAttempts([])
    setState('swinging')
  }, [])

  const tap = useCallback(
    (chosenPct: number) => {
      setState((prev) => {
        if (prev !== 'swinging') return prev
        return 'revealing'
      })
      setAttempts((prev) => {
        // Guard against double-tap
        if (prev.length > roundIndex) return prev
        const round = ROUNDS[roundIndex]
        if (!round) return prev
        const clamped = Math.max(0, Math.min(40, chosenPct))
        const deltaPct = Math.abs(clamped - round.targetPct)
        const inBand = deltaPct <= round.bandTolerance
        const pointsEarned = Math.max(0, 20 - Math.floor(deltaPct) * 2)
        const attempt: SavingsAttempt = {
          round,
          chosenPct: clamped,
          deltaPct,
          inBand,
          pointsEarned,
        }
        return [...prev, attempt]
      })
    },
    [roundIndex],
  )

  const nextRound = useCallback(() => {
    setRoundIndex((prev) => {
      if (prev >= ROUNDS.length - 1) {
        setState('done')
        return prev
      }
      setState('swinging')
      return prev + 1
    })
  }, [])

  return {
    state,
    roundIndex,
    currentRound,
    attempts,
    lastAttempt,
    totalPoints,
    won,
    totalRounds: ROUNDS.length,
    startGame,
    tap,
    nextRound,
  }
}
