import { motion } from 'framer-motion'
import type { UserLevel } from '@/hooks/useUserLevel'

interface LevelConfig {
  emoji: string
  color: string
  bg: string
}

const LEVEL_CONFIG: Record<UserLevel, LevelConfig> = {
  'Semilla': {
    emoji: '🌱',
    color: 'var(--leaf-muted)',
    bg: 'color-mix(in srgb, var(--leaf-bright) 15%, var(--clay-soft))',
  },
  'Brote': {
    emoji: '🌿',
    color: 'var(--forest-deep)',
    bg: 'color-mix(in srgb, var(--leaf-bright) 22%, var(--clay-soft))',
  },
  'Jardinero': {
    emoji: '🌳',
    color: 'var(--forest-deep)',
    bg: 'color-mix(in srgb, var(--leaf-fresh) 35%, var(--clay-soft))',
  },
  'Maestro del Jardín': {
    emoji: '🏡',
    color: 'var(--terracotta-vivid)',
    bg: 'color-mix(in srgb, var(--terracotta-warm, var(--terracotta-vivid)) 12%, var(--clay-soft))',
  },
}

interface LevelBadgeProps {
  level: UserLevel
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  hint?: string
}

const SIZE = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
}

export function LevelBadge({ level, size = 'md', animated = false, hint }: LevelBadgeProps) {
  const cfg = LEVEL_CONFIG[level]
  const showHint = hint && size !== 'sm'

  if (showHint) {
    return (
      <div className="flex flex-col items-start gap-1">
        <motion.span
          key={level}
          initial={animated ? { scale: 0.8, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`inline-flex items-center rounded-full font-semibold ${SIZE[size]}`}
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          <span aria-hidden>{cfg.emoji}</span>
          <span>{level}</span>
        </motion.span>
        <span
          className="text-[10px] font-medium leading-tight pl-1"
          style={{ color: 'var(--leaf-muted)' }}
        >
          {hint}
        </span>
      </div>
    )
  }

  return (
    <motion.span
      key={level}
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`inline-flex items-center rounded-full font-semibold ${SIZE[size]}`}
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span aria-hidden>{cfg.emoji}</span>
      <span>{level}</span>
    </motion.span>
  )
}
