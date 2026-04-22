import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CONFIDENCE_OPTIONS } from '../types'
import type { ConfidenceOption } from '../types'

interface PredictionModalProps {
  scenarioTitle: string
  onConfirm: (predictedValue: number) => void
  isLoading?: boolean
}

export function PredictionModal({ scenarioTitle, onConfirm, isLoading }: PredictionModalProps) {
  const [selected, setSelected] = useState<ConfidenceOption | null>(null)
  const reduced = useReducedMotion()

  const handleConfirm = () => {
    if (!selected) return
    onConfirm(selected.value)
  }

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-3xl" role="img" aria-label="crystal ball">🔮</span>
        <h2
          className="font-heading font-bold text-xl"
          style={{ color: 'var(--forest-deep)' }}
        >
          Antes de comenzar
        </h2>
        <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
          ¿Cómo crees que te irá en <strong>"{scenarioTitle}"</strong>?
        </p>
        <p className="text-xs" style={{ color: 'var(--leaf-muted)', opacity: 0.7 }}>
          Si tu predicción es correcta, ganas +50 monedas bonus 🪙
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5" role="radiogroup" aria-label="Nivel de confianza">
        <AnimatePresence>
          {CONFIDENCE_OPTIONS.map((opt, i) => {
            const isSelected = selected?.value === opt.value
            return (
              <motion.button
                key={opt.value}
                initial={reduced ? undefined : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : i * 0.05, duration: 0.2 }}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(opt)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-150"
                style={{
                  background: isSelected
                    ? 'color-mix(in srgb, var(--leaf-bright) 12%, transparent)'
                    : 'rgba(255,255,255,0.7)',
                  border: `2px solid ${isSelected ? 'var(--leaf-bright)' : 'var(--clay-soft, #d4c5b0)'}`,
                  boxShadow: isSelected ? '0 0 0 3px color-mix(in srgb, var(--leaf-bright) 20%, transparent)' : 'none',
                }}
              >
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {opt.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: isSelected ? 'var(--forest-deep)' : 'var(--leaf-dark)' }}
                  >
                    {opt.label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--leaf-muted)', opacity: 0.8 }}
                  >
                    {opt.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.span
                    initial={reduced ? undefined : { scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-lg flex-shrink-0"
                    aria-hidden="true"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <button
        onClick={handleConfirm}
        disabled={!selected || isLoading}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-150 min-h-[44px]"
        style={{
          backgroundColor: selected ? 'var(--leaf-bright)' : 'var(--clay-soft, #d4c5b0)',
          opacity: !selected || isLoading ? 0.6 : 1,
          cursor: !selected || isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Guardando...' : selected ? 'Empezar escenario →' : 'Selecciona tu predicción'}
      </button>
    </motion.div>
  )
}
