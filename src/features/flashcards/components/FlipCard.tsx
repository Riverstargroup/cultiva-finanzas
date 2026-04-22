import { motion, useReducedMotion } from 'framer-motion'

interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  isFlipped: boolean
  onClick?: () => void
}

export function FlipCard({ front, back, isFlipped, onClick }: FlipCardProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className="relative cursor-pointer" onClick={onClick}>
        <motion.div
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
        >
          {front}
        </motion.div>
        <motion.div
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0"
          style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
        >
          {back}
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={onClick}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d', position: 'relative' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front face */}
        <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          {front}
        </div>
        {/* Back face */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
