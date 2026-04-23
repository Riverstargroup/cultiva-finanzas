import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { PlantAnimationKey } from '../types'

// ────────────────────────────────────────────────────────────────
// usePlantReactions — per-plot one-shot animation cues.
// State is a Map<plotId, cue>; reducer always returns a new Map
// (immutability). Cues auto-clear after AUTO_CLEAR_MS.
// ────────────────────────────────────────────────────────────────

export type AnimationCue = PlantAnimationKey | null

type CueState = ReadonlyMap<string, PlantAnimationKey>

type CueAction =
  | { type: 'set'; plotId: string; cue: PlantAnimationKey }
  | { type: 'clear'; plotId: string }

const AUTO_CLEAR_MS = 1500

function reducer(state: CueState, action: CueAction): CueState {
  const next = new Map(state)
  if (action.type === 'set') {
    next.set(action.plotId, action.cue)
    return next
  }
  if (!next.has(action.plotId)) return state
  next.delete(action.plotId)
  return next
}

export interface UsePlantReactionsApi {
  readonly getPlantCue: (plotId: string) => AnimationCue
  readonly triggerCue: (plotId: string, cue: PlantAnimationKey) => void
  readonly clearCue: (plotId: string) => void
}

export function usePlantReactions(): UsePlantReactionsApi {
  const [state, dispatch] = useReducer(reducer, undefined, () => new Map<string, PlantAnimationKey>())
  const stateRef = useRef<CueState>(state)
  stateRef.current = state

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [])

  const getPlantCue = useCallback((plotId: string): AnimationCue => {
    return stateRef.current.get(plotId) ?? null
  }, [])

  const clearCue = useCallback((plotId: string) => {
    const timer = timersRef.current.get(plotId)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(plotId)
    }
    dispatch({ type: 'clear', plotId })
  }, [])

  const triggerCue = useCallback((plotId: string, cue: PlantAnimationKey) => {
    const existing = timersRef.current.get(plotId)
    if (existing) clearTimeout(existing)
    dispatch({ type: 'set', plotId, cue })
    const timer = setTimeout(() => {
      timersRef.current.delete(plotId)
      dispatch({ type: 'clear', plotId })
    }, AUTO_CLEAR_MS)
    timersRef.current.set(plotId, timer)
  }, [])

  return { getPlantCue, triggerCue, clearCue }
}
