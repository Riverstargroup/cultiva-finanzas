import type { GrowthStage, HealthState } from '../../types'

interface LirioProps {
  stage: GrowthStage
  healthState?: HealthState
  size?: number
  className?: string
}

export function Lirio({ stage, healthState, size = 120, className }: LirioProps) {
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
          <ellipse cx={cx} cy={groundY} rx={5} ry={4} fill="#8B5E3C" opacity={0.6} />
          <path d={`M${cx} ${groundY - 1} Q${cx + 2} ${groundY - 4} ${cx + 3} ${groundY - 2}`} stroke="#C2185B" strokeWidth={1} fill="none" opacity={0.5} />
          <ellipse cx={cx} cy={groundY - 3} rx={3} ry={2.5} fill="#6B4423" />
        </g>
      )}

      {stage === 'sprout' && (
        <g>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 22} stroke="#2E5D34" strokeWidth={3} strokeLinecap="round" />
          <path d={`M${cx} ${groundY - 22} L${cx - 4} ${groundY - 10}`} stroke="#2E5D34" strokeWidth={1.5} fill="none" />
          <path d={`M${cx} ${groundY - 22} L${cx + 4} ${groundY - 10}`} stroke="#2E5D34" strokeWidth={1.5} fill="none" />
        </g>
      )}

      {stage === 'growing' && (
        <g>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 65} stroke="#2E5D34" strokeWidth={3.5} strokeLinecap="round" />
          <path d={`M${cx} ${groundY - 25} Q${cx - 18} ${groundY - 20} ${cx - 20} ${groundY - 35}`} stroke="#2E5D34" strokeWidth={2} fill="none" />
          <path d={`M${cx} ${groundY - 38} Q${cx + 18} ${groundY - 33} ${cx + 20} ${groundY - 48}`} stroke="#2E5D34" strokeWidth={2} fill="none" />
          <ellipse cx={cx} cy={groundY - 65} rx={4} ry={7} fill="#8B1045" />
        </g>
      )}

      {(stage === 'blooming' || stage === 'mastered') && (
        <g>
          {/* Main stem */}
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 90} stroke="#2E5D34" strokeWidth={3.5} strokeLinecap="round" />
          {/* Strap leaves */}
          <path d={`M${cx} ${groundY - 28} Q${cx - 22} ${groundY - 20} ${cx - 24} ${groundY - 38}`} stroke="#2E5D34" strokeWidth={2.5} fill="none" />
          <path d={`M${cx} ${groundY - 50} Q${cx + 22} ${groundY - 42} ${cx + 24} ${groundY - 62}`} stroke="#2E5D34" strokeWidth={2.5} fill="none" />
          {/* 6 recurved trumpet petals */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180
            return (
              <path
                key={i}
                d={`M${cx} ${groundY - 90} Q${cx + Math.sin(angle) * 18} ${groundY - 90 - Math.cos(angle) * 8} ${cx + Math.sin(angle) * 14} ${groundY - 90 - Math.cos(angle) * 22}`}
                stroke="#C2185B"
                strokeWidth={2}
                fill="#E91E63"
                fillOpacity={0.85}
                transform={`rotate(${i * 60} ${cx} ${groundY - 90})`}
              />
            )
          })}
          {/* Stamens */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180
            return (
              <line
                key={i}
                x1={cx}
                y1={groundY - 90}
                x2={cx + Math.sin(angle) * 8}
                y2={groundY - 90 - Math.cos(angle) * 8}
                stroke="#F5C43A"
                strokeWidth={1}
              />
            )
          })}
          <circle cx={cx} cy={groundY - 90} r={5} fill="#F8BBD0" />
          {/* Mastered: second flower bud + glow */}
          {stage === 'mastered' && (
            <>
              <line x1={cx + 15} y1={groundY - 70} x2={cx + 22} y2={groundY - 88} stroke="#2E5D34" strokeWidth={2} />
              <ellipse cx={cx + 22} cy={groundY - 90} rx={5} ry={8} fill="#C2185B" />
              <circle cx={cx} cy={groundY - 90} r={22} fill="#FFD1E1" opacity={0.12} />
            </>
          )}
        </g>
      )}
    </svg>
  )
}
