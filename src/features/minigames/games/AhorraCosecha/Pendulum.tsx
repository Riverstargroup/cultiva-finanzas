import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface PendulumProps {
  active: boolean
  speed: number
  onTap: (pct: number) => void
}

const MIN_PCT = 0
const MAX_PCT = 40
const CENTER_PCT = 20
const AMPLITUDE_PCT = 20
const FRAME_STEP = 0.04

/**
 * Oscillating marker on a 0–40% scale.
 * pct = 20 + 20 * sin(t * speed)
 *
 * The component owns its own requestAnimationFrame loop. When `active` is
 * false the marker freezes at its current position; when `active` becomes
 * true again, oscillation resumes from that position.
 */
export function Pendulum({ active, speed, onTap }: PendulumProps) {
  const reducedMotion = useReducedMotion()
  const [pct, setPct] = useState<number>(CENTER_PCT)
  const tRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)
  const pctRef = useRef<number>(CENTER_PCT)

  useEffect(() => {
    pctRef.current = pct
  }, [pct])

  useEffect(() => {
    if (!active || reducedMotion) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    const tick = () => {
      tRef.current += FRAME_STEP
      const next = CENTER_PCT + AMPLITUDE_PCT * Math.sin(tRef.current * speed)
      setPct(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [active, speed, reducedMotion])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  const handleTap = useCallback(() => {
    if (!active) return
    if (reducedMotion) {
      onTap(CENTER_PCT)
      return
    }
    onTap(pctRef.current)
  }, [active, onTap, reducedMotion])

  const displayPct = reducedMotion ? CENTER_PCT : pct
  const leftPercent = ((displayPct - MIN_PCT) / (MAX_PCT - MIN_PCT)) * 100

  return (
    <div className="space-y-3 select-none">
      <div
        role="button"
        tabIndex={0}
        aria-label="Toca para fijar tu porcentaje de ahorro"
        onClick={handleTap}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTap()
          }
        }}
        className="relative w-full cursor-pointer py-6"
      >
        {/* Track */}
        <div
          className="relative h-2 w-full rounded-full"
          style={{ background: 'var(--clay-soft)' }}
        >
          {/* Tick marks */}
          {[0, 10, 20, 30, 40].map((t) => (
            <span
              key={t}
              className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full"
              style={{
                left: `${(t / MAX_PCT) * 100}%`,
                background: 'var(--forest-deep)',
                opacity: 0.25,
              }}
              aria-hidden="true"
            />
          ))}
          {/* Marker */}
          <span
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md ring-2 ring-white"
            style={{
              left: `${leftPercent}%`,
              background: 'var(--leaf-bright)',
              transition: active ? 'none' : 'left 150ms ease-out',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Scale labels */}
        <div
          className="mt-2 flex justify-between text-xs"
          style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
        >
          <span>0%</span>
          <span>10%</span>
          <span>20%</span>
          <span>30%</span>
          <span>40%</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleTap}
        disabled={!active}
        className="w-full rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-50"
        style={{
          background: 'var(--forest-deep)',
          color: 'white',
        }}
      >
        ¡Ahora!
      </button>
    </div>
  )
}
