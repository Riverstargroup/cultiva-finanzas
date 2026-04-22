import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PredictionModalProps {
  open: boolean
  onConfirm: (value: number) => void
  onSkip: () => void
}

export function PredictionModal({ open, onConfirm, onSkip }: PredictionModalProps) {
  const [value, setValue] = useState('')

  const parsed = parseFloat(value.replace(',', '.'))
  const isValid = !isNaN(parsed) && parsed >= 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="organic-card w-full max-w-sm p-6 space-y-4"
          >
            <div className="text-center space-y-1">
              <span className="text-4xl block">🔮</span>
              <h3
                className="font-heading font-bold text-lg"
                style={{ color: 'var(--forest-deep)' }}
              >
                Haz tu predicción
              </h3>
              <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
                ¿Cuánto crees que crecerá tu ahorro? (%)
              </p>
            </div>

            <input
              type="number"
              min="0"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ej: 15.5"
              className="w-full rounded-xl border-2 px-4 py-3 text-center text-xl font-bold outline-none focus:border-[var(--leaf-bright)] bg-transparent"
              style={{ borderColor: 'var(--clay-soft)', color: 'var(--forest-deep)' }}
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={onSkip}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ background: 'var(--clay-light)', color: 'var(--leaf-muted)' }}
              >
                Saltar
              </button>
              <button
                onClick={() => isValid && onConfirm(parsed)}
                disabled={!isValid}
                className="vibrant-btn flex-1 justify-center disabled:opacity-40"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
