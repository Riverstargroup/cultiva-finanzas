import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useUserLevel } from '@/hooks/useUserLevel'

interface LevelBadgeProps {
  /** Show next-level requirement tooltip */
  showProgress?: boolean
  className?: string
}

export function LevelBadge({ showProgress = false, className }: LevelBadgeProps) {
  const reduced = useReducedMotion()
  const { data: level, isLoading } = useUserLevel()

  if (isLoading || !level) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${className ?? ''}`}
        style={{ background: 'color-mix(in srgb, var(--clay-soft) 30%, transparent)', width: 120, height: 32 }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <motion.div
        whileHover={reduced ? undefined : { scale: 1.03 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: 'color-mix(in srgb, var(--leaf-fresh) 14%, transparent)',
          border: '1.5px solid color-mix(in srgb, var(--leaf-bright) 40%, transparent)',
          width: 'fit-content',
        }}
        title={level.nextRequirement ?? `Nivel máximo alcanzado — ${level.title}`}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{level.icon}</span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--forest-deep)',
            letterSpacing: '0.01em',
          }}
        >
          {level.title}
        </span>
      </motion.div>

      {showProgress && level.nextRequirement && (
        <div style={{ maxWidth: 220 }}>
          {/* Progress bar toward next level */}
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'color-mix(in srgb, var(--leaf-muted) 20%, transparent)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--leaf-bright)' }}
              initial={{ width: 0 }}
              animate={{ width: `${level.progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <p
            className="mt-1"
            style={{
              fontSize: '0.65rem',
              color: 'var(--leaf-muted)',
              fontWeight: 600,
            }}
          >
            {level.nextRequirement}
            {level.nextIcon && level.nextTitle && (
              <> → {level.nextIcon} {level.nextTitle}</>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
