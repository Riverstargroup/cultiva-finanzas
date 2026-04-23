import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { CreditCard } from './data'

interface Props {
  readonly card: CreditCard
  readonly onSwipe: (direction: 'left' | 'right') => void
  readonly disabled?: boolean
}

const SWIPE_THRESHOLD = 80

export function SwipeCard({ card, onSwipe, disabled = false }: Props) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-150, 0, 150], [-12, 0, 12])
  const greenOpacity = useTransform(x, [0, 100], [0, 0.4])
  const redOpacity = useTransform(x, [-100, 0], [0.4, 0])
  const rightHintOpacity = useTransform(x, [20, 100], [0, 1])
  const leftHintOpacity = useTransform(x, [-100, -20], [1, 0])

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (disabled) return
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right')
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left')
    }
  }

  return (
    <motion.div
      className="organic-card p-5 relative overflow-hidden select-none"
      style={{
        x,
        rotate: reduced ? 0 : rotate,
        minHeight: '220px',
        touchAction: 'none',
        cursor: disabled ? 'default' : 'grab',
      }}
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: -150, right: 150 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={disabled ? undefined : { cursor: 'grabbing' }}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: reduced ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Green overlay (right = builds) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: greenOpacity,
          background:
            'linear-gradient(135deg, rgba(74, 222, 128, 0.45), rgba(22, 163, 74, 0.15))',
        }}
      />
      {/* Red overlay (left = hurts) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: redOpacity,
          background:
            'linear-gradient(225deg, rgba(239, 68, 68, 0.45), rgba(185, 28, 28, 0.15))',
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-3"
            style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
          >
            ¿Qué pasa con tu crédito?
          </p>
          <p
            className="font-heading text-lg font-bold leading-snug"
            style={{ color: 'var(--forest-deep)' }}
          >
            {card.action}
          </p>
          {card.context && (
            <p
              className="mt-2 text-xs leading-relaxed"
              style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
            >
              {card.context}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <motion.div
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: '#dc2626', opacity: leftHintOpacity }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            <span>Daña</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: '#16a34a', opacity: rightHintOpacity }}
          >
            <span>Construye</span>
            <ChevronRight size={16} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
