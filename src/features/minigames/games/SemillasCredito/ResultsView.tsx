import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { ScoreDial } from './ScoreDial'
import type { SwipeRecord } from './useSemillasCredito'

interface Props {
  readonly history: readonly SwipeRecord[]
  readonly score: number
  readonly total: number
  readonly won: boolean
  onBack: () => void
  onRestart: () => void
}

function rightLabelForImpact(impact: SwipeRecord['card']['impact']): string {
  if (impact === 'builds') return 'deslizar a la derecha (construye)'
  if (impact === 'hurts') return 'deslizar a la izquierda (daña)'
  return 'cualquier dirección (neutral)'
}

export function ResultsView({ history, score, total, won, onBack, onRestart }: Props) {
  const correctCount = history.filter((h) => h.correct).length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="organic-card p-6 space-y-5"
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <ScoreDial score={score} />
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {won ? 'Plantaste una semilla de crédito' : 'Sigue cultivando'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
          {correctCount} de {total} decisiones acertadas
        </p>
        {won && (
          <p className="text-xs font-medium" style={{ color: '#16a34a' }}>
            Tu lirio de crédito ha crecido
          </p>
        )}
      </div>

      <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {history.map((h, idx) => {
          const isCorrect = h.correct
          return (
            <li
              key={`${h.card.id}-${idx}`}
              className="flex items-start gap-2 text-xs p-2.5 rounded-xl"
              style={{
                background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${
                  isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'
                }`,
              }}
            >
              <span
                className="mt-0.5 flex-shrink-0"
                style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}
              >
                {isCorrect ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
              </span>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: 'var(--forest-deep)' }}>
                  {h.card.action}
                </p>
                <p className="mt-0.5" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
                  {h.card.explanation}
                </p>
                {!isCorrect && (
                  <p className="mt-1 italic" style={{ color: '#b45309' }}>
                    Lo correcto era {rightLabelForImpact(h.card.impact)}.
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
        >
          Volver
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
        >
          Repetir
        </button>
      </div>
    </motion.div>
  )
}
