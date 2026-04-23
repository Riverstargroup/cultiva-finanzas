import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RewardToastProps {
  coins?: number
  streak?: number
  streakIncreased?: boolean
  levelUp?: { title: string; icon: string } | null
  onDismiss?: () => void
}

function CoinSVG({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="var(--leaf-bright)" />
      <circle cx="16" cy="16" r="12" fill="#FFD700" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="var(--forest-deep)"
        fontFamily="system-ui, sans-serif"
      >
        $
      </text>
    </svg>
  )
}

function AnimatedCount({ target, duration = 0.8 }: { target: number; duration?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      count.set(target)
      return
    }
    const controls = animate(count, target, { duration, ease: 'easeOut' })
    return controls.stop
  }, [target, duration, count, reduced])

  return <motion.span>{rounded}</motion.span>
}

export function RewardToast({
  coins = 50,
  streak,
  streakIncreased = false,
  levelUp = null,
  onDismiss,
}: RewardToastProps) {
  const reduced = useReducedMotion()
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    const t = setTimeout(() => dismissRef.current?.(), 3200)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={reduced ? undefined : { y: 72, opacity: 0, scale: 0.92 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={reduced ? undefined : { y: 72, opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        width: 'calc(100vw - 32px)',
        maxWidth: 360,
        pointerEvents: 'none',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="organic-card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        {/* Coins row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div
            animate={reduced ? undefined : { rotate: [0, -12, 12, -6, 6, 0], scale: [1, 1.15, 1] }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <CoinSVG size={40} />
          </motion.div>
          <div>
            <p
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--forest-deep)',
                lineHeight: 1,
                fontFamily: 'var(--font-heading, system-ui)',
              }}
            >
              +<AnimatedCount target={coins} />
            </p>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--leaf-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              monedas
            </p>
          </div>

          <div style={{ flex: 1 }} />

          {/* Semilla branding */}
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--leaf-bright)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            Semilla
          </span>
        </div>

        {/* Streak row */}
        {streakIncreased && streak != null && streak > 0 && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 12,
              background: 'color-mix(in srgb, #FF6B35 12%, transparent)',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🔥</span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--forest-deep)',
              }}
            >
              {streak} {streak === 1 ? 'día' : 'días'} de racha
            </span>
          </motion.div>
        )}

        {/* Level up row */}
        {levelUp && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 12,
              background: 'color-mix(in srgb, var(--leaf-bright) 12%, transparent)',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{levelUp.icon}</span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--forest-deep)',
              }}
            >
              ¡Ahora eres {levelUp.title}!
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export function RewardToastContainer({ children }: { children: React.ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>
}
