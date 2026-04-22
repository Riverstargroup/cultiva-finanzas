import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface WeeklyProgressProps {
  completed: number
  total?: number
}

export function WeeklyProgress({ completed, total = 5 }: WeeklyProgressProps) {
  const shouldReduceMotion = useReducedMotion()
  const pct = Math.min(100, Math.round((completed / total) * 100))

  return (
    <div className="organic-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: 'var(--forest-deep)' }}>
          🌾 Retos esta semana
        </p>
        <span className="text-sm font-bold" style={{ color: 'var(--leaf-bright)' }}>
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--garden-plot-surface)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--leaf-bright)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {completed >= total && (
        <p className="text-xs text-center font-medium" style={{ color: 'var(--leaf-bright)' }}>
          ¡Cosecha completa esta semana! 🎉
        </p>
      )}
    </div>
  )
}
