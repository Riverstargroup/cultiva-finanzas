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
  seedBrown: '#78350F',
} as const

const PALETTE = {
  petal: '#A78BFA',
  vein: '#7C3AED',
  stem: '#2E5D34',
  face: '#E9D5FF',
  iris: '#6D28D9',
  aura: '#EDE9FE',
} as const

function getHealthFilter(healthState?: HealthState) {
  if (healthState === 'thriving') return 'saturate(1.08) brightness(1.04)'
  if (healthState === 'wilting') return 'saturate(0.58) brightness(0.87)'
  if (healthState === 'dying') return 'saturate(0.28) brightness(0.73)'
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
        <path d="M-4.8 0 Q0 -2.2 4.8 0" stroke={TOKENS.forestDeep} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </g>
    )
  }

  return (
    <g transform={`translate(${x} ${y}) rotate(${worried ? -12 : 0}) scale(1 ${happy ? 0.84 : 1})`}>
      {worried && <path d="M-5.3 -7 L0.5 -8.7" stroke={TOKENS.forestDeep} strokeWidth={1.1} strokeLinecap="round" />}
      <ellipse cx="0" cy="0" rx="5.7" ry={cheer ? 5.8 : 5.2} fill="#FFFFFF" />
      <ellipse cx="0.1" cy="0.3" rx="2.9" ry="3.2" fill={PALETTE.iris} />
      <circle cx="0.3" cy="0.6" r="1.5" fill="#111827" />
      <circle cx="1.2" cy="-0.8" r="0.7" fill="#FFFFFF" />
      <motion.path
        d="M-5.7 -0.3 Q0 -6.1 5.7 -0.3"
        stroke={PALETTE.face}
        strokeWidth="6.2"
        fill="none"
        strokeLinecap="round"
        animate={reducedMotion ? undefined : { y: isBlinking ? 7.8 : 0 }}
        transition={{ duration: 0.14, ease: 'easeInOut' }}
      />
    </g>
  )
}

function Mouth({ cx, cy, reaction }: { cx: number; cy: number; reaction: PlantReaction }) {
  if (reaction === 'cheer') return <ellipse cx={cx} cy={cy + 1} rx={3.1} ry={3.8} fill="#6D28D9" />
  if (reaction === 'worried') return <path d={`M${cx - 3.8} ${cy + 2.5} Q${cx} ${cy - 0.6} ${cx + 3.8} ${cy + 2.5}`} stroke="#6D28D9" strokeWidth={1.4} fill="none" strokeLinecap="round" />
  if (reaction === 'happy') return <path d={`M${cx - 3.8} ${cy} Q${cx} ${cy + 3.2} ${cx + 3.8} ${cy}`} stroke="#6D28D9" strokeWidth={1.4} fill="none" strokeLinecap="round" />
  if (reaction === 'sleeping') return <path d={`M${cx - 3} ${cy + 0.8} Q${cx} ${cy + 2.1} ${cx + 3} ${cy + 0.8}`} stroke="#6D28D9" strokeWidth={1.2} fill="none" strokeLinecap="round" />
  return <path d={`M${cx - 3.3} ${cy + 0.8} Q${cx} ${cy + 2.1} ${cx + 3.3} ${cy + 0.8}`} stroke="#6D28D9" strokeWidth={1.3} fill="none" strokeLinecap="round" />
}

function Petal({
  cx,
  cy,
  rotation,
  scale = 1,
}: {
  cx: number
  cy: number
  rotation: number
  scale?: number
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotation}) scale(${scale})`}>
      <path d="M0 0 Q-6 -10 0 -24 Q6 -10 0 0 Z" fill={PALETTE.petal} />
      <path d="M0 -1 L0 -20" stroke={PALETTE.vein} strokeWidth={1.1} strokeLinecap="round" opacity={0.9} />
    </g>
  )
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
        background: '#F9F5FF',
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

export function LirioCharacter({
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
  const faceY = stage === 'sprout' ? groundY - 24 : stage === 'growing' ? groundY - 66 : groundY - 88
  const leafLift = reaction === 'cheer' ? -6 : 0

  const rootAnimation = useMemo(() => {
    if (reducedMotion) return undefined
    if (reaction === 'sleeping') return { rotate: [0, 0.4, 0, -0.4, 0], y: [0, 0.8, 0] }
    if (reaction === 'cheer') return { rotate: [0, 2, 0, -2, 0], y: [0, -2.2, 0] }
    return { rotate: [0, 1.5, 0, -1.5, 0] }
  }, [reaction, reducedMotion])

  return (
    <div className={className} style={{ width: w, display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={healthFilter ? { filter: healthFilter } : undefined} aria-hidden="true">
      <motion.g
        animate={rootAnimation}
        transition={reducedMotion ? undefined : { duration: reaction === 'sleeping' ? 4.6 : 3.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${groundY}px` }}
      >
        {stage === 'seed' && (
          <g>
            <ellipse cx={cx} cy={groundY + 1} rx={7.2} ry={8.6} fill={TOKENS.seedBrown} />
            <path d={`M${cx - 2.4} ${groundY - 5} Q${cx} ${groundY - 1} ${cx - 1} ${groundY + 5}`} stroke={TOKENS.seedBrown} strokeWidth={1} fill="none" />
            <ellipse cx={cx + 1.5} cy={groundY - 1} rx={1.1} ry={2.4} fill={TOKENS.claySoft} opacity={0.7} />
          </g>
        )}

        {stage === 'sprout' && (
          <g>
            <line x1={cx} y1={groundY} x2={cx} y2={groundY - 26} stroke={PALETTE.stem} strokeWidth={3.4} strokeLinecap="round" />
            <path d={`M${cx} ${groundY - 11} Q${cx - 8} ${groundY - 16} ${cx - 10} ${groundY - 27}`} stroke={TOKENS.leafBright} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <path d={`M${cx} ${groundY - 17} Q${cx + 8} ${groundY - 22} ${cx + 10} ${groundY - 33}`} stroke={TOKENS.leafBright} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <ellipse cx={cx} cy={faceY} rx={11} ry={9.5} fill={PALETTE.face} />
            <Eye x={cx - 4.2} y={faceY} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 4.2} y={faceY} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
          </g>
        )}

        {stage === 'growing' && (
          <g>
            <line x1={cx} y1={groundY} x2={cx} y2={groundY - 68} stroke={PALETTE.stem} strokeWidth={3.8} strokeLinecap="round" />
            <path d={`M${cx} ${groundY - 18 + leafLift / 2} Q${cx - 14} ${groundY - 26 + leafLift} ${cx - 18} ${groundY - 44 + leafLift}`} stroke={TOKENS.leafBright} strokeWidth={2.6} fill="none" strokeLinecap="round" />
            <path d={`M${cx} ${groundY - 34 + leafLift / 2} Q${cx + 15} ${groundY - 40 + leafLift} ${cx + 18} ${groundY - 58 + leafLift}`} stroke={TOKENS.leafBright} strokeWidth={2.6} fill="none" strokeLinecap="round" />
            <ellipse cx={cx} cy={faceY} rx={14} ry={12} fill={PALETTE.face} />
            <Petal cx={cx - 8} cy={faceY - 4} rotation={-32} scale={0.78} />
            <Petal cx={cx + 8} cy={faceY - 4} rotation={32} scale={0.78} />
            <Petal cx={cx} cy={faceY - 8} rotation={0} scale={0.82} />
            <Eye x={cx - 5.6} y={faceY + 0.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 5.6} y={faceY + 0.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <path d={`M${cx - 4.4} ${faceY + 10} Q${cx} ${faceY + 6.5} ${cx + 4.4} ${faceY + 10}`} stroke={PALETTE.vein} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          </g>
        )}

        {(stage === 'blooming' || stage === 'mastered') && (
          <g>
            {stage === 'mastered' && (
              <>
                <circle cx={cx} cy={faceY} r={31} fill={PALETTE.aura} opacity={0.2} />
                <circle cx={cx} cy={faceY} r={24} fill={PALETTE.aura} opacity={0.16} />
                {Array.from({ length: 6 }).map((_, index) => {
                  const angle = (index / 6) * Math.PI * 2
                  return (
                    <ellipse
                      key={index}
                      cx={cx + Math.cos(angle) * 27}
                      cy={faceY + Math.sin(angle) * 27}
                      rx={1.7}
                      ry={3}
                      fill={PALETTE.petal}
                      opacity={0.82}
                      transform={`rotate(${(angle * 180) / Math.PI} ${cx + Math.cos(angle) * 27} ${faceY + Math.sin(angle) * 27})`}
                    />
                  )
                })}
              </>
            )}
            <line x1={cx} y1={groundY} x2={cx} y2={groundY - 90} stroke={PALETTE.stem} strokeWidth={4.2} strokeLinecap="round" />
            <path d={`M${cx} ${groundY - 24 + leafLift / 2} Q${cx - 16} ${groundY - 32 + leafLift} ${cx - 21} ${groundY - 54 + leafLift}`} stroke={TOKENS.leafBright} strokeWidth={2.8} fill="none" strokeLinecap="round" />
            <path d={`M${cx} ${groundY - 42 + leafLift / 2} Q${cx + 16} ${groundY - 50 + leafLift} ${cx + 22} ${groundY - 70 + leafLift}`} stroke={TOKENS.leafBright} strokeWidth={2.8} fill="none" strokeLinecap="round" />
            <Petal cx={cx} cy={faceY - 12} rotation={0} scale={1.02} />
            <Petal cx={cx - 12} cy={faceY - 4} rotation={-42} scale={1} />
            <Petal cx={cx + 12} cy={faceY - 4} rotation={42} scale={1} />
            <Petal cx={cx - 15} cy={faceY + 7} rotation={-78} scale={0.94} />
            <Petal cx={cx + 15} cy={faceY + 7} rotation={78} scale={0.94} />
            {stage === 'mastered' && <Petal cx={cx} cy={faceY + 12} rotation={180} scale={0.72} />}
            <ellipse cx={cx} cy={faceY} rx={15} ry={13} fill={PALETTE.face} />
            <Eye x={cx - 6.4} y={faceY - 1.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Eye x={cx + 6.4} y={faceY - 1.5} reaction={reaction} isBlinking={isBlinking} reducedMotion={!!reducedMotion} />
            <Mouth cx={cx} cy={faceY + 7.2} reaction={reaction === 'idle' && stage === 'mastered' ? 'happy' : reaction} />
            <circle cx={cx} cy={faceY - 15} r={1.6} fill={TOKENS.claySoft} />
            <path d={`M${cx} ${faceY - 14} L${cx} ${faceY - 24}`} stroke={TOKENS.claySoft} strokeWidth={1.1} strokeLinecap="round" />
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
