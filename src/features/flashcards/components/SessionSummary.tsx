import { motion } from 'framer-motion'
import type { SessionStats } from '../hooks/useFlashcardSession'

interface SessionSummaryProps {
  stats: SessionStats
  onBack: () => void
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
}

export function SessionSummary({ stats, onBack }: SessionSummaryProps) {
  const elapsed = Date.now() - stats.startTime
  const avgRating = stats.reviewed > 0
    ? (stats.ratingSum / stats.reviewed).toFixed(1)
    : '—'

  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-8 px-4 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-5xl">🌱</span>

      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: 'var(--forest-deep)', fontFamily: 'Fraunces, serif' }}
        >
          ¡Sesión completada!
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tu jardín ha crecido un poco más hoy
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        <StatCard label="Tarjetas" value={String(stats.reviewed)} />
        <StatCard label="Tiempo" value={formatDuration(elapsed)} />
        <StatCard label="Promedio" value={avgRating} />
      </div>

      <button
        onClick={onBack}
        className="mt-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-transform active:scale-95 hover:brightness-110"
        style={{ backgroundColor: 'var(--leaf-bright)' }}
      >
        Volver a flashcards
      </button>
    </motion.div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl p-3"
      style={{ backgroundColor: 'var(--garden-plot-surface)', border: '1px solid var(--garden-plot-border)' }}
    >
      <span
        className="text-lg font-bold"
        style={{ color: 'var(--forest-deep)' }}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
