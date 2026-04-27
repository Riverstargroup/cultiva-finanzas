import { useEffect, useState } from 'react'
import { animate, useMotionValue, useTransform } from 'framer-motion'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'

interface AnimatedCoinCounterProps {
  value: number
  className?: string
}

export function AnimatedCoinCounter({ value, className }: AnimatedCoinCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsubscribe = rounded.on('change', setDisplay)
    return unsubscribe
  }, [rounded])

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: 'easeOut' })
    return controls.stop
  }, [count, value])

  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ''}`}>
      <img
        src={coinSprout}
        alt=""
        className="h-5 w-5"
        style={{ imageRendering: 'pixelated' }}
        aria-hidden="true"
      />
      {display}
    </span>
  )
}
