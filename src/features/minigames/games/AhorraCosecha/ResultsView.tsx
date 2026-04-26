import { motion } from 'framer-motion'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { ShareScoreButton } from '@/features/minigames/components/ShareScoreButton'
import type { SavingsAttempt } from './useAhorraCosecha'

interface ResultsViewProps {
  attempts: SavingsAttempt[]
  totalPoints: number
  won: boolean
  onBack: () => void
  onRestart: () => void
}

function formatMxn(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ResultsView({
  attempts,
  totalPoints,
  won,
  onBack,
  onRestart,
}: ResultsViewProps) {
  const hits = attempts.filter((a) => a.inBand).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="organic-card space-y-5 p-6"
    >
      <header className="text-center">
        <h3
          className="font-heading text-xl font-bold"
          style={{ color: 'var(--forest-deep)' }}
        >
          {won ? '¡Cosecha lograda!' : 'Sigue practicando'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
          {hits} de {attempts.length} rondas en la zona · {totalPoints} pts
        </p>
      </header>

      <ul className="space-y-2">
        {attempts.map((a, i) => (
          <li
            key={a.round.id}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs"
            style={{
              background: a.inBand
                ? 'color-mix(in oklab, var(--leaf-bright) 18%, white)'
                : 'var(--clay-soft)',
            }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="truncate font-semibold"
                style={{ color: 'var(--forest-deep)' }}
              >
                Ronda {i + 1} · {formatMxn(a.round.monthlyIncomeMXN)}
              </p>
              <p className="truncate" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
                Tu {Math.round(a.chosenPct)}% · meta {a.round.targetPct}%
              </p>
            </div>
            <span
              className="ml-3 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{
                background: a.inBand ? 'var(--leaf-bright)' : 'transparent',
                color: a.inBand ? 'white' : 'var(--forest-deep)',
                border: a.inBand ? 'none' : '1px solid var(--forest-deep)',
              }}
            >
              {a.pointsEarned} pts
            </span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </button>
        <ShareScoreButton score={totalPoints} gameTitle="Ahorra la Cosecha" />
        <button
          onClick={onRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white"
          style={{ background: 'var(--forest-deep)' }}
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Repetir
        </button>
      </div>
    </motion.div>
  )
}
