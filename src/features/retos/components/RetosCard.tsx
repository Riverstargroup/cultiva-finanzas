import { useState } from 'react'
import { motion } from 'framer-motion'
import { HarvestModal } from './HarvestModal'
import { useHarvest } from '../hooks/useHarvest'
import type { WeeklyChallenge } from '../types'

interface RetosCardProps {
  challenge: WeeklyChallenge
}

export function RetosCard({ challenge }: RetosCardProps) {
  const harvest = useHarvest()
  const [showModal, setShowModal] = useState(false)
  const [harvestedCoins, setHarvestedCoins] = useState(0)

  const template = challenge.template
  if (!template) return null

  const progressPct = Math.min(
    100,
    template.targetMasteryDelta > 0
      ? Math.round((challenge.progress / template.targetMasteryDelta) * 100)
      : challenge.completed
      ? 100
      : 0
  )

  const canHarvest = challenge.completed && !challenge.harvested

  const handleHarvest = async () => {
    const res = await harvest.mutateAsync({
      challengeId: challenge.id,
      rewardCoins: template.rewardCoins,
    })
    setHarvestedCoins(res.coinsEarned)
    setShowModal(true)
  }

  return (
    <>
      <div className="organic-card p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{template.emoji}</span>
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-sm leading-tight"
              style={{ color: 'var(--forest-deep)' }}
            >
              {template.title}
            </p>
            {template.description && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--leaf-muted)' }}>
                {template.description}
              </p>
            )}
          </div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: challenge.harvested
                ? 'color-mix(in srgb, var(--leaf-muted) 15%, transparent)'
                : canHarvest
                ? 'color-mix(in srgb, var(--leaf-bright) 20%, transparent)'
                : 'color-mix(in srgb, var(--clay-soft) 40%, transparent)',
              color: challenge.harvested
                ? 'var(--leaf-muted)'
                : canHarvest
                ? 'var(--leaf-bright)'
                : 'var(--forest-deep)',
            }}
          >
            {template.rewardCoins} 🪙
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs" style={{ color: 'var(--leaf-muted)' }}>
            <span>Progreso</span>
            <span>{progressPct}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'var(--clay-soft)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--leaf-bright)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {canHarvest && (
          <button
            onClick={handleHarvest}
            disabled={harvest.isPending}
            className="vibrant-btn w-full justify-center text-sm disabled:opacity-50"
          >
            Cosechar 🌾
          </button>
        )}

        {challenge.harvested && (
          <p className="text-center text-xs font-semibold" style={{ color: 'var(--leaf-muted)' }}>
            ✓ Cosechado
          </p>
        )}
      </div>

      <HarvestModal
        open={showModal}
        coins={harvestedCoins}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
