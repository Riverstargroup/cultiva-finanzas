import { motion } from 'framer-motion'
import type { UserLevel } from '@/hooks/useUserLevel'

const LEVEL_CONFIG: Record<UserLevel, { emoji: string; color: string; bg: string }> = {
  'Semilla': { emoji: '🌱', color: '#5a7a2e', bg: '#e8f5e9' },
  'Brote': { emoji: '🌿', color: '#2e7a4e', bg: '#e0f4ea' },
  'Jardinero': { emoji: '🌳', color: '#1a5c3a', bg: '#d0eedc' },
  'Maestro del Jardín': { emoji: '🏆', color: '#7a5a00', bg: '#fff8e0' },
}

interface LevelBadgeProps {
  level: UserLevel
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const SIZE = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
}

export function LevelBadge({ level, size = 'md', animated = false }: LevelBadgeProps) {
  const cfg = LEVEL_CONFIG[level]

  return (
    <motion.span
      key={level}
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`inline-flex items-center rounded-full font-semibold ${SIZE[size]}`}
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span>{cfg.emoji}</span>
      <span>{level}</span>
    </motion.span>
  )
}
