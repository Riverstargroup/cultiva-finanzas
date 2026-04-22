import type { GrowthStage, HealthState } from '../../types'

interface GirasolProps {
  stage: GrowthStage
  healthState?: HealthState
  size?: number
  className?: string
}

export function Girasol({ stage, healthState, size = 120, className }: GirasolProps) {
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
          <path
            d={`M${cx - 3} ${groundY - 1} L${cx} ${groundY - 6} L${cx + 3} ${groundY - 1} L${cx + 2} ${groundY + 2} L${cx - 2} ${groundY + 2} Z`}
            fill="#78350F"
          />
          <path d={`M${cx - 2} ${groundY - 1} L${cx + 2} ${groundY - 1}`} stroke="#F5C43A" strokeWidth={0.5} />
        </g>
      )}

      {stage === 'sprout' && (
        <g>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 25} stroke="#2E5D34" strokeWidth={4} strokeLinecap="round" />
          <ellipse cx={cx - 9} cy={groundY - 18} rx={8} ry={6} fill="#78A94B" transform={`rotate(-20 ${cx - 9} ${groundY - 18})`} />
          <ellipse cx={cx + 9} cy={groundY - 18} rx={8} ry={6} fill="#78A94B" transform={`rotate(20 ${cx + 9} ${groundY - 18})`} />
        </g>
      )}

      {stage === 'growing' && (
        <g>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 75} stroke="#2E5D34" strokeWidth={4.5} strokeLinecap="round" />
          {/* 3 cordate leaves */}
          <path d={`M${cx} ${groundY - 30} Q${cx - 22} ${groundY - 22} ${cx - 24} ${groundY - 38} Q${cx - 12} ${groundY - 45} ${cx} ${groundY - 30}`} fill="#78A94B" />
          <path d={`M${cx} ${groundY - 50} Q${cx + 22} ${groundY - 42} ${cx + 24} ${groundY - 58} Q${cx + 12} ${groundY - 65} ${cx} ${groundY - 50}`} fill="#78A94B" />
          {/* Closed bud */}
          <ellipse cx={cx} cy={groundY - 75} rx={7} ry={10} fill="#3E6B25" />
          {/* Bract lines */}
          {[-3, 0, 3].map((dx, i) => (
            <line key={i} x1={cx + dx} y1={groundY - 68} x2={cx + dx} y2={groundY - 75} stroke="#2E7D4F" strokeWidth={0.8} />
          ))}
        </g>
      )}

      {(stage === 'blooming' || stage === 'mastered') && (
        <g>
          {/* Thick stem */}
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 110} stroke="#2E5D34" strokeWidth={5} strokeLinecap="round" />
          {/* Large heart leaves */}
          <path d={`M${cx} ${groundY - 35} Q${cx - 28} ${groundY - 25} ${cx - 30} ${groundY - 48} Q${cx - 14} ${groundY - 58} ${cx} ${groundY - 35}`} fill="#78A94B" />
          <path d={`M${cx} ${groundY - 60} Q${cx + 28} ${groundY - 50} ${cx + 30} ${groundY - 73} Q${cx + 14} ${groundY - 83} ${cx} ${groundY - 60}`} fill="#78A94B" />
          {/* 18 ray petals */}
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i * 20 * Math.PI) / 180
            return (
              <ellipse
                key={i}
                cx={cx + Math.sin(angle) * 20}
                cy={groundY - 110 - Math.cos(angle) * 20}
                rx={3}
                ry={9}
                fill="#FCD34D"
                transform={`rotate(${i * 20} ${cx} ${groundY - 110})`}
              />
            )
          })}
          {/* Inner ring */}
          <circle cx={cx} cy={groundY - 110} r={14} fill="#D97706" />
          {/* Seed disk pattern */}
          {stage === 'mastered' ? (
            <>
              {Array.from({ length: 21 }).map((_, i) => {
                const angle = (i * 137.5 * Math.PI) / 180
                const r = 2 + Math.sqrt(i) * 2
                const dotX = cx + Math.cos(angle) * r
                const dotY = groundY - 110 + Math.sin(angle) * r
                return <circle key={i} cx={dotX} cy={dotY} r={1.2} fill="#78350F" opacity={0.8} />
              })}
              <circle cx={cx} cy={groundY - 110} r={28} fill="#FEF3C7" opacity={0.15} />
            </>
          ) : (
            <>
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                return <circle key={i} cx={cx + Math.cos(angle) * 7} cy={groundY - 110 + Math.sin(angle) * 7} r={1.5} fill="#78350F" opacity={0.6} />
              })}
            </>
          )}
          <circle cx={cx} cy={groundY - 110} r={6} fill="#78350F" />
        </g>
      )}
    </svg>
  )
}
