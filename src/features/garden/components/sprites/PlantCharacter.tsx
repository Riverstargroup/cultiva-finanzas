import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import {
  PLANT_COLOR_SCHEMES,
  type GrowthStage,
  type PlantAnimationKey,
  type PlantSpecies,
} from '../../types'

// ────────────────────────────────────────────────────────────────
// PlantCharacter — expressive, personality-driven plant sprite.
// Inline SVG (no emoji, no external fonts, no <script>) with
// Framer Motion sway, blink, and one-shot animation cues.
// ────────────────────────────────────────────────────────────────

export type PlantMood =
  | 'idle'
  | 'happy'
  | 'cheer'
  | 'worried'
  | 'sleeping'
  | 'curious'
  | 'celebrating'

export interface PlantCharacterProps {
  species: PlantSpecies
  stage: GrowthStage
  mood?: PlantMood
  customName?: string
  animationCue?: PlantAnimationKey | null
  size?: number
  className?: string
}

// ── Mouth shapes per mood ─────────────────────────────────────────
// Coordinates are in the 100x100 viewBox; mouth centered near y=58.
const MOUTH_PATHS: Readonly<Record<PlantMood, string>> = {
  idle: 'M 42 58 Q 50 62 58 58',
  happy: 'M 40 56 Q 50 68 60 56',
  cheer: 'M 38 55 Q 50 72 62 55 Q 50 66 38 55 Z',
  worried: 'M 42 62 Q 50 56 58 62',
  sleeping: 'M 44 60 L 56 60',
  curious: 'M 46 58 Q 50 64 54 58 Q 50 62 46 58 Z',
  celebrating: 'M 38 54 Q 50 74 62 54',
} as const

// ── Growth-stage size scaling ─────────────────────────────────────
const STAGE_SCALE: Readonly<Record<GrowthStage, number>> = {
  seed: 0.55,
  sprout: 0.68,
  growing: 0.82,
  blooming: 0.94,
  mastered: 1.0,
} as const

// ── Animation cue keyframes ───────────────────────────────────────
interface CueKeyframes {
  readonly x?: readonly number[]
  readonly y?: readonly number[]
  readonly rotate?: readonly number[]
  readonly scale?: readonly number[]
  readonly opacity?: readonly number[]
  readonly duration: number
}

const CUE_KEYFRAMES: Readonly<Record<PlantAnimationKey, CueKeyframes>> = {
  idle: { rotate: [0, 0], duration: 0.3 },
  watered: { y: [0, -6, 0, -3, 0], duration: 0.9 },
  growth: { scale: [1, 1.18, 0.98, 1.05, 1], duration: 0.8 },
  glow: { opacity: [1, 0.7, 1, 0.85, 1], duration: 1.0 },
  hover: { x: [0, -4, 4, -2, 2, 0], rotate: [0, -5, 5, -3, 3, 0], duration: 0.7 },
} as const

// ── Species accent adjustments ────────────────────────────────────
interface SpeciesSkin {
  readonly body: string
  readonly bodyShade: string
  readonly accent: string
  readonly leaf: string
  readonly leafDark: string
  readonly cheek: string
  readonly aura: string
}

function getSpeciesSkin(species: PlantSpecies): SpeciesSkin {
  const c = PLANT_COLOR_SCHEMES[species]
  return {
    body: c.primary,
    bodyShade: c.secondary,
    accent: c.dark,
    leaf: species === 'margarita' ? '#5B7A3A' : c.dark,
    leafDark: '#1B3B26',
    cheek: c.particle,
    aura: c.light,
  }
}

// ── Blink timing hook ─────────────────────────────────────────────
function useBlink(enabled: boolean): boolean {
  const [blinking, setBlinking] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let tClose: ReturnType<typeof setTimeout> | undefined
    let tOpen: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      const delay = 3000 + Math.random() * 3000
      tClose = setTimeout(() => {
        setBlinking(true)
        tOpen = setTimeout(() => {
          setBlinking(false)
          schedule()
        }, 150)
      }, delay)
    }
    schedule()

    return () => {
      if (tClose) clearTimeout(tClose)
      if (tOpen) clearTimeout(tOpen)
    }
  }, [enabled])

  return blinking
}

// ── One-shot cue animation hook ───────────────────────────────────
function useCueAnimation(cue: PlantAnimationKey | null | undefined) {
  const [frame, setFrame] = useState<CueKeyframes | null>(null)
  const tokenRef = useRef(0)

  useEffect(() => {
    if (!cue) {
      setFrame(null)
      return
    }
    const token = ++tokenRef.current
    const kf = CUE_KEYFRAMES[cue]
    setFrame(kf)
    const timer = setTimeout(() => {
      if (tokenRef.current === token) setFrame(null)
    }, kf.duration * 1000 + 50)
    return () => clearTimeout(timer)
  }, [cue])

  return frame
}

// ── Species-specific crown (petals / fronds / etc.) ───────────────
function SpeciesCrown({ species, stage, skin }: { species: PlantSpecies; stage: GrowthStage; skin: SpeciesSkin }) {
  const show = stage !== 'seed'
  if (!show) return null

  if (species === 'girasol') {
    return (
      <g>
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 360) / 10
          return (
            <ellipse
              key={i}
              cx="50"
              cy="18"
              rx="5"
              ry="11"
              fill={skin.body}
              stroke={skin.bodyShade}
              strokeWidth="1"
              transform={`rotate(${angle} 50 38)`}
            />
          )
        })}
      </g>
    )
  }
  if (species === 'margarita') {
    return (
      <g>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8
          return (
            <ellipse
              key={i}
              cx="50"
              cy="20"
              rx="4.5"
              ry="10"
              fill="#FFFFFF"
              stroke={skin.bodyShade}
              strokeWidth="0.8"
              transform={`rotate(${angle} 50 38)`}
            />
          )
        })}
      </g>
    )
  }
  if (species === 'lirio') {
    return (
      <g>
        <path
          d="M 50 18 Q 38 24 36 38 Q 44 32 50 34 Q 56 32 64 38 Q 62 24 50 18 Z"
          fill={skin.body}
          stroke={skin.accent}
          strokeWidth="1"
        />
        <path d="M 50 20 Q 50 32 50 36" stroke={skin.accent} strokeWidth="1.2" fill="none" />
      </g>
    )
  }
  // helecho
  return (
    <g>
      {[-28, -14, 0, 14, 28].map((dx, i) => (
        <ellipse
          key={i}
          cx={50 + dx}
          cy={26 - Math.abs(dx) * 0.25}
          rx="6"
          ry="10"
          fill={skin.body}
          stroke={skin.leafDark}
          strokeWidth="0.8"
          transform={`rotate(${dx * 1.2} ${50 + dx} 28)`}
        />
      ))}
    </g>
  )
}

// ── Eyes (with blink) ─────────────────────────────────────────────
function Eyes({ blinking, mood, skin }: { blinking: boolean; mood: PlantMood; skin: SpeciesSkin }) {
  const closed = blinking || mood === 'sleeping'
  const ry = closed ? 0.4 : 2.6
  return (
    <g>
      <ellipse cx="43" cy="48" rx="2.6" ry={ry} fill={skin.leafDark} />
      <ellipse cx="57" cy="48" rx="2.6" ry={ry} fill={skin.leafDark} />
      {!closed && (
        <>
          <circle cx="43.9" cy="47.2" r="0.8" fill="#FFFFFF" />
          <circle cx="57.9" cy="47.2" r="0.8" fill="#FFFFFF" />
        </>
      )}
    </g>
  )
}

// ── Stem and leaves (below face) ──────────────────────────────────
function Stem({ stage, skin }: { stage: GrowthStage; skin: SpeciesSkin }) {
  if (stage === 'seed') return null
  return (
    <g>
      <rect x="48" y="70" width="4" height="20" rx="2" fill={skin.leaf} />
      {stage !== 'sprout' && (
        <>
          <path d="M 50 78 Q 40 76 34 82 Q 40 84 50 82 Z" fill={skin.leaf} stroke={skin.leafDark} strokeWidth="0.6" />
          <path d="M 50 82 Q 60 80 66 86 Q 60 88 50 86 Z" fill={skin.leaf} stroke={skin.leafDark} strokeWidth="0.6" />
        </>
      )}
    </g>
  )
}

// ── Seed shell (stage=seed only) ──────────────────────────────────
function Seed({ skin }: { skin: SpeciesSkin }) {
  return (
    <g>
      <ellipse cx="50" cy="54" rx="16" ry="20" fill="#78350F" />
      <ellipse cx="46" cy="48" rx="3" ry="5" fill="#A16207" opacity="0.6" />
      <ellipse cx="50" cy="44" rx="4" ry="2" fill={skin.aura} opacity="0.3" />
    </g>
  )
}

// ── Main face group (body circle + features) ──────────────────────
function PlantFace({
  species,
  stage,
  mood,
  skin,
  blinking,
}: {
  species: PlantSpecies
  stage: GrowthStage
  mood: PlantMood
  skin: SpeciesSkin
  blinking: boolean
}) {
  if (stage === 'seed') {
    return (
      <g>
        <Seed skin={skin} />
        <Eyes blinking={blinking} mood={mood} skin={skin} />
        <path d={MOUTH_PATHS[mood]} stroke={skin.leafDark} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )
  }

  const diskFill = species === 'girasol' ? skin.bodyShade : species === 'margarita' ? skin.body : skin.accent

  return (
    <g>
      <SpeciesCrown species={species} stage={stage} skin={skin} />
      <circle cx="50" cy="52" r="17" fill={diskFill} stroke={skin.accent} strokeWidth="1.2" />
      <circle cx="40" cy="54" r="3" fill={skin.cheek} opacity="0.55" />
      <circle cx="60" cy="54" r="3" fill={skin.cheek} opacity="0.55" />
      <Eyes blinking={blinking} mood={mood} skin={skin} />
      <path d={MOUTH_PATHS[mood]} stroke={skin.leafDark} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

// ── Component ─────────────────────────────────────────────────────
export function PlantCharacter({
  species,
  stage,
  mood = 'idle',
  customName,
  animationCue = null,
  size = 120,
  className,
}: PlantCharacterProps) {
  const prefersReducedMotion = useReducedMotion()
  const skin = useMemo(() => getSpeciesSkin(species), [species])
  const stageScale = STAGE_SCALE[stage] ?? 1
  const blinking = useBlink(!prefersReducedMotion && mood !== 'sleeping')
  const cueFrame = useCueAnimation(animationCue)

  const label = customName
    ? `${customName}, planta ${species} en etapa ${stage}`
    : `planta ${species} en etapa ${stage}`

  const swayAnimate = prefersReducedMotion
    ? { rotate: 0 }
    : { rotate: [-3, 3, -3] }

  const cueAnimate = cueFrame && !prefersReducedMotion
    ? {
        x: cueFrame.x ? [...cueFrame.x] : 0,
        y: cueFrame.y ? [...cueFrame.y] : 0,
        rotate: cueFrame.rotate ? [...cueFrame.rotate] : 0,
        scale: cueFrame.scale ? [...cueFrame.scale] : stageScale,
        opacity: cueFrame.opacity ? [...cueFrame.opacity] : 1,
      }
    : undefined

  return (
    <div
      className={className}
      style={{ display: 'inline-block', position: 'relative', lineHeight: 0 }}
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        role="img"
        aria-label={label}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{label}</title>
        <motion.g
          animate={swayAnimate}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50px 90px' }}
        >
          <motion.g
            animate={cueAnimate}
            transition={{ duration: cueFrame?.duration ?? 0.5, ease: 'easeOut' }}
            style={{ transformOrigin: '50px 55px' }}
          >
            <g transform={`translate(50 55) scale(${stageScale}) translate(-50 -55)`}>
              <Stem stage={stage} skin={skin} />
              <PlantFace species={species} stage={stage} mood={mood} skin={skin} blinking={blinking} />
            </g>
          </motion.g>
        </motion.g>
      </svg>
      {customName && (
        <div
          style={{
            position: 'absolute',
            bottom: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: Math.max(11, size * 0.1),
            fontWeight: 600,
            color: skin.leafDark,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {customName}
        </div>
      )}
    </div>
  )
}

export default PlantCharacter
