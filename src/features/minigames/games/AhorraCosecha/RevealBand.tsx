import { motion } from 'framer-motion'
import type { SavingsRound } from './data'

interface RevealBandProps {
  round: SavingsRound
  chosenPct: number
  inBand: boolean
  pointsEarned: number
}

const MAX_PCT = 40

function resultLabel(inBand: boolean, pointsEarned: number): string {
  if (inBand) return `¡En la zona! +${pointsEarned} pts`
  if (pointsEarned > 0) return `Cerca... +${pointsEarned} pts`
  return 'Muy lejos 0 pts'
}

export function RevealBand({ round, chosenPct, inBand, pointsEarned }: RevealBandProps) {
  const bandStart = Math.max(0, round.targetPct - round.bandTolerance)
  const bandEnd = Math.min(MAX_PCT, round.targetPct + round.bandTolerance)
  const bandLeftPct = (bandStart / MAX_PCT) * 100
  const bandWidthPct = ((bandEnd - bandStart) / MAX_PCT) * 100
  const targetLeftPct = (round.targetPct / MAX_PCT) * 100
  const chosenLeftPct = (chosenPct / MAX_PCT) * 100

  return (
    <div className="space-y-4">
      {/* Scale with band */}
      <div className="relative py-6">
        <div
          className="relative h-3 w-full rounded-full"
          style={{ background: 'var(--clay-soft)' }}
        >
          {/* Target band */}
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${bandWidthPct}%`, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute top-0 h-full rounded-full"
            style={{
              left: `${bandLeftPct}%`,
              background: 'var(--leaf-bright)',
              opacity: 0.55,
            }}
            aria-hidden="true"
          />

          {/* Target marker */}
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
            style={{
              left: `${targetLeftPct}%`,
              background: 'var(--forest-deep)',
            }}
            aria-hidden="true"
          />

          {/* Chosen marker */}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg ring-2 ring-white"
            style={{
              left: `${chosenLeftPct}%`,
              background: inBand ? 'var(--leaf-bright)' : '#a855f7',
            }}
            aria-hidden="true"
          />
        </div>

        <div
          className="mt-2 flex justify-between text-xs"
          style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
        >
          <span>0%</span>
          <span>20%</span>
          <span>40%</span>
        </div>
      </div>

      {/* Result text */}
      <div className="flex items-baseline justify-between gap-3">
        <p
          className="text-sm font-semibold"
          style={{ color: inBand ? 'var(--forest-deep)' : '#7c3aed' }}
        >
          {resultLabel(inBand, pointsEarned)}
        </p>
        <p className="text-xs" style={{ color: 'var(--leaf-muted, #6b7a6b)' }}>
          Elegiste <span className="font-bold">{Math.round(chosenPct)}%</span> · Meta{' '}
          <span className="font-bold">{round.targetPct}%</span>
        </p>
      </div>

      <p
        className="rounded-xl p-3 text-xs leading-relaxed"
        style={{
          background: 'var(--clay-soft)',
          color: 'var(--forest-deep)',
        }}
      >
        {round.explanation}
      </p>
    </div>
  )
}
