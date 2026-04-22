import { useCallback, useRef, useState } from 'react'
import type { GardenEvent } from '../types'

type Handler = (event: GardenEvent) => void

export function useGardenEvents() {
  const [lastEvent, setLastEvent] = useState<GardenEvent | null>(null)
  const handlers = useRef<Set<Handler>>(new Set())

  const emit = useCallback((event: GardenEvent) => {
    setLastEvent(event)
    handlers.current.forEach((h) => h(event))
  }, [])

  const subscribe = useCallback((handler: Handler) => {
    handlers.current.add(handler)
    return () => { handlers.current.delete(handler) }
  }, [])

  return { lastEvent, emit, subscribe }
}
