import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatCountdown } from '../lib/economy'
import { SPECIAL_POWER_EMOJIS, SPECIAL_POWER_LABELS, SPECIAL_POWER_COLORS } from '../types'
import type { GardenEconomy, SpecialPower } from '../types'

interface GardenEconomyBannerProps {
  economy: GardenEconomy | null
  rentOverdue: boolean
  iceActive: boolean
  fireActive: boolean
  goldActive: boolean
}

const POWERS: SpecialPower[] = ['fire', 'gold', 'ice']

function powerUntil(economy: GardenEconomy | null, power: SpecialPower): string | null {
  if (!economy) return null
  if (power === 'fire') return economy.fireActiveUntil
  if (power === 'gold') return economy.goldActiveUntil
  if (power === 'ice') return economy.iceActiveUntil
  return null
}

function isPowerOn(economy: GardenEconomy | null, power: SpecialPower): boolean {
  const until = powerUntil(economy, power)
  if (!until) return false
  return new Date(until) > new Date()
}

export function GardenEconomyBanner({ economy, rentOverdue, iceActive, fireActive, goldActive }: GardenEconomyBannerProps) {
  const reduced = useReducedMotion()
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!economy?.rentDueAt) return
    const update = () => {
      const ms = Math.max(0, new Date(economy.rentDueAt).getTime() - Date.now())
      setCountdown(formatCountdown(ms))
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [economy?.rentDueAt])

  if (!economy) return null

  const showWarning = rentOverdue && !iceActive

  return (
    <div className="space-y-2">
      {/* Rent status */}
      <motion.div
        animate={!reduced && showWarning ? { scale: [1, 1.015, 1] } : { scale: 1 }}
        transition={{ duration: 1.2, repeat: showWarning ? Infinity : 0, ease: 'easeInOut' }}
        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm"
        style={{
          background: showWarning
            ? 'color-mix(in srgb, var(--terracotta-vivid) 12%, transparent)'
            : 'color-mix(in srgb, var(--leaf-bright) 8%, transparent)',
          border: `1.5px solid ${showWarning ? 'var(--terracotta-vivid)' : 'var(--clay-soft)'}`,
        }}
      >
        <span style={{ color: showWarning ? 'var(--terracotta-vivid)' : 'var(--leaf-muted)' }}>
          {showWarning ? '⚠️ Renta vencida' : `🏡 Renta en ${countdown}`}
        </span>
        <span className="text-xs font-bold" style={{ color: 'var(--forest-deep)' }}>
          -{economy.rentAmount} 🪙
        </span>
      </motion.div>

      {/* Active powers */}
      <div className="flex gap-2">
        {POWERS.map((power) => {
          const active = isPowerOn(economy, power)
          const colors = SPECIAL_POWER_COLORS[power]
          return (
            <div
              key={power}
              className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: active ? colors.aura : 'rgba(0,0,0,0.04)',
                border: `1.5px solid ${active ? colors.accent : 'var(--clay-soft)'}`,
                color: active ? colors.accent : 'var(--leaf-muted)',
                opacity: active ? 1 : 0.5,
              }}
              title={SPECIAL_POWER_LABELS[power]}
            >
              <span aria-hidden="true">{SPECIAL_POWER_EMOJIS[power]}</span>
              <span className="hidden sm:inline truncate">{SPECIAL_POWER_LABELS[power]}</span>
              {active && <span className="ml-auto">✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
