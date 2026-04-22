import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HarvestModalProps {
  open: boolean
  coins: number
  onClose: () => void
}

const CONFETTI_ITEMS = Array.from({ length: 16 }, (_, i) => i)

export function HarvestModal({ open, coins, onClose }: HarvestModalProps) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={onClose}
        >
          {/* Confetti dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI_ITEMS.map((i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${5 + (i * 6) % 90}%`,
                  background: ['#6dbf67', '#f9c74f', '#f8961e', '#90be6d', '#577590'][i % 5],
                }}
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{
                  y: ['0vh', '110vh'],
                  opacity: [1, 1, 0],
                  rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
                  x: [0, (i % 2 === 0 ? 1 : -1) * 60],
                }}
                transition={{ duration: 2.5, delay: i * 0.05, ease: 'easeIn' }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            className="organic-card p-8 text-center space-y-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-6xl block">🌾</span>
            <h3
              className="font-heading font-bold text-2xl"
              style={{ color: 'var(--forest-deep)' }}
            >
              ¡Cosecha lista!
            </h3>
            <p className="font-bold text-3xl" style={{ color: 'var(--leaf-bright)' }}>
              +{coins} 🪙
            </p>
            <p className="text-xs" style={{ color: 'var(--leaf-muted)' }}>
              Se cierra automáticamente…
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
