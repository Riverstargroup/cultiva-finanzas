import type { GrowthStage, HealthState } from '../../types'

interface HelechoProps {
  stage: GrowthStage
  healthState?: HealthState
  size?: number
  className?: string
}

function Frond({ cx, cy, rotation, scale = 1 }: { cx: number; cy: number; rotation: number; scale?: number }) {
  const pinnaeCount = 6
  return (
    <g transform={`rotate(${rotation} ${cx} ${cy}) scale(${scale})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {Array.from({ length: pinnaeCount }).map((_, i) => {
        const t = i / (pinnaeCount - 1)
        const rachisX = cx + t * 22
        const rachisY = cy - t * 28
        const side = i % 2 === 0 ? -1 : 1
        return (
          <ellipse
            key={i}
            cx={rachisX + side * 7}
            cy={rachisY}
            rx={5}
            ry={2.5}
            fill="#4CAF50"
            fillOpacity={0.85 - t * 0.2}
            transform={`rotate(${side * 30} ${rachisX + side * 7} ${rachisY})`}
          />
        )
      })}
      <path
        d={`M${cx} ${cy} Q${cx + 10} ${cy - 14} ${cx + 22} ${cy - 28}`}
        stroke="#2E7D4F"
        strokeWidth={1.5}
        fill="none"
      />
    </g>
  )
}

export function Helecho({ stage, healthState, size = 120, className }: HelechoProps) {
  const h = size
  const w = size
  const cx = w / 2
  const groundY = h * 0.875

  const healthFilter =
    healthState === 'wilting' ? 'saturate(0.5) brightness(0.85)' :
    healthState === 'dying' ? 'saturate(0.2) brightness(0.7)' :
    undefined

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} style={healthFilter ? { filter: healthFilter } : undefined} aria-hidden="true">
      {stage === 'seed' && (
        <g>
          <circle cx={cx} cy={groundY - 1} r={3} fill="#2E7D4F" opacity={0.7} />
          <path d={`M${cx} ${groundY - 1} q2 -3 4 -1 q-1 1 -2 0`} stroke="#4CAF50" strokeWidth={1} fill="none" />
        </g>
      )}

      {stage === 'sprout' && (
        <g>
          <path d={`M${cx} ${groundY} q-6 -8 0 -20`} stroke="#2E7D4F" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d={`M${cx} ${groundY - 20} q4 -4 6 -2 q-4 4 -6 2`} stroke="#4CAF50" strokeWidth={1.5} fill="#4CAF50" fillOpacity={0.5} />
        </g>
      )}

      {stage === 'growing' && (
        <g>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 50} stroke="#2E7D4F" strokeWidth={2.5} strokeLinecap="round" />
          <Frond cx={cx} cy={groundY - 50} rotation={-50} scale={0.85} />
          <Frond cx={cx} cy={groundY - 45} rotation={50} scale={0.75} />
        </g>
      )}

      {(stage === 'blooming' || stage === 'mastered') && (
        <g>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 60} stroke="#2E7D4F" strokeWidth={3} strokeLinecap="round" />
          {/* Fan of 5 fronds */}
          {[-60, -30, 0, 30, 60].map((rot, i) => (
            <Frond key={i} cx={cx} cy={groundY - 58} rotation={rot} scale={1 + Math.abs(i - 2) * 0.05} />
          ))}
          {/* Mastered: extra depth fronds + spore dots */}
          {stage === 'mastered' && (
            <>
              {[-75, 75].map((rot, i) => (
                <Frond key={i} cx={cx} cy={groundY - 55} rotation={rot} scale={0.7} />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <circle
                  key={i}
                  cx={cx - 20 + i * 8}
                  cy={groundY - 50}
                  r={1.5}
                  fill="#1B3B26"
                  opacity={0.5}
                />
              ))}
              <circle cx={cx} cy={groundY - 55} r={30} fill="#C8E6C9" opacity={0.1} />
            </>
          )}
        </g>
      )}
    </svg>
  )
}
