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
  leafBright: '#4CAF50',
  forestDeep: '#1B3B26',
  claySoft: '#d4c5b0',
  leafMuted: '#5B7A3A',
  leafDark: '#1B3B26',
  seedBrown: '#78350F',
  gold: '#FCD34D',
} as const

const PALETTE = {
  petal: '#FCD34D',
  petalShade: '#FCD34D',
  disk: '#D97706',
  iris: '#78350F',
  stem: '#2E5D34',
  leaf: '#4CAF50',
  blush: '#FCD34D',
  aura: '#FCD34D',
} as const

function getHealthFilter(healthState?: HealthState) {
  if (healthState === 'thriving') return 'saturate(1.08) brightness(1.04)'
  if (healthState === 'wilting') return 'saturate(0.55) brightness(0.88)'
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
  const squint = happy ? 0.82 : 1
  const eyeRy = cheer ? 5.8 : worried ? 5 : 5.4
  const irisY = cheer ? 0.4 : worried ? 0.2 : 0
  const lidTravel = isBlinking ? 9 : 0

  if (sleeping) {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M-5 1 Q0 -2 5 1" stroke={TOKENS.forestDeep} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </g>
    )
  }

  return (
    <g transform={`translate(${x} ${y}) rotate(${worried ? -10 : 0}) scale(1 ${squint})`}>
      {worried && <path d="M-6 -7 L1 -9" stroke={TOKENS.forestDeep} strokeWidth={1.2} strokeLinecap="round" />}
      <ellipse cx="0" cy="0" rx="6.1" ry={eyeRy} fill="#FFFFFF" />
      <ellipse cx="0" cy={irisY} rx="3.2" ry="3.6" fill={PALETTE.iris} />
      <circle cx="0.4" cy={irisY + 0.2} r="1.7" fill="#111827" />
      <circle cx="1.4" cy={irisY - 1.2} r="0.8" fill="#FFFFFF" />
      <motion.path
        d="M-6.2 -0.5 Q0 -6.6 6.2 -0.5"
        stroke={PALETTE.disk}
        strokeWidth="6.8"
        fill="none"
        strokeLinecap="round"
        animate={reducedMotion ? undefined : { y: lidTravel }}
        transition={{ duration: 0.14, ease: 'easeInOut' }}
      />
    </g>
  )
}

function Mouth({
  cx,
  cy,
  reaction,
}: {
  cx: number
  cy: number
  reaction: PlantReaction
}) {
  if (reaction === 'cheer') {
    return <ellipse cx={cx} cy={cy + 1} rx={3.4} ry={4.3} fill="#7C2D12" />
  }

  if (reaction === 'worried') {
    return <path d={`M${cx - 4} ${cy + 3} Q${cx} ${cy - 1} ${cx + 4} ${cy + 3}`} stroke="#7C2D12" strokeWidth={1.6} fill="none" strokeLinecap="round" />
  }

  if (reaction === 'happy') {
    return <path d={`M${cx - 4} ${cy} Q${cx} ${cy + 4} ${cx + 4} ${cy}`} stroke="#7C2D12" strokeWidth={1.6} fill="none" strokeLinecap="round" />
  }

  if (reaction === 'sleeping') {
    return <path d={`M${cx - 3.4} ${cy + 0.8} Q${cx} ${cy + 2.4} ${cx + 3.4} ${cy + 0.8}`} stroke="#7C2D12" strokeWidth={1.3} fill="none" strokeLinecap="round" />
  }

  return <path d={`M${cx - 3.5} ${cy + 1} Q${cx} ${cy + 2.6} ${cx + 3.5} ${cy + 1}`} stroke="#7C2D12" strokeWidth={1.4} fill="none" strokeLinecap="round" />
}

function FloatingLabel({ customName, stage }: { customName?: string; stage: GrowthStage }) {
  if (!customName) return null

  const width = Math.max(42, customName.length * 6.8 + 16)

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
        background: '#FAF8F0',
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

export function GirasolCharacter({
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
  const faceY = stage === 'sprout' ? groundY - 24 : stage === 'growing' ? groundY - 72 : groundY - 106
  const stemTop = stage === 'sprout' ? groundY - 26 : stage === 'growing' ? groundY - 74 : groundY - 108
  const leafLift = reaction === 'cheer' ? -6 : 0

  const rootAnimation = useMemo(() => {
    if (reducedMotion) return undefined
    if (reaction === 'sleeping') return { rotate: [0, 0.4, 0, -0.4, 0], y: [0, 0.8, 0] }
    if (reaction === 'cheer') return { rotate: [0, 2.4, 0, -2.4, 0], y: [0, -2, 0] }
    return { rotate: [0, 1.5, 0, -1.5, 0] }
  }, [reaction, reducedMotion])

  return (
    <div className={className} style={{ width: w, display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={healthFilter ? { filter: healthFilter } : undefined} aria-hidden="true">
      <motion.g
        animate={rootAnimation}
        transition={reducedMotion ? undefined : { duration: reaction === 'sleeping' ? 4.6 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${groundY}px` }}
      >
        {stage === 'seed' && (
          <g>
            <ellipse cx={cx} cy={groundY - 1} rx={7.5} ry={10} fill={TOKENS.seedBrown} />
            <path d={`M${cx - 2.5} ${groundY - 7} Q${cx} ${groundY - 1} ${cx - 1} ${groundY + 6}`} stroke={TOKENS.gold} strokeWidth={1} fill="none" />
            <path d={`M${cx + 2} ${groundY - 6} Q${cx + 4} ${groundY - 1} ${cx + 2.5} ${groundY + 5}`} stroke={TOKENS.gold} strokeWidth={0.8} fill="none" opacity={0.8} />
          </g>
        )}

        {stage === 'sprout' && (
          <g>
            <line x1={cx} y1={groundY} x2={cx} y2={stemTop} stroke={PALETTE.stem} strokeWidth={4} strokeLinecap="round" />
            <ellipse cx={cx - 10} cy={groundY - 14} rx={9} ry={5.6} fill={PALETTE.leaf} transform={`rotate(-24 ${cx - 10} ${groundY - 14})`} />
            <ellipse cx={cx + 8} cy={groundY - 17} rx={8} ry={5} fill={TOKENS.leafMuted} transform={`rotate(26 ${cx + 8} ${groundY - 17})`} />
            <ellipse cx={cx} cy={faceY} rx={12} ry={10} fill={PALETTE.disk} />
            <Eye x={cx - 4.5} y={faceY - 0.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 4.5} y={faceY - 0.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
          </g>
        )}

        {stage === 'growing' && (
          <g>
            <line x1={cx} y1={groundY} x2={cx} y2={stemTop} stroke={PALETTE.stem} strokeWidth={4.6} strokeLinecap="round" />
            <ellipse cx={cx - 15} cy={groundY - 24 + leafLift} rx={12} ry={7} fill={PALETTE.leaf} transform={`rotate(-26 ${cx - 15} ${groundY - 24 + leafLift})`} />
            <ellipse cx={cx + 15} cy={groundY - 37 + leafLift} rx={12} ry={7} fill={TOKENS.leafMuted} transform={`rotate(24 ${cx + 15} ${groundY - 37 + leafLift})`} />
            <ellipse cx={cx - 12} cy={groundY - 52 + leafLift / 2} rx={10} ry={6} fill={PALETTE.leaf} transform={`rotate(-44 ${cx - 12} ${groundY - 52 + leafLift / 2})`} />
            <circle cx={cx} cy={faceY} r={14} fill={PALETTE.disk} />
            <Eye x={cx - 5.8} y={faceY - 1} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 5.8} y={faceY - 1} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <path d={`M${cx - 3} ${faceY + 10} Q${cx - 1} ${faceY + 8} ${cx + 1} ${faceY + 10}`} stroke={TOKENS.seedBrown} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          </g>
        )}

        {(stage === 'blooming' || stage === 'mastered') && (
          <g>
            {stage === 'mastered' && (
              <>
                <circle cx={cx} cy={faceY} r={30} fill={PALETTE.aura} opacity={0.2} />
                <circle cx={cx} cy={faceY} r={23} fill={PALETTE.aura} opacity={0.18} />
                {Array.from({ length: 8 }).map((_, index) => {
                  const angle = (index / 8) * Math.PI * 2
                  return (
                    <circle
                      key={index}
                      cx={cx + Math.cos(angle) * 28}
                      cy={faceY + Math.sin(angle) * 28}
                      r={1.8}
                      fill={TOKENS.gold}
                      opacity={0.8}
                    />
                  )
                })}
              </>
            )}
            <line x1={cx} y1={groundY} x2={cx} y2={stemTop} stroke={PALETTE.stem} strokeWidth={5.2} strokeLinecap="round" />
            <ellipse cx={cx - 18} cy={groundY - 28 + leafLift} rx={15} ry={8.5} fill={PALETTE.leaf} transform={`rotate(-28 ${cx - 18} ${groundY - 28 + leafLift})`} />
            <ellipse cx={cx + 18} cy={groundY - 46 + leafLift} rx={15} ry={8.5} fill={TOKENS.leafMuted} transform={`rotate(28 ${cx + 18} ${groundY - 46 + leafLift})`} />
            <ellipse cx={cx - 14} cy={groundY - 66 + leafLift / 2} rx={12} ry={6.6} fill={PALETTE.leaf} transform={`rotate(-52 ${cx - 14} ${groundY - 66 + leafLift / 2})`} />
            <ellipse cx={cx + 13} cy={groundY - 80 + leafLift / 2} rx={11} ry={6.4} fill={TOKENS.leafMuted} transform={`rotate(44 ${cx + 13} ${groundY - 80 + leafLift / 2})`} />
            {Array.from({ length: stage === 'mastered' ? 16 : 14 }).map((_, index) => {
              const angle = (index / (stage === 'mastered' ? 16 : 14)) * Math.PI * 2
              const px = cx + Math.cos(angle) * 18
              const py = faceY + Math.sin(angle) * 18
              return (
                <ellipse
                  key={index}
                  cx={px}
                  cy={py}
                  rx={5.8}
                  ry={14}
                  fill={index % 2 === 0 ? PALETTE.petal : PALETTE.petalShade}
                  transform={`rotate(${(angle * 180) / Math.PI + 90} ${px} ${py})`}
                />
              )
            })}
            <circle cx={cx} cy={faceY} r={17} fill={PALETTE.disk} />
            <circle cx={cx} cy={faceY} r={13} fill={PALETTE.disk} opacity={0.24} />
            <Eye x={cx - 7.5} y={faceY - 2.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 7.5} y={faceY - 2.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Mouth cx={cx} cy={faceY + 6.5} reaction={reaction === 'idle' && stage === 'mastered' ? 'happy' : reaction} />
            <circle cx={cx - 12} cy={faceY + 3.5} r={2.2} fill={PALETTE.blush} opacity={0.45} />
            <circle cx={cx + 12} cy={faceY + 3.5} r={2.2} fill={PALETTE.blush} opacity={0.45} />
            {reaction === 'sleeping' && (
              <g fill={TOKENS.forestDeep} opacity={0.7}>
                <path d={`M${cx + 17} ${faceY - 18} h6 l-5 6 h6`} />
                <path d={`M${cx + 23} ${faceY - 25} h4 l-3 4 h4`} />
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
