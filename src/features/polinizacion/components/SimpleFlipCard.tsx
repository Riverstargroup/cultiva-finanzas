import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface SimpleFlipCardProps {
  front: string
  back: string
  isFlipped: boolean
  onFlip: () => void
}

export function SimpleFlipCard({ front, back, isFlipped, onFlip }: SimpleFlipCardProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <button
        onClick={onFlip}
        className="organic-card w-full min-h-[160px] p-6 flex items-center justify-center text-center cursor-pointer"
        style={{ color: 'var(--forest-deep)' }}
      >
        <p className="text-base font-medium leading-relaxed">
          {isFlipped ? back : front}
        </p>
      </button>
    )
  }

  return (
    <div
      className="w-full min-h-[160px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: '160px' }}
      >
        {/* Front */}
        <div
          className="organic-card absolute inset-0 flex items-center justify-center p-6 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--forest-deep)' }}>
            {front}
          </p>
        </div>

        {/* Back */}
        <div
          className="organic-card absolute inset-0 flex items-center justify-center p-6 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'color-mix(in srgb, var(--leaf-fresh) 12%, var(--parchment-base, white))',
          }}
        >
          <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--forest-deep)' }}>
            {back}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
