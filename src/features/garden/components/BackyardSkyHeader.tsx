import { Flame, Leaf } from 'lucide-react'
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
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold md:text-3xl" style={{ color: 'var(--forest-deep)' }}>
          Mi Jardín
        </h1>
        {level && <LevelBadge level={level} size="sm" />}
      </div>
      <div className="flex items-center gap-3">
        {streakDays > 0 && (
          <span
            className="inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full"
            style={{ background: 'var(--clay-soft)', color: 'var(--forest-deep)' }}
          >
            <Flame className="h-4 w-4" />
            {streakDays}d
          </span>
        )}
        <span
          className="inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full"
          style={{
            background: 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)',
            color: 'var(--forest-deep)',
          }}
        >
          <img src={coinSprout} alt="" className="h-5 w-5" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
          {coins}
        </span>
        <Leaf className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--leaf-bright)' }} />
      </div>
    </div>
  )
}
