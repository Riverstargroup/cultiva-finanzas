import { Flame, Leaf, Map } from 'lucide-react'
import { LevelBadge } from '@/components/LevelBadge'
import type { UserLevel } from '@/hooks/useUserLevel'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'

interface BackyardSkyHeaderProps {
  coins: number
  streakDays: number
  level?: UserLevel
}

export function BackyardSkyHeader({ coins, streakDays, level }: BackyardSkyHeaderProps) {
  return (
    <div className="sendero-hud flex items-center justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
          <Map className="h-3.5 w-3.5" />
          Fase 1
        </div>
        <h1 className="font-heading text-2xl font-black leading-none md:text-3xl" style={{ color: 'var(--forest-deep)' }}>
          Sendero Semilla
        </h1>
        <div className="flex items-center gap-2">
          {level && <LevelBadge level={level} size="sm" />}
          <span className="hidden text-xs font-bold md:inline" style={{ color: 'var(--leaf-muted)' }}>
            Finanzas basicas
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {streakDays > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold"
            style={{ background: 'var(--clay-soft)', color: 'var(--forest-deep)' }}
          >
            <Flame className="h-4 w-4" />
            {streakDays}d
          </span>
        )}
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold"
          style={{
            background: 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)',
            color: 'var(--forest-deep)',
          }}
        >
          <img src={coinSprout} alt="" className="h-5 w-5" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
          {coins}
        </span>
        <Leaf className="hidden h-6 w-6 flex-shrink-0 sm:block" style={{ color: 'var(--leaf-bright)' }} />
      </div>
    </div>
  )
}
