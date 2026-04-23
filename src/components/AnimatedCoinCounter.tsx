import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

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
    <span className={className}>
      🪙 {display}
    </span>
  )
}
