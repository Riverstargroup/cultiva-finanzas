import { motion } from 'framer-motion'
import type { Gasto, Zone } from './data'

const ZONE_LABEL: Record<Zone, string> = {
  necesidades: 'Necesidades',
  deseos: 'Deseos',
  ahorro: 'Ahorro',
  deudas: 'Deudas',
}

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString('es-MX')}`
}

interface Props {
  items: readonly Gasto[]
  placements: Record<string, Zone>
  score: number
  total: number
  won: boolean
  onBack: () => void
  onRestart: () => void
}

export function ResultsView({ items, placements, score, total, won, onBack, onRestart }: Props) {
  const correctCount = items.filter((g) => placements[g.id] === g.correct).length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="organic-card p-6 space-y-4"
    >
      <div className="text-center space-y-2">
        <span className="text-5xl block">{won ? '🎉' : '😅'}</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {won ? '¡Bien hecho!' : '¡Casi!'}
        </h3>
        <p className="text-3xl font-bold text-primary">{score} pts</p>
        <p className="text-sm text-muted-foreground">
          {correctCount} de {total} correctos
        </p>
        {won && (
          <p className="text-xs text-green-600 font-medium">🌱 Tu planta de control ha crecido</p>
        )}
      </div>

      <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {items.map((g) => {
          const placed = placements[g.id]
          const isCorrect = placed === g.correct
          return (
            <li
              key={g.id}
              className="flex items-start gap-2 text-xs p-2 rounded-lg"
              style={{
                background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              <span className="text-base leading-none mt-0.5">{isCorrect ? '✓' : '✗'}</span>
              <span className="text-lg leading-none">{g.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: 'var(--forest-deep)' }}>
                  {g.label}{' '}
                  <span className="font-normal text-muted-foreground">
                    · {formatAmount(g.amount)}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  {g.explanation}. Va en <strong>{ZONE_LABEL[g.correct]}</strong>
                  {placed && !isCorrect ? ` (tú: ${ZONE_LABEL[placed]})` : ''}.
                </p>
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
