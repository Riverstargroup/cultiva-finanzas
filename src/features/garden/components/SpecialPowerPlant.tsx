import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SPECIAL_POWER_COLORS } from '../types'
import type { SpecialPower } from '../types'

interface SpecialPowerPlantProps {
  power: SpecialPower
  emoji: string
  name: string
  isActive: boolean
  size?: number
}

export function SpecialPowerPlant({ power, emoji, name, isActive, size = 56 }: SpecialPowerPlantProps) {
  const reduced = useReducedMotion()
  const colors = SPECIAL_POWER_COLORS[power]

  const auraMotion = isActive && !reduced
    ? power === 'fire'
      ? { animate: { opacity: [0.5, 1, 0.65] }, transition: { duration: 1.6, repeat: Infinity, repeatType: 'mirror' as const } }
      : power === 'gold'
      ? { animate: { rotate: [0, 360] }, transition: { duration: 18, repeat: Infinity, ease: 'linear' } }
      : {} // ice handled via emoji pulse
    : {}

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Aura ring */}
      {isActive && (
        <motion.div
          {...auraMotion}
          className="absolute inset-0 rounded-full"
          style={{
            background: power === 'gold'
              ? `conic-gradient(${colors.glow}, transparent, ${colors.glow})`
              : `radial-gradient(circle, ${colors.glow} 0%, ${colors.aura} 60%, transparent 100%)`,
            filter: `blur(${power === 'ice' ? 4 : 6}px)`,
            opacity: reduced ? 0.6 : undefined,
          }}
          aria-hidden="true"
        />
      )}

      {/* Plant emoji */}
      <motion.span
        className="relative text-4xl select-none"
        style={{ fontSize: size * 0.6 }}
        animate={isActive && !reduced ? { y: [0, -3, 0] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        role="img"
        aria-label={name}
      >
        {emoji}
      </motion.span>

      {/* Active badge */}
      {isActive && (
        <span
          className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
          style={{ background: colors.accent, color: '#fff', fontSize: 9 }}
          aria-label="Activo"
        >
          ✓
        </span>
      )}
    </div>
  )
}
