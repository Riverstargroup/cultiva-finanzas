import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePresupuestoGame } from './usePresupuestoGame'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import { useMinigameSession } from '../../hooks/useMinigameSession'
import { ZONES } from './data'

const PASS_THRESHOLD = 40

const ZONE_LABELS: Record<(typeof ZONES)[number], string> = {
  necesidades: 'Necesidades',
  deseos: 'Deseos',
  ahorro: 'Ahorro',
}

const ZONE_COLORS: Record<(typeof ZONES)[number], string> = {
  necesidades: 'bg-blue-100 border-blue-300 text-blue-800',
  deseos: 'bg-purple-100 border-purple-300 text-purple-800',
  ahorro: 'bg-green-100 border-green-300 text-green-800',
}

export function PresupuestoRapido({ onBack }: { onBack: () => void }) {
  const { gameState, timer, score, currentItem, currentIndex, totalItems, startGame, classify } =
    usePresupuestoGame()
  const growPlant = useGrowPlant()
  const { saveSession } = useMinigameSession()
  const rewardedRef = useRef(false)

  const timerPct = (timer / 60) * 100
  const timerColor = timer > 20 ? 'bg-green-500' : timer > 10 ? 'bg-yellow-400' : 'bg-red-500'

  useEffect(() => {
    if (gameState === 'done' && !rewardedRef.current) {
      rewardedRef.current = true
      saveSession('presupuesto_rapido', score)
      if (score >= PASS_THRESHOLD) {
        growPlant.mutate({ domain: 'control', masteryDelta: 0.04 })
      }
    }
  }, [gameState])

  if (gameState === 'idle') {
    return (
      <div className="organic-card p-6 space-y-4 text-center">
        <span className="text-5xl">💸</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          Presupuesto Rápido
        </h3>
        <p className="text-sm text-muted-foreground">
          Clasifica 6 gastos en Necesidades, Deseos y Ahorro antes de que el tiempo se acabe.
          +10 por acierto, -5 por error.
        </p>
        <button
          onClick={startGame}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Jugar
        </button>
      </div>
    )
  }

  if (gameState === 'done') {
    const won = score >= PASS_THRESHOLD
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="organic-card p-8 text-center space-y-4"
      >
        {won && (
          <div className="relative h-12">
            {['🎉', '✨', '🌟', '💚', '🎊', '⭐'].map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 text-xl"
                initial={{ opacity: 1, y: 0, x: 0 }}
                animate={{ opacity: 0, y: -70, x: (i - 2.5) * 35 }}
                transition={{ duration: 0.9, delay: i * 0.07 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        )}
        <span className="text-5xl">{won ? '🎉' : '😅'}</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {won ? '¡Bien hecho!' : '¡Casi!'}
        </h3>
        <p className="text-3xl font-bold text-primary">{score} pts</p>
        {won && (
          <p className="text-xs text-green-600 font-medium">🌱 Tu planta de control ha crecido</p>
        )}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
          >
            Volver
          </button>
          <button
            onClick={startGame}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
          >
            Jugar de nuevo
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tiempo restante</span>
          <span className={timer <= 10 ? 'text-red-500 font-bold' : ''}>{timer}s</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${timerColor} transition-colors`}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {currentIndex + 1} / {totalItems}
      </p>

      {/* Current expense card */}
      <AnimatePresence mode="wait">
        {currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="organic-card p-6 text-center space-y-2"
          >
            <span className="text-6xl block">{currentItem.emoji}</span>
            <p className="font-semibold text-lg">{currentItem.label}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Classification buttons — minimum 64px tall */}
      <div className="flex flex-col gap-2">
        {ZONES.map(zone => (
          <button
            key={zone}
            onClick={() => currentItem && classify(currentItem.id, zone)}
            className={`w-full rounded-xl border-2 font-semibold transition-colors active:scale-95 ${ZONE_COLORS[zone]}`}
            style={{ minHeight: '64px', fontSize: '1rem' }}
          >
            {ZONE_LABELS[zone]}
          </button>
        ))}
      </div>
    </div>
  )
}
