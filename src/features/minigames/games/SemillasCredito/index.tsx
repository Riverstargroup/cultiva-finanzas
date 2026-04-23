import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import { useMinigameSession } from '../../hooks/useMinigameSession'
import { ScoreDial } from './ScoreDial'
import { SwipeCard } from './SwipeCard'
import { ResultsView } from './ResultsView'
import { useSemillasCredito } from './useSemillasCredito'

export const PASS_THRESHOLD = 700

interface Props {
  readonly onBack: () => void
  readonly mode?: 'standalone' | 'embedded'
}

export function SemillasCredito({ onBack, mode = 'standalone' }: Props) {
  const {
    state,
    currentCard,
    deckIndex,
    score,
    history,
    total,
    startGame,
    swipe,
  } = useSemillasCredito()

  const growPlant = useGrowPlant()
  const { saveSession } = useMinigameSession()
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (state === 'done' && !triggeredRef.current) {
      triggeredRef.current = true
      saveSession('semillas-credito', score)
      if (score >= PASS_THRESHOLD) {
        growPlant.mutate({ domain: 'credito', masteryDelta: 0.04 })
      }
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = () => {
    triggeredRef.current = false
    startGame()
  }

  if (state === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-full"
          style={{ background: 'rgba(74, 222, 128, 0.18)' }}
        >
          <Sparkles size={22} style={{ color: 'var(--forest-deep)' }} />
        </span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          Semillas de Crédito
        </h3>
        <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
          Desliza a la derecha si la acción <strong>construye</strong> tu crédito, a la izquierda si
          lo <strong>daña</strong>. 10 cartas, score inicial 650.
        </p>
        {mode !== 'embedded' && (
          <button
            onClick={startGame}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Jugar
          </button>
        )}
      </motion.div>
    )
  }

  if (state === 'done') {
    return (
      <ResultsView
        history={history}
        score={score}
        total={total}
        won={score >= PASS_THRESHOLD}
        onBack={onBack}
        onRestart={handleRestart}
      />
    )
  }

  const shown = Math.min(deckIndex + 1, total)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <ScoreDial score={score} />
        <div className="text-right">
          <p
            className="text-[10px] uppercase tracking-[0.18em] font-semibold"
            style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
          >
            Carta
          </p>
          <p className="font-heading text-2xl font-bold" style={{ color: 'var(--forest-deep)' }}>
            {shown}
            <span
              className="text-sm font-normal"
              style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
            >
              {' '}
              / {total}
            </span>
          </p>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {currentCard && (
            <SwipeCard key={currentCard.id} card={currentCard} onSwipe={swipe} />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => currentCard && swipe('left')}
          className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors"
          style={{
            borderColor: 'rgba(220, 38, 38, 0.35)',
            color: '#b91c1c',
            background: 'rgba(239, 68, 68, 0.06)',
          }}
          aria-label="Daña el crédito"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Daña
        </button>
        <button
          type="button"
          onClick={() => currentCard && swipe('right')}
          className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors"
          style={{
            borderColor: 'rgba(22, 163, 74, 0.4)',
            color: '#15803d',
            background: 'rgba(74, 222, 128, 0.1)',
          }}
          aria-label="Construye crédito"
        >
          Construye
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <p
        className="text-center text-[11px]"
        style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
      >
        Desliza la tarjeta o toca un botón
      </p>
    </div>
  )
}

export default SemillasCredito
