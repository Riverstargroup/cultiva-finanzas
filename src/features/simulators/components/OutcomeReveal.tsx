import { motion, AnimatePresence } from 'framer-motion'

interface OutcomeRevealProps {
  open: boolean
  isCorrect: boolean
  predictedValue: number
  actualValue: number
  onClose: () => void
}

export function OutcomeReveal({
  open,
  isCorrect,
  predictedValue,
  actualValue,
  onClose,
}: OutcomeRevealProps) {
  const diffPct =
    actualValue !== 0
      ? Math.round((Math.abs(predictedValue - actualValue) / Math.abs(actualValue)) * 100)
      : 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          style={{ background: 'var(--parchment-base, #faf6f0)' }}
        >
          <div className="max-w-sm mx-auto organic-card p-6 text-center space-y-3">
            {isCorrect ? (
              <>
                <span className="text-5xl block">🎯</span>
                <h3
                  className="font-heading font-bold text-xl"
                  style={{ color: 'var(--forest-deep)' }}
                >
                  ¡Acertaste!
                </h3>
                <p className="font-bold text-2xl" style={{ color: 'var(--leaf-bright)' }}>
                  +50 🪙
                </p>
              </>
            ) : (
              <>
                <span className="text-5xl block">🌱</span>
                <h3
                  className="font-heading font-bold text-xl"
                  style={{ color: 'var(--forest-deep)' }}
                >
                  Buen intento
                </h3>
                <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
                  Estuviste{' '}
                  <span className="font-bold" style={{ color: 'var(--forest-deep)' }}>
                    {diffPct}%
                  </span>{' '}
                  lejos del resultado real
                </p>
              </>
            )}
            <button
              onClick={onClose}
              className="vibrant-btn w-full justify-center mt-2"
            >
              Continuar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
