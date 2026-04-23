import { Eye, Mouth, useBlink, useOscillate } from './primitives'
import type { PlantCharProps } from './primitives'

export function GirasolChar({ size = 110, mood = 'idle' }: PlantCharProps): JSX.Element {
  const closed = useBlink(mood !== 'sleeping')
  const sway = useOscillate(4500, 4)
  const breath = 1 + useOscillate(3200, 0.04)
  const faceY = 34
  const petals = 12
  const effectiveMood = mood === 'idle' ? 'happy' : mood

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: 'visible' }}>
      <g style={{ transformOrigin: '50px 122px', transform: `rotate(${sway}deg)` }}>
        <path
          d="M 50 124 Q 47 96 50 74 Q 53 56 50 44"
          stroke="#2E5D34"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M 50 84 Q 28 74 20 84 Q 28 94 50 90 Z" fill="#78A94B" stroke="#2E5D34" strokeWidth="1" />
        <path d="M 26 80 Q 34 81 44 86" stroke="#2E5D34" strokeWidth="0.8" fill="none" />
        <path d="M 50 98 Q 74 88 82 97 Q 72 108 50 104 Z" fill="#78A94B" stroke="#2E5D34" strokeWidth="1" />
        <path d="M 74 94 Q 64 94 54 99" stroke="#2E5D34" strokeWidth="0.8" fill="none" />
        <g style={{ transformOrigin: `50px ${faceY}px`, transform: `scale(${breath})` }}>
          {Array.from({ length: petals }).map((_, i) => {
            const a = (i / petals) * Math.PI * 2
            const x = 50 + Math.cos(a) * 20
            const y = faceY + Math.sin(a) * 20
            return (
              <ellipse
                key={`bp${i}`}
                cx={x}
                cy={y}
                rx="5.5"
                ry="13"
                fill="#FCD34D"
                stroke="#D97706"
                strokeWidth="0.8"
                transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
              />
            )
          })}
          {Array.from({ length: petals }).map((_, i) => {
            const a = ((i + 0.5) / petals) * Math.PI * 2
            const x = 50 + Math.cos(a) * 16
            const y = faceY + Math.sin(a) * 16
            return (
              <ellipse
                key={`fp${i}`}
                cx={x}
                cy={y}
                rx="4"
                ry="10"
                fill="#FDE68A"
                stroke="#D97706"
                strokeWidth="0.6"
                transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
              />
            )
          })}
          <circle cx="50" cy={faceY} r="13.5" fill="#D97706" />
          <circle cx="50" cy={faceY} r="11" fill="#B45309" opacity="0.3" />
          <circle cx="41" cy={faceY + 3} r="2.4" fill="#FCD34D" opacity="0.7" />
          <circle cx="59" cy={faceY + 3} r="2.4" fill="#FCD34D" opacity="0.7" />
          <Eye cx={45} cy={faceY - 1} r={3.4} closed={closed} mood={effectiveMood} irisColor="#78350F" />
          <Eye cx={55} cy={faceY - 1} r={3.4} closed={closed} mood={effectiveMood} irisColor="#78350F" />
          <Mouth cx={50} cy={faceY + 7} mood={effectiveMood} color="#5D3136" r={3.8} />
        </g>
      </g>
    </svg>
  )
}
