import { motion, useReducedMotion } from 'framer-motion'
import { PlantSprite } from './PlantSprite'
import { masteryProgress } from '../lib/stage'
import { DOMAIN_LABELS, PLANT_COLOR_SCHEMES, SPECIES_EMOJI } from '../types'
import type { GardenPlot as GardenPlotData, PlantAnimationKey } from '../types'

interface GardenPlotProps {
  plot: GardenPlotData
  isActive?: boolean
  animation?: PlantAnimationKey
  onClick?: (plotId: string) => void
  className?: string
}

export function GardenPlot({ plot, isActive, animation = 'idle', onClick, className }: GardenPlotProps) {
  const shouldReduceMotion = useReducedMotion()
  const { plant } = plot
  const colors = PLANT_COLOR_SCHEMES[plant.species]
  const progress = masteryProgress(plant.mastery, plant.stage)

  const healthColor =
    plant.health >= 75 ? 'var(--garden-health-full)' :
    plant.health >= 50 ? 'var(--garden-health-mid)' :
    plant.health >= 25 ? 'var(--garden-health-low)' :
    'var(--garden-health-dying)'

  return (
    <motion.button
      className={`garden-plot-surface relative flex flex-col items-center justify-end p-4 cursor-pointer w-full focus:outline-none ${className ?? ''}`}
      style={{ minHeight: 160 } as React.CSSProperties}
      data-stage={plant.stage}
      aria-label={`${DOMAIN_LABELS[plant.domain]}: ${SPECIES_EMOJI[plant.species]} ${plant.stage}, maestría ${Math.round(plant.mastery * 100)}%`}
      onClick={() => onClick?.(plot.id)}
      whileHover={!shouldReduceMotion ? { y: -4, scale: 1.02 } : undefined}
      whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Active ring */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ boxShadow: `0 0 0 3px ${colors.primary}` }}
        />
      )}

      {/* Plant sprite */}
      <div className="flex-1 flex items-end justify-center pb-2">
        <PlantSprite
          species={plant.species}
          stage={plant.stage}
          healthState={plant.healthState}
          size={100}
          animation={animation}
          interactive={false}
        />
      </div>

      {/* Domain label */}
      <p className="text-xs font-bold mt-1" style={{ color: colors.dark }}>
        {DOMAIN_LABELS[plant.domain]}
      </p>

      {/* Mastery progress bar */}
      <div className="w-full mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.particle }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colors.primary }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Health indicator dot */}
      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: healthColor }} />

      {/* Stage label */}
      <p className="text-[10px] mt-1 opacity-60" style={{ color: colors.dark }}>
        {Math.round(plant.mastery * 100)}%
      </p>
    </motion.button>
  )
}
