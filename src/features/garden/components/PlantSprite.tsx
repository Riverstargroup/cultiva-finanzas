import { motion, useReducedMotion } from 'framer-motion'
import { Margarita } from './sprites/Margarita'
import { Lirio } from './sprites/Lirio'
import { Helecho } from './sprites/Helecho'
import { Girasol } from './sprites/Girasol'
import { idleVariants, growthVariants, wateredVariants, glowVariants, hoverVariants } from '../constants/motion'
import type { PlantSpecies, GrowthStage, HealthState, PlantAnimationKey } from '../types'

interface PlantSpriteProps {
  species: PlantSpecies
  stage: GrowthStage
  healthState?: HealthState
  size?: number
  animation?: PlantAnimationKey
  interactive?: boolean
  onAnimationComplete?: (key: PlantAnimationKey) => void
  className?: string
  ariaLabel?: string
}

const SPRITE_MAP = {
  margarita: Margarita,
  lirio: Lirio,
  helecho: Helecho,
  girasol: Girasol,
} as const

export function PlantSprite({
  species,
  stage,
  healthState = 'thriving',
  size = 120,
  animation = 'idle',
  interactive = false,
  onAnimationComplete,
  className,
  ariaLabel,
}: PlantSpriteProps) {
  const shouldReduceMotion = useReducedMotion()
  const SpriteComponent = SPRITE_MAP[species]

  const activeVariants =
    animation === 'idle' ? idleVariants :
    animation === 'growth' ? growthVariants :
    animation === 'watered' ? wateredVariants :
    animation === 'glow' ? glowVariants :
    hoverVariants

  const animateKey =
    animation === 'idle' ? 'idle' :
    animation === 'growth' ? 'to' :
    animation === 'watered' ? 'watered' :
    animation === 'glow' ? 'glow' :
    'rest'

  return (
    <motion.div
      className={className}
      style={{
        display: 'inline-flex',
        transformOrigin: '50% 100%',
      }}
      variants={shouldReduceMotion ? undefined : activeVariants}
      animate={shouldReduceMotion ? undefined : animateKey}
      initial={animation === 'growth' ? 'from' : undefined}
      whileHover={interactive && !shouldReduceMotion ? 'hover' : undefined}
      whileTap={interactive && !shouldReduceMotion ? 'tap' : undefined}
      onAnimationComplete={() => onAnimationComplete?.(animation)}
      aria-label={ariaLabel}
    >
      <SpriteComponent stage={stage} healthState={healthState} size={size} />
    </motion.div>
  )
}
