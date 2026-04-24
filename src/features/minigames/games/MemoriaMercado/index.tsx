import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, Timer, XCircle } from 'lucide-react'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import { useMinigameSession } from '../../hooks/useMinigameSession'
import { useMemoriaMercado } from './useMemoriaMercado'
import { MemoryTile } from './MemoryTile'
import { ResultsView } from './ResultsView'

const INITIAL_TIMER = 90

interface Props {
  onBack: () => void
  mode?: 'standalone' | 'embedded'
}

export function MemoriaMercado({ onBack, mode = 'standalone' }: Props) {
  const {
    state,
    cards,
    flippedIds,
    matchedKeys,
    misses,
    timer,
    won,
    total,
    startGame,
    flipCard,
  } = useMemoriaMercado()

  const growPlant = useGrowPlant()
  const { saveSession } = useMinigameSession()
  const triggeredRef = useRef(false)

  const score =
    matchedKeys.length * 10 + Math.max(0, 30 - misses * 5) + Math.floor(timer / 3)

  useEffect(() => {
    if (state === 'done' && !triggeredRef.current) {
      triggeredRef.current = true
      saveSession('memoria-mercado', score)
      if (won) {
        growPlant.mutate({ domain: 'crecimiento', masteryDelta: 0.05 })
      }
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = () => {
    triggeredRef.current = false
    startGame()
  }

  const timerPct = (timer / INITIAL_TIMER) * 100
  const timerColor = timer > 30 ? 'bg-green-500' : timer > 15 ? 'bg-yellow-400' : 'bg-red-500'

  if (state === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <div className="flex justify-center">
          <Brain size={48} style={{ color: 'var(--forest-deep)' }} />
        </div>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          Memoria del Mercado
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Empareja cada instrumento de inversión mexicano con su descripción. 6 pares, 90
          segundos.
        </p>
        {mode !== 'embedded' && (
          <button
            onClick={startGame}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Jugar
          </button>
        )}
        {mode === 'embedded' && (
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
        matchedKeys={matchedKeys}
        misses={misses}
        timer={timer}
        won={won}
        total={total}
        score={score}
        onBack={onBack}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Timer size={12} /> Tiempo
          </span>
          <span className={timer <= 15 ? 'text-red-500 font-bold' : ''}>{timer}s</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors ${timerColor}`}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs pt-1">
          <span className="font-semibold" style={{ color: 'var(--forest-deep)' }}>
            {matchedKeys.length}/{total} pares
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <XCircle size={12} /> {misses} errores
          </span>
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
      >
        {cards.map((card) => (
          <MemoryTile
            key={card.id}
            card={card}
            flipped={flippedIds.includes(card.id)}
            matched={matchedKeys.includes(card.pairKey)}
            onClick={() => flipCard(card.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default MemoriaMercado
