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
  seedBrown: '#78350F',
} as const

const PALETTE = {
  frond: '#34D399',
  shadowFrond: '#059669',
  stem: '#1B3B26',
  face: '#8EE6C1',
  iris: '#047857',
  aura: '#D1FAE5',
} as const

function getHealthFilter(healthState?: HealthState) {
  if (healthState === 'thriving') return 'saturate(1.08) brightness(1.04)'
  if (healthState === 'wilting') return 'saturate(0.58) brightness(0.86)'
  if (healthState === 'dying') return 'saturate(0.26) brightness(0.72)'
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
        }, 170)
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

function Frond({
  x,
  y,
  rotation,
  scale = 1,
  fill,
}: {
  x: number
  y: number
  rotation: number
  scale?: number
  fill: string
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      <path d="M0 0 Q-4 -10 0 -24 Q8 -38 22 -48" stroke={fill} strokeWidth={3.2} fill="none" strokeLinecap="round" />
      {Array.from({ length: 5 }).map((_, index) => {
        const px = 3 + index * 4.2
        const py = -9 - index * 7
        return (
          <g key={index}>
            <ellipse cx={px - 6} cy={py} rx={7 - index * 0.6} ry={3.2} fill={fill} transform={`rotate(-26 ${px - 6} ${py})`} />
            <ellipse cx={px + 6} cy={py - 1} rx={6.5 - index * 0.5} ry={3} fill={fill} transform={`rotate(28 ${px + 6} ${py - 1})`} />
          </g>
        )
      })}
    </g>
  )
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

  if (sleeping) {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M-4.5 0 Q0 -2.4 4.5 0" stroke={TOKENS.forestDeep} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
    )
  }

  return (
    <g transform={`translate(${x} ${y}) rotate(${worried ? -18 : 0}) scale(1 ${happy ? 0.85 : 1})`}>
      {worried && <path d="M-5.5 -7 L0.5 -9" stroke={TOKENS.forestDeep} strokeWidth={1.2} strokeLinecap="round" />}
      <ellipse cx="0" cy="0" rx="5.5" ry="4.6" fill="#FFFFFF" />
      <ellipse cx="0.2" cy="0.2" rx="2.8" ry="3.1" fill={PALETTE.iris} />
      <circle cx="0.4" cy="0.4" r="1.6" fill="#111827" />
      <circle cx="1.4" cy="-0.8" r="0.7" fill="#FFFFFF" />
      <motion.path
        d="M-5.5 -0.3 Q0 -5.8 5.5 -0.3"
        stroke={PALETTE.face}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        animate={reducedMotion ? undefined : { y: isBlinking ? 7.4 : 0 }}
        transition={{ duration: 0.14, ease: 'easeInOut' }}
      />
    </g>
  )
}

function Mouth({ cx, cy, reaction }: { cx: number; cy: number; reaction: PlantReaction }) {
  if (reaction === 'cheer') return <ellipse cx={cx} cy={cy + 1} rx={3.2} ry={4} fill="#14532D" />
  if (reaction === 'worried') return <path d={`M${cx - 4} ${cy + 2.5} Q${cx} ${cy - 1} ${cx + 4} ${cy + 2.5}`} stroke="#14532D" strokeWidth={1.5} fill="none" strokeLinecap="round" />
  if (reaction === 'happy') return <path d={`M${cx - 4} ${cy} Q${cx} ${cy + 3.5} ${cx + 4} ${cy}`} stroke="#14532D" strokeWidth={1.5} fill="none" strokeLinecap="round" />
  if (reaction === 'sleeping') return <path d={`M${cx - 3} ${cy + 0.7} Q${cx} ${cy + 2.2} ${cx + 3} ${cy + 0.7}`} stroke="#14532D" strokeWidth={1.2} fill="none" strokeLinecap="round" />
  return <path d={`M${cx - 3.2} ${cy + 1} Q${cx} ${cy + 1.8} ${cx + 3.2} ${cy + 1}`} stroke="#14532D" strokeWidth={1.4} fill="none" strokeLinecap="round" />
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
        background: '#F3FAF5',
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

export function HeleChoCharacter({
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
  const faceY = stage === 'sprout' ? groundY - 20 : stage === 'growing' ? groundY - 52 : groundY - 56
  const frondLift = reaction === 'cheer' ? -8 : 0

  const rootAnimation = useMemo(() => {
    if (reducedMotion) return undefined
    if (reaction === 'sleeping') return { rotate: [0, 0.5, 0, -0.5, 0], y: [0, 0.8, 0] }
    if (reaction === 'cheer') return { rotate: [0, 2.2, 0, -2.2, 0], y: [0, -2.5, 0] }
    return { rotate: [0, 1.5, 0, -1.5, 0] }
  }, [reaction, reducedMotion])

  return (
    <div className={className} style={{ width: w, display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={healthFilter ? { filter: healthFilter } : undefined} aria-hidden="true">
      <motion.g
        animate={rootAnimation}
        transition={reducedMotion ? undefined : { duration: reaction === 'sleeping' ? 4.8 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${groundY}px` }}
      >
        {stage === 'seed' && (
          <g>
            <ellipse cx={cx} cy={groundY} rx={7} ry={8.5} fill={TOKENS.seedBrown} />
            <path d={`M${cx - 2} ${groundY - 5} q3 2 3 7`} stroke={TOKENS.leafMuted} strokeWidth={1} fill="none" />
            <path d={`M${cx + 1} ${groundY - 4} q2 1 2 5`} stroke={TOKENS.seedBrown} strokeWidth={0.9} fill="none" opacity={0.85} />
          </g>
        )}

        {stage === 'sprout' && (
          <g>
            <path d={`M${cx} ${groundY} Q${cx - 2} ${groundY - 12} ${cx} ${groundY - 22}`} stroke={PALETTE.stem} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M${cx} ${groundY - 22} Q${cx + 8} ${groundY - 28} ${cx + 4} ${groundY - 36}`} stroke={PALETTE.shadowFrond} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <ellipse cx={cx} cy={faceY} rx={11} ry={8.5} fill={PALETTE.face} />
            <Eye x={cx - 4} y={faceY - 0.2} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 4} y={faceY - 0.2} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
          </g>
        )}

        {stage === 'growing' && (
          <g>
            <path d={`M${cx} ${groundY} Q${cx - 2} ${groundY - 26} ${cx} ${groundY - 54}`} stroke={PALETTE.stem} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            <Frond x={cx - 3} y={groundY - 8 + frondLift / 2} rotation={-34} scale={0.72} fill={PALETTE.shadowFrond} />
            <Frond x={cx + 4} y={groundY - 10 + frondLift / 2} rotation={16} scale={0.74} fill={PALETTE.frond} />
            <Frond x={cx + 1} y={groundY - 5 + frondLift} rotation={52} scale={0.68} fill={PALETTE.shadowFrond} />
            <ellipse cx={cx} cy={faceY} rx={14} ry={11} fill={PALETTE.face} />
            <Eye x={cx - 5.6} y={faceY - 1} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 5.6} y={faceY - 1} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <path d={`M${cx - 5} ${faceY + 9} Q${cx} ${faceY + 5} ${cx + 5} ${faceY + 9}`} stroke={TOKENS.forestDeep} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={reaction === 'worried' ? 1 : 0.75} />
          </g>
        )}

        {(stage === 'blooming' || stage === 'mastered') && (
          <g>
            {stage === 'mastered' && (
              <>
                <circle cx={cx} cy={faceY} r={31} fill={PALETTE.aura} opacity={0.18} />
                <circle cx={cx} cy={faceY} r={24} fill={PALETTE.aura} opacity={0.16} />
                {Array.from({ length: 7 }).map((_, index) => {
                  const angle = (index / 7) * Math.PI * 2
                  return (
                    <circle
                      key={index}
                      cx={cx + Math.cos(angle) * 27}
                      cy={faceY + Math.sin(angle) * 27}
                      r={1.6}
                      fill={PALETTE.frond}
                      opacity={0.85}
                    />
                  )
                })}
              </>
            )}
            <path d={`M${cx} ${groundY} Q${cx - 1} ${groundY - 30} ${cx} ${groundY - 58}`} stroke={PALETTE.stem} strokeWidth={4} fill="none" strokeLinecap="round" />
            <Frond x={cx - 4} y={groundY - 6 + frondLift} rotation={-68} scale={0.82} fill={PALETTE.shadowFrond} />
            <Frond x={cx - 1} y={groundY - 10 + frondLift} rotation={-24} scale={0.86} fill={PALETTE.frond} />
            <Frond x={cx + 1} y={groundY - 11 + frondLift} rotation={18} scale={0.88} fill={PALETTE.shadowFrond} />
            <Frond x={cx + 3} y={groundY - 6 + frondLift} rotation={60} scale={0.82} fill={PALETTE.frond} />
            {stage === 'mastered' && <Frond x={cx} y={groundY - 4 + frondLift} rotation={0} scale={0.92} fill={PALETTE.frond} />}
            <ellipse cx={cx} cy={faceY} rx={16} ry={13} fill={PALETTE.face} />
            <Eye x={cx - 6.6} y={faceY - 1.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 6.6} y={faceY - 1.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Mouth cx={cx} cy={faceY + 7.5} reaction={reaction === 'idle' && stage === 'mastered' ? 'happy' : reaction} />
            <circle cx={cx - 11.5} cy={faceY + 2.5} r={1.7} fill={PALETTE.frond} opacity={0.28} />
            <circle cx={cx + 11.5} cy={faceY + 2.5} r={1.7} fill={PALETTE.frond} opacity={0.28} />
            {reaction === 'sleeping' && (
              <g fill={TOKENS.forestDeep} opacity={0.72}>
                <path d={`M${cx + 17} ${faceY - 16} h6 l-5 6 h6`} />
                <path d={`M${cx + 23} ${faceY - 23} h4 l-3 4 h4`} />
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
