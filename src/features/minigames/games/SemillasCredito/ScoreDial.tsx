import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Props {
  readonly score: number
}

const MIN = 300
const MAX = 850
const SWEEP_DEG = 220
const START_DEG = -200 // start angle (rotated so left side maps to MIN)
const RADIUS = 52
const CX = 60
const CY = 62
const STROKE_WIDTH = 10

function colorForScore(score: number): string {
  if (score >= 700) return '#16a34a'
  if (score >= 550) return '#eab308'
  return '#dc2626'
}

function labelForScore(score: number): string {
  if (score >= 750) return 'Excelente'
  if (score >= 700) return 'Muy bueno'
  if (score >= 640) return 'Bueno'
  if (score >= 580) return 'Regular'
  return 'Bajo'
}

// Arc path from angle A to angle B (degrees), both from center.
function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const startRad = (Math.PI / 180) * startDeg
  const endRad = (Math.PI / 180) * endDeg
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  const sweep = endDeg > startDeg ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`
}

export function ScoreDial({ score }: Props) {
  const reduced = useReducedMotion()
  const clamped = Math.max(MIN, Math.min(MAX, score))
  const pct = (clamped - MIN) / (MAX - MIN)

  const trackPath = describeArc(CX, CY, RADIUS, START_DEG, START_DEG + SWEEP_DEG)
  const fillEndDeg = START_DEG + SWEEP_DEG * pct
  const fillPath = describeArc(CX, CY, RADIUS, START_DEG, fillEndDeg)

  const color = colorForScore(clamped)

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 120 100"
        width="140"
        height="116"
        role="img"
        aria-label={`Score crediticio ${Math.round(clamped)} de ${MAX}`}
      >
        {/* Track */}
        <path
          d={trackPath}
          stroke="var(--leaf-soft, rgba(26, 58, 42, 0.12))"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
        />
        {/* Animated fill */}
        <motion.path
          d={fillPath}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          initial={false}
          animate={{ d: fillPath }}
          transition={{
            duration: reduced ? 0 : 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        {/* End markers */}
        <text
          x="14"
          y="94"
          fontSize="8"
          fill="var(--leaf-muted, #6b7a6b)"
          fontFamily="ui-sans-serif, system-ui"
        >
          300
        </text>
        <text
          x="96"
          y="94"
          fontSize="8"
          fill="var(--leaf-muted, #6b7a6b)"
          fontFamily="ui-sans-serif, system-ui"
        >
          850
        </text>
        {/* Central score */}
        <motion.text
          x={CX}
          y={CY + 2}
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="var(--forest-deep, #1a3a2a)"
          fontFamily="ui-sans-serif, system-ui"
          initial={false}
          animate={{ fill: color }}
          transition={{ duration: 0.4 }}
        >
          {Math.round(clamped)}
        </motion.text>
      </svg>
      <p
        className="text-[10px] uppercase tracking-[0.18em] font-semibold -mt-2"
        style={{ color: 'var(--leaf-muted, #6b7a6b)' }}
      >
        Score crediticio · {labelForScore(clamped)}
      </p>
    </div>
  )
}
