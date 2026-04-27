import { motion } from 'framer-motion'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SPECIAL_POWER_COLORS } from '../types'
import type { ShopItem } from '../types'

interface ShopItemCardProps {
  item: ShopItem
  coins: number
  onBuy: (item: ShopItem) => void
  isBuying: boolean
}

export function ShopItemCard({ item, coins, onBuy, isBuying }: ShopItemCardProps) {
  const reduced = useReducedMotion()
  const canAfford = coins >= item.price
  const colors = item.specialPower ? SPECIAL_POWER_COLORS[item.specialPower] : null

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      className="flex flex-col space-y-3 rounded-2xl p-4"
      style={{
        background: colors
          ? `linear-gradient(135deg, ${colors.aura}, rgba(255,255,255,0.85))`
          : 'rgba(255,255,255,0.85)',
        border: `1.5px solid ${colors ? colors.accent : 'var(--clay-soft)'}`,
        boxShadow: colors ? `0 4px 16px ${colors.aura}` : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-3xl" role="img" aria-label={item.name}>{item.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight" style={{ color: 'var(--forest-deep)' }}>{item.name}</p>
          {item.specialPower && (
            <p className="mt-0.5 text-xs font-semibold" style={{ color: colors?.accent }}>
              Poder especial
            </p>
          )}
        </div>
      </div>

      <p className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--text-warm)' }}>
        {item.description}
      </p>

      {item.powerDescription && (
        <p className="text-xs italic" style={{ color: colors?.accent ?? 'var(--leaf-muted)' }}>
          {item.powerDescription}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold"
          style={{
            background: canAfford ? 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)' : 'var(--clay-soft)',
            color: canAfford ? 'var(--forest-deep)' : 'var(--leaf-muted)',
          }}
        >
          <img src={coinSprout} alt="" className="h-4 w-4" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
          {item.price}
        </span>
        <button
          onClick={() => onBuy(item)}
          disabled={!canAfford || isBuying}
          className="rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: canAfford ? 'var(--forest-deep)' : 'var(--clay-soft)',
            color: canAfford ? '#fff' : 'var(--leaf-muted)',
          }}
          aria-label={canAfford ? `Comprar ${item.name} por ${item.price} monedas` : `No tienes suficientes monedas para ${item.name}`}
        >
          {isBuying ? '...' : 'Comprar'}
        </button>
      </div>
    </motion.div>
  )
}
