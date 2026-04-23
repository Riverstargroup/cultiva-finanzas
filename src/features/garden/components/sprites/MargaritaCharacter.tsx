import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import type { GrowthStage, HealthState } from '../../types'

type PlantReaction = 'idle' | 'happy' | 'cheer' | 'worried' | 'sleeping'

interface PlantCharacterProps {
  stage: GrowthStage
  healthState?: HealthState
  reaction?: PlantReaction
  customName?: string
  size?: number
  className?: string
}

const TOKENS = {
  forestDeep: '#1B3B26',
  claySoft: '#d4c5b0',
  leafMuted: '#5B7A3A',
  seedBrown: '#78350F',
  gold: '#FCD34D',
} as const

const PALETTE = {
  petal: '#FFFFFF',
  petalShade: '#FFFFFF',
  center: '#FCD34D',
  iris: '#78350F',
  stem: '#78A94B',
  leaf: '#78A94B',
  aura: '#FCD34D',
} as const

function getHealthFilter(healthState?: HealthState) {
  if (healthState === 'thriving') return 'saturate(1.08) brightness(1.04)'
  if (healthState === 'wilting') return 'saturate(0.56) brightness(0.87)'
  if (healthState === 'dying') return 'saturate(0.28) brightness(0.72)'
  return undefined
}

function getBlinkDelay() {
  return 3000 + Math.random() * 3000
}

function useBlink(disabled: boolean) {
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    if (disabled) {
      setIsBlinking(false)
      return
    }

    let blinkTimer: ReturnType<typeof setTimeout> | undefined
    let resetTimer: ReturnType<typeof setTimeout> | undefined

    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setIsBlinking(true)
        resetTimer = setTimeout(() => {
          setIsBlinking(false)
          scheduleBlink()
        }, 180)
      }, getBlinkDelay())
    }

    scheduleBlink()

    return () => {
      if (blinkTimer) clearTimeout(blinkTimer)
      if (resetTimer) clearTimeout(resetTimer)
    }
  }, [disabled])

  return isBlinking
}

function Eye({
  x,
  y,
  reaction,
  isBlinking,
  reducedMotion,
}: {
  x: number
  y: number
  reaction: PlantReaction
  isBlinking: boolean
  reducedMotion: boolean
}) {
  const sleeping = reaction === 'sleeping'
  const worried = reaction === 'worried'
  const happy = reaction === 'happy'
  const cheer = reaction === 'cheer'

  if (sleeping) {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M-5 0 Q0 -2.4 5 0" stroke={TOKENS.forestDeep} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
    )
  }

  return (
    <g transform={`translate(${x} ${y}) rotate(${worried ? -10 : 0}) scale(1 ${happy ? 0.82 : 1})`}>
      {worried && <path d="M-5.7 -7 L0.2 -8.8" stroke={TOKENS.forestDeep} strokeWidth={1.1} strokeLinecap="round" />}
      <ellipse cx="0" cy="0" rx="5.9" ry={cheer ? 5.9 : 5.3} fill="#FFFFFF" />
      <ellipse cx="0.1" cy="0.2" rx="3" ry="3.3" fill={PALETTE.iris} />
      <circle cx="0.3" cy="0.4" r="1.6" fill="#111827" />
      <circle cx="1.3" cy="-0.9" r="0.8" fill="#FFFFFF" />
      <motion.path
        d="M-5.9 -0.3 Q0 -6.2 5.9 -0.3"
        stroke={PALETTE.center}
        strokeWidth="6.4"
        fill="none"
        strokeLinecap="round"
        animate={reducedMotion ? undefined : { y: isBlinking ? 8 : 0 }}
        transition={{ duration: 0.14, ease: 'easeInOut' }}
      />
    </g>
  )
}

function Mouth({ cx, cy, reaction }: { cx: number; cy: number; reaction: PlantReaction }) {
  if (reaction === 'cheer') return <ellipse cx={cx} cy={cy + 1} rx={3.5} ry={4.2} fill="#92400E" />
  if (reaction === 'worried') return <path d={`M${cx - 4} ${cy + 2.8} Q${cx} ${cy - 0.8} ${cx + 4} ${cy + 2.8}`} stroke="#92400E" strokeWidth={1.5} fill="none" strokeLinecap="round" />
  if (reaction === 'happy') return <path d={`M${cx - 4.2} ${cy} Q${cx} ${cy + 3.8} ${cx + 4.2} ${cy}`} stroke="#92400E" strokeWidth={1.5} fill="none" strokeLinecap="round" />
  if (reaction === 'sleeping') return <path d={`M${cx - 3.2} ${cy + 0.8} Q${cx} ${cy + 2.2} ${cx + 3.2} ${cy + 0.8}`} stroke="#92400E" strokeWidth={1.2} fill="none" strokeLinecap="round" />
  return <path d={`M${cx - 3.7} ${cy + 1} Q${cx} ${cy + 2.2} ${cx + 3.7} ${cy + 1}`} stroke="#92400E" strokeWidth={1.4} fill="none" strokeLinecap="round" />
}

function FloatingLabel({ customName, stage }: { customName?: string; stage: GrowthStage }) {
  if (!customName) return null

  const width = Math.max(44, customName.length * 6.8 + 16)

  return (
    <div
      aria-label={`Planta ${customName}, etapa ${stage}`}
      style={{
        minWidth: width,
        height: 18,
        marginTop: 2,
        padding: '0 8px',
        borderRadius: 999,
        border: `1px solid ${TOKENS.claySoft}`,
        background: '#FCFBF6',
        color: TOKENS.forestDeep,
        fontSize: 7.5,
        fontWeight: 700,
        lineHeight: '18px',
        textAlign: 'center',
      }}
    >
        {customName}
    </div>
  )
}

export function MargaritaCharacter({
  stage,
  healthState = 'healthy',
  reaction = 'idle',
  customName,
  size = 120,
  className,
}: PlantCharacterProps) {
  const reducedMotion = useReducedMotion()
  const isBlinking = useBlink(reducedMotion || stage === 'seed' || reaction === 'sleeping')
  const h = size
  const w = size
  const cx = w / 2
  const groundY = h * 0.875
  const healthFilter = getHealthFilter(healthState)
  const faceY = stage === 'sprout' ? groundY - 22 : stage === 'growing' ? groundY - 56 : groundY - 83
  const leafLift = reaction === 'cheer' ? -7 : 0

  const rootAnimation = useMemo(() => {
    if (reducedMotion) return undefined
    if (reaction === 'sleeping') return { rotate: [0, 0.45, 0, -0.45, 0], y: [0, 0.9, 0] }
    if (reaction === 'cheer') return { rotate: [0, 2.6, 0, -2.6, 0], y: [0, -3, 0] }
    return { rotate: [0, 1.5, 0, -1.5, 0] }
  }, [reaction, reducedMotion])

  return (
    <div className={className} style={{ width: w, display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={healthFilter ? { filter: healthFilter } : undefined} aria-hidden="true">
      <motion.g
        animate={rootAnimation}
        transition={reducedMotion ? undefined : { duration: reaction === 'sleeping' ? 4.4 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${groundY}px` }}
      >
        {stage === 'seed' && (
          <g>
            <ellipse cx={cx} cy={groundY + 1} rx={7.2} ry={8.7} fill={TOKENS.seedBrown} />
            <ellipse cx={cx} cy={groundY - 0.5} rx={2.4} ry={4.4} fill={TOKENS.seedBrown} opacity={0.65} />
            <path d={`M${cx - 2.4} ${groundY - 5} Q${cx} ${groundY - 1} ${cx - 0.4} ${groundY + 5}`} stroke={TOKENS.gold} strokeWidth={0.9} fill="none" opacity={0.7} />
          </g>
        )}

        {stage === 'sprout' && (
          <g>
            <path d={`M${cx} ${groundY} Q${cx - 2} ${groundY - 11} ${cx} ${groundY - 22}`} stroke={PALETTE.stem} strokeWidth={3} fill="none" strokeLinecap="round" />
            <ellipse cx={cx - 8} cy={groundY - 14} rx={7.5} ry={5} fill={PALETTE.leaf} transform={`rotate(-28 ${cx - 8} ${groundY - 14})`} />
            <ellipse cx={cx + 8} cy={groundY - 16} rx={7.5} ry={5} fill={PALETTE.leaf} transform={`rotate(28 ${cx + 8} ${groundY - 16})`} />
            <circle cx={cx} cy={faceY} r={11} fill={PALETTE.center} />
            <Eye x={cx - 4.3} y={faceY - 0.4} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 4.3} y={faceY - 0.4} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
          </g>
        )}

        {stage === 'growing' && (
          <g>
            <path d={`M${cx} ${groundY} Q${cx - 3} ${groundY - 34} ${cx} ${groundY - 58}`} stroke={PALETTE.stem} strokeWidth={3.6} fill="none" strokeLinecap="round" />
            <ellipse cx={cx - 15} cy={groundY - 30 + leafLift} rx={11} ry={6} fill={PALETTE.leaf} transform={`rotate(-36 ${cx - 15} ${groundY - 30 + leafLift})`} />
            <ellipse cx={cx + 15} cy={groundY - 42 + leafLift} rx={11} ry={6} fill={PALETTE.leaf} transform={`rotate(38 ${cx + 15} ${groundY - 42 + leafLift})`} />
            <ellipse cx={cx - 6} cy={groundY - 52 + leafLift / 2} rx={9} ry={5} fill={PALETTE.leaf} transform={`rotate(-10 ${cx - 6} ${groundY - 52 + leafLift / 2})`} />
            {Array.from({ length: 6 }).map((_, index) => {
              const angle = (index / 6) * Math.PI * 2
              const px = cx + Math.cos(angle) * 9
              const py = faceY + Math.sin(angle) * 9
              return (
                <ellipse
                  key={index}
                  cx={px}
                  cy={py}
                  rx={3.8}
                  ry={9}
                  fill={index % 2 === 0 ? PALETTE.petal : PALETTE.petalShade}
                  stroke={TOKENS.claySoft}
                  strokeWidth={0.6}
                  transform={`rotate(${(angle * 180) / Math.PI + 90} ${px} ${py})`}
                />
              )
            })}
            <circle cx={cx} cy={faceY} r={12} fill={PALETTE.center} />
            <Eye x={cx - 5.6} y={faceY - 1} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 5.6} y={faceY - 1} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <path d={`M${cx - 4} ${faceY + 8.5} Q${cx} ${faceY + 10.8} ${cx + 4} ${faceY + 8.5}`} stroke={TOKENS.seedBrown} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          </g>
        )}

        {(stage === 'blooming' || stage === 'mastered') && (
          <g>
            {stage === 'mastered' && (
              <>
                <circle cx={cx} cy={faceY} r={31} fill={PALETTE.aura} opacity={0.22} />
                <circle cx={cx} cy={faceY} r={24} fill={PALETTE.aura} opacity={0.18} />
                {Array.from({ length: 9 }).map((_, index) => {
                  const angle = (index / 9) * Math.PI * 2
                  return (
                    <circle
                      key={index}
                      cx={cx + Math.cos(angle) * 28}
                      cy={faceY + Math.sin(angle) * 28}
                      r={1.7}
                      fill={TOKENS.gold}
                      opacity={0.84}
                    />
                  )
                })}
              </>
            )}
            <path d={`M${cx} ${groundY} Q${cx - 3} ${groundY - 44} ${cx} ${groundY - 86}`} stroke={PALETTE.stem} strokeWidth={4} fill="none" strokeLinecap="round" />
            <ellipse cx={cx - 16} cy={groundY - 44 + leafLift} rx={13} ry={6.8} fill={PALETTE.leaf} transform={`rotate(-36 ${cx - 16} ${groundY - 44 + leafLift})`} />
            <ellipse cx={cx + 16} cy={groundY - 56 + leafLift} rx={13} ry={6.8} fill={PALETTE.leaf} transform={`rotate(36 ${cx + 16} ${groundY - 56 + leafLift})`} />
            {Array.from({ length: stage === 'mastered' ? 12 : 10 }).map((_, index) => {
              const total = stage === 'mastered' ? 12 : 10
              const angle = (index / total) * Math.PI * 2
              const radius = stage === 'mastered' ? 14 : 13
              const px = cx + Math.cos(angle) * radius
              const py = faceY + Math.sin(angle) * radius
              return (
                <ellipse
                  key={index}
                  cx={px}
                  cy={py}
                  rx={5.4}
                  ry={13}
                  fill={index % 2 === 0 ? PALETTE.petal : PALETTE.petalShade}
                  stroke={TOKENS.claySoft}
                  strokeWidth={0.7}
                  transform={`rotate(${(angle * 180) / Math.PI + 90} ${px} ${py})`}
                />
              )
            })}
            <circle cx={cx} cy={faceY} r={16} fill={PALETTE.center} />
            <circle cx={cx} cy={faceY} r={10} fill={TOKENS.gold} opacity={0.16} />
            <Eye x={cx - 6.8} y={faceY - 1.8} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 6.8} y={faceY - 1.8} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Mouth cx={cx} cy={faceY + 7} reaction={reaction === 'idle' && stage === 'mastered' ? 'happy' : reaction} />
            <circle cx={cx - 12} cy={faceY + 3} r={1.9} fill={PALETTE.petal} opacity={0.85} />
            <circle cx={cx + 12} cy={faceY + 3} r={1.9} fill={PALETTE.petal} opacity={0.85} />
            {reaction === 'sleeping' && (
              <g fill={TOKENS.forestDeep} opacity={0.7}>
                <path d={`M${cx + 18} ${faceY - 16} h6 l-5 6 h6`} />
                <path d={`M${cx + 24} ${faceY - 23} h4 l-3 4 h4`} />
              </g>
            )}
          </g>
        )}
      </motion.g>
      </svg>
      <FloatingLabel customName={customName} stage={stage} />
    </div>
  )
}
