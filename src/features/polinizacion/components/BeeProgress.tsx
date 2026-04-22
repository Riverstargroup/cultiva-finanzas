import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface BeeProgressProps {
  sessionCount: number
}

export function BeeProgress({ sessionCount }: BeeProgressProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="organic-card p-4 flex items-center gap-4"
      initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-4xl"
        animate={shouldReduceMotion ? {} : { rotate: [0, -8, 8, 0] }}
        transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.4 }}
      >
        🐝
      </motion.span>
      <div>
        <p className="font-bold text-sm" style={{ color: 'var(--forest-deep)' }}>
          {sessionCount === 0
            ? 'Primera polinización'
            : `${sessionCount} ${sessionCount === 1 ? 'día polinizando' : 'días polinizando'}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {sessionCount === 0
            ? 'Aprende de un área diferente hoy'
            : sessionCount < 7
            ? '¡Sigue así! Cada día creces más'
            : '¡Eres un polinizador experto! 🌺'}
        </p>
      </div>
    </motion.div>
  )
}
