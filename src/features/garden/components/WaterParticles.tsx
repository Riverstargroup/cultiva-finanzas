import { useEffect, useRef, useState } from 'react'

interface WaterDropProps {
  x: string
  y: string
  delay?: number
  onDone: () => void
}

export function WaterDrop({ x, y, delay = 0, onDone }: WaterDropProps): JSX.Element {
  const [progress, setProgress] = useState(0)
  const startRef = useRef<number | null>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    let raf = 0
    const tick = (t: number): void => {
      if (startRef.current === null) startRef.current = t + delay * 1000
      const elapsed = Math.max(0, t - startRef.current) / 700
      if (elapsed >= 1) {
        doneRef.current()
        return
      }
      setProgress(elapsed)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [delay])

  const dy = progress * 55
  const opacity = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: `calc(${y} + ${dy}px)`,
        width: 5,
        height: 9,
        background: 'linear-gradient(180deg, #93C5FD 0%, #BFDBFE 100%)',
        borderRadius: '50% 50% 60% 60%',
        opacity,
        pointerEvents: 'none',
        transform: 'translateX(-50%)',
        boxShadow: '0 0 5px rgba(147,197,253,0.8)',
        zIndex: 50,
      }}
    />
  )
}

interface WaterRippleProps {
  x: string
  y: string
  onDone: () => void
}

export function WaterRipple({ x, y, onDone }: WaterRippleProps): JSX.Element {
  const [scale, setScale] = useState(0.1)
  const [opacity, setOpacity] = useState(0.8)
  const startRef = useRef<number | null>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    let raf = 0
    const tick = (t: number): void => {
      if (startRef.current === null) startRef.current = t
      const p = (t - startRef.current) / 600
      if (p >= 1) {
        doneRef.current()
        return
      }
      setScale(0.2 + p * 1.6)
      setOpacity(0.8 * (1 - p))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 28,
        height: 10,
        borderRadius: '50%',
        border: '2px solid #93C5FD',
        opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  )
}
