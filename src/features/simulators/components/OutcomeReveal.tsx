import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface OutcomeRevealProps {
  wasCorrect: boolean
  coinsEarned: number
  predictedValue: number
  actualValue: number
  onContinue: () => void
}

export function OutcomeReveal({
  wasCorrect,
  coinsEarned,
  predictedValue,
  actualValue,
  onContinue,
}: OutcomeRevealProps) {
  const reduced = useReducedMotion()

  const diff = Math.abs(predictedValue - actualValue)
  const predLabel = predictedValue <= 20
    ? 'Difícil'
    : predictedValue <= 40
    ? 'Incierto'
    : predictedValue <= 60
    ? 'Me defiendo'
    : predictedValue <= 80
    ? 'Lo tengo claro'
    : 'Sin duda'

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Result badge */}
      <motion.div
        initial={reduced ? undefined : { y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.1, duration: 0.3 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <motion.span
          className="text-5xl"
          initial={reduced ? undefined : { scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: reduced ? 0 : 0.15, type: 'spring', stiffness: 250 }}
          role="img"
          aria-label={wasCorrect ? 'Correcto' : 'Casi'}
        >
          {wasCorrect ? '🎯' : '🌱'}
        </motion.span>

        <h3
          className="font-heading font-bold text-lg"
          style={{ color: 'var(--forest-deep)' }}
        >
          {wasCorrect ? '¡Predicción acertada!' : 'No fue exacto, pero aprendiste'}
        </h3>

        <p className="text-sm max-w-xs" style={{ color: 'var(--leaf-muted)' }}>
          {wasCorrect
            ? 'Tu nivel de confianza estaba alineado con tu desempeño real.'
            : 'La autoconsciencia sobre tus conocimientos también es parte de la educación financiera.'}
        </p>
      </motion.div>

      {/* Score comparison */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.2, duration: 0.25 }}
        className="rounded-xl p-4 space-y-3"
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1.5px solid var(--clay-soft, #d4c5b0)',
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Tu predicción
          </span>
          <span className="font-bold text-sm" style={{ color: 'var(--forest-deep)' }}>
            {predLabel} ({predictedValue}%)
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Tu resultado real
          </span>
          <span className="font-bold text-sm" style={{ color: 'var(--leaf-bright)' }}>
            {Math.round(actualValue)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Diferencia
          </span>
          <span
            className="font-bold text-sm"
            style={{ color: diff <= 20 ? 'var(--leaf-bright)' : 'var(--clay-warm, #c17b4a)' }}
          >
            {diff <= 20 ? `±${Math.round(diff)}% ✓` : `±${Math.round(diff)}%`}
          </span>
        </div>
      </motion.div>

      {/* Coins earned */}
      {wasCorrect && coinsEarned > 0 && (
        <motion.div
          initial={reduced ? undefined : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: reduced ? 0 : 0.3, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl"
          style={{
            background: 'color-mix(in srgb, var(--gold-light, #f5c842) 15%, transparent)',
            border: '1.5px solid var(--gold-light, #f5c842)',
          }}
        >
          <span className="text-xl" aria-hidden="true">🪙</span>
          <span className="font-bold text-base" style={{ color: 'var(--forest-deep)' }}>
            +{coinsEarned} monedas ganadas
          </span>
        </motion.div>
      )}

      {/* Continue */}
      <button
        onClick={onContinue}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-150 min-h-[44px]"
        style={{ backgroundColor: 'var(--leaf-bright)' }}
      >
        Ver resultados finales →
      </button>
    </motion.div>
  )
}
