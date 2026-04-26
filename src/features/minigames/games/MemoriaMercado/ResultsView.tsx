import { motion } from 'framer-motion'
import { Trophy, Clock, XCircle } from 'lucide-react'
import { ShareScoreButton } from '@/features/minigames/components/ShareScoreButton'
import type { InstrumentId } from './data'

interface Props {
  matchedKeys: readonly InstrumentId[]
  misses: number
  timer: number
  won: boolean
  total: number
  score: number
  onBack: () => void
  onRestart: () => void
}

export function ResultsView({
  matchedKeys,
  misses,
  timer,
  won,
  total,
  score,
  onBack,
  onRestart,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="organic-card p-6 space-y-5"
    >
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          {won ? (
            <Trophy size={44} style={{ color: 'var(--leaf-bright, #4ade80)' }} />
          ) : (
            <Clock size={44} style={{ color: 'var(--clay-soft, #d4c5b0)' }} />
          )}
        </div>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {won ? '¡Memoria de oro!' : 'Se acabó el tiempo'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {won
            ? 'Encontraste los 6 instrumentos del mercado mexicano.'
            : 'Vuelve a intentarlo — cada ronda fija los conceptos.'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat
          label="Pares"
          value={`${matchedKeys.length}/${total}`}
          tone={matchedKeys.length === total ? 'good' : 'neutral'}
        />
        <Stat
          label="Errores"
          value={String(misses)}
          icon={<XCircle size={14} />}
          tone={misses <= 2 ? 'good' : misses <= 5 ? 'neutral' : 'warn'}
        />
        <Stat
          label="Tiempo"
          value={`${timer}s`}
          icon={<Clock size={14} />}
          tone="neutral"
        />
      </div>

      {won && (
        <p
          className="text-xs text-center font-medium"
          style={{ color: 'var(--leaf-bright, #16a34a)' }}
        >
          Tu girasol de crecimiento recibió luz nueva
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
        >
          Volver
        </button>
        <ShareScoreButton score={score} gameTitle="Memoria del Mercado" />
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

interface StatProps {
  label: string
  value: string
  icon?: React.ReactNode
  tone: 'good' | 'neutral' | 'warn'
}

function Stat({ label, value, icon, tone }: StatProps) {
  const toneColor =
    tone === 'good'
      ? 'var(--leaf-bright, #4ade80)'
      : tone === 'warn'
        ? '#dc2626'
        : 'var(--forest-deep, #1a3a2a)'
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{
        background: 'color-mix(in srgb, var(--clay-soft, #d4c5b0) 18%, transparent)',
        border: '1px solid color-mix(in srgb, var(--clay-soft, #d4c5b0) 40%, transparent)',
      }}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className="text-lg font-bold flex items-center justify-center gap-1"
        style={{ color: toneColor }}
      >
        {icon}
        {value}
      </p>
    </div>
  )
}
