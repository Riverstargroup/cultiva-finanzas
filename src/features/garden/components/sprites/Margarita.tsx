import type { GrowthStage, HealthState } from '../../types'

interface MargaritaProps {
  stage: GrowthStage
  healthState?: HealthState
  size?: number
  className?: string
}

export function Margarita({ stage, healthState, size = 120, className }: MargaritaProps) {
  const h = size
  const w = size
  const cx = w / 2
  const groundY = h * 0.875

  const healthFilter =
    healthState === 'wilting' ? 'saturate(0.5) brightness(0.85)' :
    healthState === 'dying' ? 'saturate(0.2) brightness(0.7)' :
    undefined

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={className}
      style={healthFilter ? { filter: healthFilter } : undefined}
      aria-hidden="true"
    >
      {stage === 'seed' && (
        <g>
          <ellipse cx={cx} cy={groundY + 2} rx={6} ry={4} fill="#8B5E3C" opacity={0.6} />
          <ellipse cx={cx} cy={groundY - 2} rx={4} ry={3} fill="#6B4423" />
          <ellipse cx={cx} cy={groundY - 3} rx={2.5} ry={2} fill="#5B3A1A" />
        </g>
      )}

      {stage === 'sprout' && (
        <g>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 18} stroke="#5B7A3A" strokeWidth={2.5} strokeLinecap="round" />
          <ellipse cx={cx - 6} cy={groundY - 14} rx={5} ry={4} fill="#78A94B" transform={`rotate(-30 ${cx - 6} ${groundY - 14})`} />
          <ellipse cx={cx + 6} cy={groundY - 14} rx={5} ry={4} fill="#78A94B" transform={`rotate(30 ${cx + 6} ${groundY - 14})`} />
        </g>
      )}

      {stage === 'growing' && (
        <g>
          <path d={`M${cx} ${groundY} Q${cx - 3} ${groundY - 35} ${cx} ${groundY - 55}`} stroke="#5B7A3A" strokeWidth={3} fill="none" strokeLinecap="round" />
          <ellipse cx={cx - 12} cy={groundY - 30} rx={9} ry={5} fill="#78A94B" transform={`rotate(-40 ${cx - 12} ${groundY - 30})`} />
          <ellipse cx={cx + 12} cy={groundY - 38} rx={9} ry={5} fill="#78A94B" transform={`rotate(40 ${cx + 12} ${groundY - 38})`} />
          <ellipse cx={cx} cy={groundY - 55} rx={5} ry={7} fill="#3E6B25" />
        </g>
      )}

      {(stage === 'blooming' || stage === 'mastered') && (
        <g>
          {/* Stem */}
          <path d={`M${cx} ${groundY} Q${cx - 3} ${groundY - 45} ${cx} ${groundY - 85}`} stroke="#5B7A3A" strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* Side leaves */}
          <ellipse cx={cx - 14} cy={groundY - 45} rx={11} ry={5} fill="#78A94B" transform={`rotate(-40 ${cx - 14} ${groundY - 45})`} />
          <ellipse cx={cx + 14} cy={groundY - 55} rx={11} ry={5} fill="#78A94B" transform={`rotate(40 ${cx + 14} ${groundY - 55})`} />
          {/* Petals — 8 white ellipses rotated around center */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const petalCx = cx + Math.sin(angle) * 13
            const petalCy = groundY - 85 - Math.cos(angle) * 13
            return (
              <ellipse
                key={i}
                cx={petalCx}
                cy={petalCy}
                rx={5}
                ry={10}
                fill="#FFFFFF"
                stroke="#E8A628"
                strokeWidth={0.5}
                transform={`rotate(${i * 45} ${cx} ${groundY - 85})`}
              />
            )
          })}
          {/* Center */}
          <circle cx={cx} cy={groundY - 85} r={stage === 'mastered' ? 13 : 10} fill="#F5C43A" />
          <circle cx={cx} cy={groundY - 85} r={stage === 'mastered' ? 13 : 10} fill="url(#margaritaShade)" opacity={0.3} />
          {/* Mastered: extra petal ring + glow */}
          {stage === 'mastered' && (
            <>
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = ((i * 45 + 22.5) * Math.PI) / 180
                const petalCx = cx + Math.sin(angle) * 16
                const petalCy = groundY - 85 - Math.cos(angle) * 16
                return (
                  <ellipse
                    key={i}
                    cx={petalCx}
                    cy={petalCy}
                    rx={4}
                    ry={8}
                    fill="#FFFDE7"
                    opacity={0.8}
                    transform={`rotate(${i * 45 + 22.5} ${cx} ${groundY - 85})`}
                  />
                )
              })}
              <circle cx={cx} cy={groundY - 85} r={20} fill="#FFE89A" opacity={0.15} />
            </>
          )}
          <defs>
            <radialGradient id="margaritaShade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8A628" />
              <stop offset="100%" stopColor="#F5C43A" stopOpacity={0} />
            </radialGradient>
          </defs>
        </g>
      )}
    </svg>
  )
}
