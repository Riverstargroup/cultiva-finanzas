import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function getSecondsUntilMidnight(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setDate(midnight.getDate() + 1)
  midnight.setHours(0, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function DailyLock() {
  const shouldReduceMotion = useReducedMotion()
  const [secondsLeft, setSecondsLeft] = useState(getSecondsUntilMidnight)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsUntilMidnight())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="organic-card p-8 flex flex-col items-center gap-4 text-center"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-5xl"
        animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        🐝
      </motion.span>

      <div className="space-y-1">
        <p className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
          Ya polinizaste hoy
        </p>
        <p className="text-sm text-muted-foreground">
          Vuelve mañana para seguir aprendiendo
        </p>
      </div>

      <div
        className="px-6 py-3 rounded-2xl"
        style={{ backgroundColor: 'var(--garden-plot-surface)' }}
      >
        <p className="text-xs text-muted-foreground mb-1">Próxima sesión en</p>
        <p className="font-mono text-2xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {formatCountdown(secondsLeft)}
        </p>
      </div>
    </motion.div>
  )
}
