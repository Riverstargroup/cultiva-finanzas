import { useEffect, useState } from 'react'

// Shared animation hooks and SVG primitives for animated plant characters
// Ported from the Mi Jardín prototype (plants.jsx)

export type PlantMood = 'idle' | 'happy' | 'worried' | 'cheer' | 'sleeping'

export function useBlink(enabled = true, minGap = 2800, maxGap = 5200): boolean {
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    if (!enabled) return
    let t1: ReturnType<typeof setTimeout> | undefined
    let t2: ReturnType<typeof setTimeout> | undefined
    const loop = (): void => {
      t1 = setTimeout(() => {
        setClosed(true)
        t2 = setTimeout(() => {
          setClosed(false)
          loop()
        }, 130 + Math.random() * 80)
      }, minGap + Math.random() * (maxGap - minGap))
    }
    loop()
    return () => {
      if (t1) clearTimeout(t1)
      if (t2) clearTimeout(t2)
    }
  }, [enabled, minGap, maxGap])
  return closed
}

export function useOscillate(period = 3000, amp = 1): number {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    let start: number | null = null
    const tick = (t: number): void => {
      if (start === null) start = t
      setVal(Math.sin(((t - start) / period) * Math.PI * 2) * amp)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [period, amp])
  return val
}

export function useRatchet(period = 1000): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    let start: number | null = null
    const tick = (t: number): void => {
      if (start === null) start = t
      setV(((t - start) / period) % 1)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [period])
  return v
}

interface EyeProps {
  cx: number
  cy: number
  r?: number
  closed: boolean
  mood?: PlantMood
  irisColor?: string
}

export function Eye({ cx, cy, r = 6, closed, mood = 'idle', irisColor = '#1B3B26' }: EyeProps): JSX.Element {
  if (mood === 'sleeping') {
    return (
      <path
        d={`M ${cx - r} ${cy} Q ${cx} ${cy - r * 0.5} ${cx + r} ${cy}`}
        stroke={irisColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    )
  }
  const scaleY = closed ? 0.08 : 1
  const pupilDy = mood === 'cheer' ? r * 0.1 : mood === 'worried' ? -r * 0.15 : 0
  const pupilR = r * (mood === 'cheer' ? 0.55 : 0.42)
  return (
    <g transform={`translate(${cx} ${cy}) scale(1 ${scaleY})`}>
      <ellipse rx={r} ry={r} fill="#FEFBF6" stroke={irisColor} strokeWidth="1" />
      {!closed && (
        <>
          <circle cy={pupilDy} r={pupilR} fill={irisColor} />
          <circle cx={-pupilR * 0.3} cy={pupilDy - pupilR * 0.35} r={pupilR * 0.33} fill="#FEFBF6" />
        </>
      )}
      {mood === 'worried' && (
        <path
          d={`M ${-r - 1} ${-r - 2} L ${r * 0.4} ${-r - 0.5}`}
          stroke={irisColor}
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          style={{ transform: `scale(1 ${1 / scaleY})` }}
        />
      )}
    </g>
  )
}

interface MouthProps {
  cx: number
  cy: number
  mood?: PlantMood
  color?: string
  r?: number
}

export function Mouth({ cx, cy, mood = 'idle', color = '#7C2D12', r = 3.5 }: MouthProps): JSX.Element {
  if (mood === 'cheer') return <ellipse cx={cx} cy={cy + 0.5} rx={r * 0.9} ry={r * 1.1} fill={color} />
  if (mood === 'worried')
    return (
      <path
        d={`M${cx - r} ${cy + 2} Q${cx} ${cy - 1} ${cx + r} ${cy + 2}`}
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    )
  if (mood === 'sleeping')
    return (
      <path
        d={`M${cx - r * 0.6} ${cy} Q${cx} ${cy + r * 0.4} ${cx + r * 0.6} ${cy}`}
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    )
  if (mood === 'happy')
    return (
      <path
        d={`M${cx - r} ${cy - 0.5} Q${cx} ${cy + r * 0.8} ${cx + r} ${cy - 0.5}`}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    )
  return (
    <path
      d={`M${cx - r * 0.8} ${cy} Q${cx} ${cy + r * 0.7} ${cx + r * 0.8} ${cy}`}
      stroke={color}
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
    />
  )
}

export interface PlantCharProps {
  size?: number
  mood?: PlantMood
}
