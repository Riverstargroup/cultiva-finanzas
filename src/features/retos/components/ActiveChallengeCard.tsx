import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { daysRemainingFromWeekStart } from '../hooks/useRetos'
import type { ActiveChallengeWithTemplate } from '../types'

interface ActiveChallengeCardProps {
  challenge: ActiveChallengeWithTemplate
  onComplete: (challengeId: string) => void
  isCompleting?: boolean
}

export function ActiveChallengeCard({ challenge, onComplete, isCompleting }: ActiveChallengeCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const { template } = challenge

  const daysLeft = daysRemainingFromWeekStart(challenge.week_start, template.duration_days)

  function handleCompleteClick() {
    setShowConfirm(true)
  }

  function handleConfirm() {
    setShowConfirm(false)
    onComplete(challenge.id)
  }

  return (
    <motion.div
      className="organic-card p-4 space-y-3 organic-border"
      style={{ borderColor: 'var(--leaf-bright)', borderLeftWidth: 3 }}
      initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Status row */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'var(--leaf-bright)22', color: 'var(--leaf-bright)' }}
        >
          🌿 En progreso
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: daysLeft <= 1 ? '#EF4444' : 'var(--leaf-muted)' }}
        >
          {daysLeft === 0 ? '¡Último día!' : `${daysLeft}d restantes`}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--forest-deep)' }}>
        {template.title}
      </h3>

      {/* Verification hint */}
      {template.verification_hint && (
        <div
          className="text-xs p-2.5 rounded-lg"
          style={{ backgroundColor: 'var(--garden-plot-surface)', color: 'var(--leaf-muted)' }}
        >
          <span className="font-semibold">Pista: </span>
          {template.verification_hint}
        </div>
      )}

      {/* Reward preview */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>🪙 +{template.reward_coins} monedas al completar</span>
      </div>

      {/* Complete button / confirmation */}
      <AnimatePresence mode="wait">
        {showConfirm ? (
          <motion.div
            key="confirm"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="space-y-2"
          >
            <p className="text-xs text-center text-muted-foreground">
              ¿Confirmas que completaste el reto?
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 min-h-[44px] text-sm font-semibold rounded-xl border"
                style={{ borderColor: 'var(--garden-plot-border)', color: 'var(--leaf-muted)' }}
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="vibrant-btn flex-1 min-h-[44px] text-sm font-semibold disabled:opacity-50"
                onClick={handleConfirm}
                disabled={isCompleting}
              >
                {isCompleting ? 'Guardando...' : '¡Sí, completé!'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="action"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="vibrant-btn w-full min-h-[44px] text-sm font-semibold"
            onClick={handleCompleteClick}
            disabled={isCompleting}
          >
            Marcar como completado ✓
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
