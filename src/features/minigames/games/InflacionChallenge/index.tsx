import { motion, AnimatePresence } from 'framer-motion'
import { useMinigameSession } from '../../hooks/useMinigameSession'
import { useInflacionGame } from './useInflacionGame'

export function InflacionChallenge({ onBack }: { onBack: () => void }) {
  const {
    current,
    currentIndex,
    sliderValue,
    setSliderValue,
    revealed,
    results,
    lastResult,
    done,
    guess,
    next,
    min,
    max,
    total,
  } = useInflacionGame()
  const { saveSession } = useMinigameSession()

  const correctCount = results.filter(r => r.correct).length
  const awardedCoins = done && correctCount >= 1

  const handleNext = () => {
    if (currentIndex === total - 1) {
      saveSession('inflacion_challenge', correctCount * 10)
    }
    next()
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <span className="text-5xl">{awardedCoins ? '🪙' : '📊'}</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {correctCount} de {total} estimados correctos
        </h3>
        {awardedCoins && (
          <p className="text-sm text-yellow-600 font-medium">+30 monedas ganadas</p>
        )}
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          La inflación acumulada en México entre 2020 y 2025 fue de aproximadamente 40%.
        </p>
        <button
          onClick={onBack}
          className="w-full mt-2 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
        >
          Volver
        </button>
      </motion.div>
    )
  }

  if (!current) return null

  const inflationPct = Math.round(((current.price2025 - current.price2020) / current.price2020) * 100)

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Producto {currentIndex + 1} de {total}</span>
        <span>{correctCount} acertados</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="organic-card p-5 space-y-4"
        >
          {/* Product header */}
          <div className="flex items-center gap-3">
            <span className="text-4xl">{current.emoji}</span>
            <div>
              <p className="font-semibold text-base" style={{ color: 'var(--forest-deep)' }}>
                {current.product}
              </p>
              <p className="text-xs text-muted-foreground">
                En 2020 costaba: <span className="font-bold">${current.price2020}</span>
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${min}</span>
              <span className="font-bold text-primary text-base">${sliderValue}</span>
              <span>${max}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={1}
              value={sliderValue}
              onChange={e => setSliderValue(Number(e.target.value))}
              disabled={revealed}
              className="w-full accent-primary disabled:opacity-50"
              style={{ height: '28px' }}
            />
            <p className="text-center text-sm text-muted-foreground">
              Tu respuesta: <span className="font-bold text-foreground">${sliderValue}</span>
            </p>
          </div>

          {/* Reveal result */}
          <AnimatePresence>
            {revealed && lastResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  lastResult.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <p className="font-bold">
                  Precio real 2025: ${current.price2025}
                </p>
                <p className="text-xs mt-0.5">
                  Inflación real: +{inflationPct}% •{' '}
                  {lastResult.correct
                    ? `¡Muy cerca! Error: ${(lastResult.errorPct * 100).toFixed(1)}%`
                    : `Tu estimado: $${lastResult.guess} — Error: ${(lastResult.errorPct * 100).toFixed(1)}%`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action button */}
          {!revealed ? (
            <button
              onClick={guess}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Confirmar
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {currentIndex < total - 1 ? 'Siguiente →' : 'Ver resultado'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
