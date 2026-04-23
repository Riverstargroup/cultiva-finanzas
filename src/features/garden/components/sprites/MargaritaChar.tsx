import { Eye, Mouth, useBlink, useOscillate } from './primitives'
import type { PlantCharProps, PlantMood } from './primitives'

export function MargaritaChar({ size = 110, mood = 'idle' }: PlantCharProps): JSX.Element {
  const closed = useBlink(mood !== 'sleeping')
  const bounce = Math.abs(useOscillate(1300, 1))
  const faceY = 36 - bounce * 3.5
  const headScale = 1 + bounce * 0.07
  const eyeMood: PlantMood = mood === 'idle' ? 'cheer' : mood
  const mouthMood: PlantMood = mood === 'idle' ? 'happy' : mood

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: 'visible' }}>
      <path
        d="M 50 124 Q 47 104 50 82 Q 53 62 50 52"
        stroke="#78A94B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M 50 98 Q 28 88 20 96 Q 28 104 50 100 Z" fill="#78A94B" stroke="#5B7A3A" strokeWidth="0.9" />
      <path d="M 50 88 Q 72 78 80 86 Q 70 94 50 90 Z" fill="#78A94B" stroke="#5B7A3A" strokeWidth="0.9" />
      <g
        style={{
          transformOrigin: `50px ${faceY}px`,
          transform: `translateY(${-bounce * 2}px) scale(${headScale})`,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2
          const x = 50 + Math.cos(a) * 17
          const y = faceY + Math.sin(a) * 17
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="4.5"
              ry="12"
              fill="#FEFBF6"
              stroke="#D8BFC0"
              strokeWidth="0.9"
              transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
            />
          )
        })}
        <circle cx="50" cy={faceY} r="11.5" fill="#FCD34D" stroke="#D97706" strokeWidth="1.1" />
        <circle cx="46.5" cy={faceY - 2.5} r="3" fill="#FDE68A" opacity="0.75" />
        <Eye cx={45.5} cy={faceY - 0.5} r={2.7} closed={closed} mood={eyeMood} irisColor="#5D3136" />
        <Eye cx={54.5} cy={faceY - 0.5} r={2.7} closed={closed} mood={eyeMood} irisColor="#5D3136" />
        <Mouth cx={50} cy={faceY + 6} mood={mouthMood} color="#5D3136" r={3.6} />
        <circle cx="40.5" cy={faceY + 2.5} r="1.9" fill="#F472B6" opacity="0.55" />
        <circle cx="59.5" cy={faceY + 2.5} r="1.9" fill="#F472B6" opacity="0.55" />
      </g>
    </svg>
  )
}
