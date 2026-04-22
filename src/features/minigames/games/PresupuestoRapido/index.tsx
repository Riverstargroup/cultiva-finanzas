import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import { useMinigameSession } from '../../hooks/useMinigameSession'
import { ZONES } from './data'
import { usePresupuestoGame } from './usePresupuestoGame'

const ZONE_LABELS: Record<string, string> = {
  necesidades: 'Necesidades',
  deseos: 'Deseos',
  ahorro: 'Ahorro',
}

const ZONE_COLORS: Record<string, string> = {
  necesidades: 'bg-blue-100 border-blue-300 text-blue-800 active:bg-blue-200',
  deseos: 'bg-purple-100 border-purple-300 text-purple-800 active:bg-purple-200',
  ahorro: 'bg-green-100 border-green-300 text-green-800 active:bg-green-200',
}

const PASS_THRESHOLD = 40

export function PresupuestoRapido({ onBack }: { onBack: () => void }) {
  const { timer, score, gameState, startGame, classify, currentItem, classified, total } = usePresupuestoGame()
  const growPlant = useGrowPlant()
  const { saveSession } = useMinigameSession()
  const triggeredRef = useRef(false)

  const timerPct = (timer / 60) * 100
  const timerColor = timer > 20 ? 'bg-green-500' : timer > 10 ? 'bg-yellow-400' : 'bg-red-500'

  useEffect(() => {
    if (gameState === 'done' && !triggeredRef.current) {
      triggeredRef.current = true
      saveSession('presupuesto_rapido', score)
      if (score >= PASS_THRESHOLD) {
        growPlant.mutate({ domain: 'control', masteryDelta: 0.04 })
      }
    }
  }, [gameState]) // eslint-disable-line react-hooks/exhaustive-deps

  if (gameState === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <span className="text-6xl">💸</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          Presupuesto Rápido
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Clasifica 6 gastos en Necesidades, Deseos o Ahorro antes de que el tiempo se acabe. ¡60 segundos!
        </p>
        <button
          onClick={startGame}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Jugar
        </button>
      </motion.div>
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
        <AnimatePresence>
          {won && (
            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -40, scale: [0, 1.2, 0.8] }}
                  transition={{ delay: i * 0.06, duration: 0.7 }}
                  className="text-xl absolute"
                  style={{ left: `${10 + i * 12}%` }}
                >
                  {['🎉', '✨', '🌟', '💫', '🌈', '⭐', '🎊', '🏆'][i]}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
        <span className="text-5xl">{won ? '🎉' : '😅'}</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {won ? '¡Bien hecho!' : '¡Casi!'}
        </h3>
        <p className="text-3xl font-bold text-primary">{score} pts</p>
        <p className="text-sm text-muted-foreground">
          {classified} de {total} gastos clasificados
        </p>
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
            onClick={() => { triggeredRef.current = false; startGame() }}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
          >
            Repetir
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Timer bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tiempo restante</span>
          <span className={timer <= 10 ? 'text-red-500 font-bold' : ''}>{timer}s</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors ${timerColor}`}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">{classified}/{total} clasificados</p>
      </div>

      {/* Current expense */}
      <AnimatePresence mode="wait">
        {currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="organic-card p-6 text-center space-y-4"
          >
            <span className="text-6xl block">{currentItem.emoji}</span>
            <p className="font-semibold text-lg" style={{ color: 'var(--forest-deep)' }}>
              {currentItem.label}
            </p>
            <div className="flex flex-col gap-2">
              {ZONES.map(zone => (
                <button
                  key={zone}
                  onClick={() => classify(currentItem.id, zone)}
                  className={`w-full border rounded-xl font-semibold text-sm transition-colors ${ZONE_COLORS[zone]}`}
                  style={{ minHeight: '64px' }}
                >
                  {ZONE_LABELS[zone]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
