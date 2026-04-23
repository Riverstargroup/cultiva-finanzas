import { Eye, Mouth, useBlink, useOscillate } from './primitives'
import type { PlantCharProps, PlantMood } from './primitives'

export function TomateChar({ size = 110, mood = 'idle' }: PlantCharProps): JSX.Element {
  const closed = useBlink(mood !== 'sleeping')
  const breath = 1 + useOscillate(3600, 0.03)
  const wobble = useOscillate(2800, 1.5)
  const faceY = 44
  const eyeMood: PlantMood = mood === 'idle' ? 'idle' : mood
  const mouthMood: PlantMood = mood === 'idle' ? 'idle' : mood

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: 'visible' }}>
      <g style={{ transformOrigin: '50px 120px', transform: `rotate(${wobble}deg)` }}>
        <path d="M 50 122 Q 49 108 50 92" stroke="#2E5D34" strokeWidth="3.8" strokeLinecap="round" fill="none" />
        <path d="M 50 76 Q 40 66 34 70 Q 38 78 50 78 Z" fill="#78A94B" stroke="#2E5D34" strokeWidth="0.9" />
        <path d="M 50 76 Q 60 66 66 70 Q 62 78 50 78 Z" fill="#78A94B" stroke="#2E5D34" strokeWidth="0.9" />
        <path
          d="M 50 76 Q 44 64 46 60 Q 50 64 54 60 Q 56 64 50 76 Z"
          fill="#5B7A3A"
          stroke="#2E5D34"
          strokeWidth="0.8"
        />
        <g style={{ transformOrigin: `50px ${faceY}px`, transform: `scale(${breath})` }}>
          <circle cx="50" cy={faceY} r="24" fill="#EF4444" />
          <circle cx="50" cy={faceY} r="22" fill="#F87171" opacity="0.5" />
          <ellipse cx="40" cy={faceY - 10} rx="6" ry="4" fill="#FECACA" opacity="0.6" />
          <path d="M 50 22 Q 47 44 50 68" stroke="#DC2626" strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M 50 22 Q 58 40 62 62" stroke="#DC2626" strokeWidth="0.7" fill="none" opacity="0.4" />
          <path d="M 50 22 Q 42 40 38 62" stroke="#DC2626" strokeWidth="0.7" fill="none" opacity="0.4" />
          <circle cx="39" cy={faceY + 4} r="4.5" fill="#FCA5A5" opacity="0.65" />
          <circle cx="61" cy={faceY + 4} r="4.5" fill="#FCA5A5" opacity="0.65" />
          <Eye cx={44} cy={faceY - 1} r={3} closed={closed} mood={eyeMood} irisColor="#7F1D1D" />
          <Eye cx={56} cy={faceY - 1} r={3} closed={closed} mood={eyeMood} irisColor="#7F1D1D" />
          <path
            d={`M ${44 - 4} ${faceY - 6} L ${44 + 1} ${faceY - 4.5}`}
            stroke="#7F1D1D"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d={`M ${56 + 4} ${faceY - 6} L ${56 - 1} ${faceY - 4.5}`}
            stroke="#7F1D1D"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <Mouth cx={50} cy={faceY + 7} mood={mouthMood} color="#7F1D1D" r={2.8} />
        </g>
      </g>
    </svg>
  )
}
