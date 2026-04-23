import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import { useMinigameSession } from '../../hooks/useMinigameSession'
import { AhorraCosechaIllustration } from '../../assets/AhorraCosechaIllustration'
import { Pendulum } from './Pendulum'
import { RevealBand } from './RevealBand'
import { ResultsView } from './ResultsView'
import { useAhorraCosecha } from './useAhorraCosecha'

interface AhorraCosechaProps {
  onBack: () => void
  mode?: 'standalone' | 'embedded'
}

const BASE_SPEED = 1.0
const SPEED_INCREMENT = 0.25

function formatMxn(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function AhorraCosecha({ onBack, mode = 'standalone' }: AhorraCosechaProps) {
  const {
    state,
    roundIndex,
    currentRound,
    attempts,
    lastAttempt,
    totalPoints,
    won,
    totalRounds,
    startGame,
    tap,
    nextRound,
  } = useAhorraCosecha()
  const { saveSession } = useMinigameSession()
  const growPlant = useGrowPlant()
  const triggeredRef = useRef<boolean>(false)

  useEffect(() => {
    if (state !== 'done') {
      triggeredRef.current = false
      return
    }
    if (triggeredRef.current) return
    triggeredRef.current = true
    void saveSession('ahorra-cosecha', totalPoints)
    if (won) {
      growPlant.mutate({ domain: 'proteccion', masteryDelta: 0.05 })
    }
  }, [state, totalPoints, won, saveSession, growPlant])

  const speed = BASE_SPEED + roundIndex * SPEED_INCREMENT

  if (state === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="organic-card space-y-5 p-6"
      >
        <div className="flex justify-center">
          <AhorraCosechaIllustration className="h-28 w-auto" />
        </div>
        <header className="space-y-1 text-center">
          <h3
            className="font-heading text-lg font-bold"
            style={{ color: 'var(--forest-deep)' }}
          >
            Ahorra la Cosecha
          </h3>
          <p className="text-sm" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
            Un marcador oscila entre 0% y 40%. Tócalo en el momento justo para
            fijar tu tasa de ahorro según tu situación.
          </p>
        </header>
        {mode !== 'embedded' && (
          <button
            onClick={startGame}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: 'var(--forest-deep)' }}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Jugar
          </button>
        )}
        {mode === 'embedded' && (
          <button
            onClick={startGame}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: 'var(--forest-deep)' }}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Empezar
          </button>
        )}
      </motion.div>
    )
  }

  if (state === 'done') {
    return (
      <ResultsView
        attempts={attempts}
        totalPoints={totalPoints}
        won={won}
        onBack={onBack}
        onRestart={startGame}
      />
    )
  }

  // swinging or revealing
  return (
    <div className="space-y-4">
      <div
        className="flex justify-between text-xs"
        style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
      >
        <span>
          Ronda {roundIndex + 1} de {totalRounds}
        </span>
        <span>{totalPoints} pts</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentRound.id}-${state}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="organic-card space-y-5 p-5"
        >
          <header className="space-y-1">
            <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
              Ingreso mensual
            </p>
            <p
              className="font-heading text-2xl font-bold"
              style={{ color: 'var(--forest-deep)' }}
            >
              {formatMxn(currentRound.monthlyIncomeMXN)}
            </p>
            <p className="text-sm" style={{ color: 'var(--forest-deep)' }}>
              {currentRound.situation}
            </p>
          </header>

          {state === 'swinging' && (
            <Pendulum active speed={speed} onTap={tap} />
          )}

          {state === 'revealing' && lastAttempt && (
            <>
              <RevealBand
                round={currentRound}
                chosenPct={lastAttempt.chosenPct}
                inBand={lastAttempt.inBand}
                pointsEarned={lastAttempt.pointsEarned}
              />
              <button
                onClick={nextRound}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
                style={{ background: 'var(--forest-deep)' }}
              >
                {roundIndex < totalRounds - 1 ? 'Siguiente' : 'Ver resultado'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
