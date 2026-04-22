import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInflacionGame } from './useInflacionGame'
import { useMinigameSession } from '../../hooks/useMinigameSession'

export function InflacionChallenge({ onBack }: { onBack: () => void }) {
  const {
    currentProduct,
    currentIndex,
    totalProducts,
    sliderValue,
    setSliderValue,
    sliderMin,
    sliderMax,
    revealed,
    results,
    done,
    coinsAwarded,
    currentResult,
    guess,
    next,
  } = useInflacionGame()
  const { saveSession } = useMinigameSession()
  const savedRef = useRef(false)

  useEffect(() => {
    if (done && !savedRef.current) {
      savedRef.current = true
      const correctCount = results.filter(r => r.correct).length
      saveSession('inflacion_challenge', correctCount)
    }
  }, [done])

  if (done) {
    const correctCount = results.filter(r => r.correct).length
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <span className="text-5xl">{coinsAwarded ? '🪙' : '📊'}</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {correctCount} de {totalProducts} estimados correctos
        </h3>
        {coinsAwarded && (
          <p className="text-xs text-yellow-600 font-medium">+30 monedas ganadas</p>
        )}
        <button
          onClick={onBack}
          className="mt-2 w-full px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
        >
          Volver
        </button>
      </motion.div>
    )
  }

  const inflationPct = Math.round(
    ((currentProduct.price2025 - currentProduct.price2020) / currentProduct.price2020) * 100,
  )

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground text-center">
        Producto {currentIndex + 1} de {totalProducts} — adivina el precio 2025 con menos del 15% de error
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="organic-card p-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentProduct.emoji}</span>
            <div>
              <p className="font-semibold">{currentProduct.product}</p>
              <p className="text-xs text-muted-foreground">
                En 2020 costaba:{' '}
                <span className="font-bold">${currentProduct.price2020}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">${sliderMin}</span>
              <span className="font-bold text-primary text-sm">Tu respuesta: ${sliderValue}</span>
              <span className="text-muted-foreground">${sliderMax}</span>
            </div>
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={1}
              value={sliderValue}
              onChange={e => setSliderValue(Number(e.target.value))}
              disabled={revealed}
              className="w-full accent-primary disabled:opacity-50"
              style={{ height: '44px' }}
            />
          </div>

          <AnimatePresence>
            {revealed && currentResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  currentResult.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                <p>
                  Precio real 2025:{' '}
                  <span className="font-bold">${currentProduct.price2025}</span>
                </p>
                <p className="text-xs mt-0.5">
                  Inflación: {inflationPct}%
                  {currentResult.correct
                    ? ` — ¡Muy cerca! Error: ${(currentResult.errorPct * 100).toFixed(1)}%`
                    : ` — Tu estimado: $${currentResult.guess} — Error: ${(currentResult.errorPct * 100).toFixed(1)}%`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed ? (
            <button
              onClick={guess}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Confirmar
            </button>
          ) : (
            <button
              onClick={next}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              {currentIndex >= totalProducts - 1 ? 'Ver resultados' : 'Siguiente'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
