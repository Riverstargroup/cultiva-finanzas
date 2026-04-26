import { Flame, Leaf } from 'lucide-react'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'

interface BackyardSkyHeaderProps {
  coins: number
  streakDays: number
}

export function BackyardSkyHeader({ coins, streakDays }: BackyardSkyHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold md:text-3xl" style={{ color: 'var(--forest-deep)' }}>
          Mi Jardin
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--leaf-muted)' }}>
          Tu progreso financiero, hecho visible
        </p>
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
