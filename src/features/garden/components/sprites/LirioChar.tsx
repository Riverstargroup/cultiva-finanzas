import { Eye, Mouth, useBlink, useOscillate, useRatchet } from './primitives'
import type { PlantCharProps, PlantMood } from './primitives'

export function LirioChar({ size = 110, mood = 'idle' }: PlantCharProps): JSX.Element {
  const closed = useBlink(mood !== 'sleeping')
  const breath = 1 + useOscillate(4200, 0.03)
  const sparkPhase = useRatchet(2200)
  const faceY = 46
  const eyeMood: PlantMood = mood === 'idle' ? 'sleeping' : mood
  const mouthMood: PlantMood = mood === 'idle' ? 'idle' : mood

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: 'visible' }}>
      <path d="M 50 124 Q 50 100 50 72" stroke="#2E5D34" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M 50 104 Q 26 90 16 100 Q 28 104 50 108 Z" fill="#78A94B" stroke="#2E5D34" strokeWidth="1" />
      <path d="M 50 96 Q 74 82 84 92 Q 72 96 50 100 Z" fill="#78A94B" stroke="#2E5D34" strokeWidth="1" />
      <g style={{ transformOrigin: `50px ${faceY}px`, transform: `scale(${breath})` }}>
        <path d="M 50 62 Q 22 44 28 20 Q 40 30 50 42 Z" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.1" />
        <path d="M 50 62 Q 78 44 72 20 Q 60 30 50 42 Z" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.1" />
        <path d="M 50 62 Q 34 16 50 12 Q 66 16 50 62 Z" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.1" />
        <path d="M 32 26 Q 42 42 50 50" stroke="#7C3AED" strokeWidth="0.7" fill="none" opacity="0.6" />
        <path d="M 68 26 Q 58 42 50 50" stroke="#7C3AED" strokeWidth="0.7" fill="none" opacity="0.6" />
        <ellipse cx="50" cy={faceY + 8} rx="16.5" ry="10.5" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1" />
        <ellipse cx="50" cy={faceY + 7} rx="13" ry="7" fill="#DDD6FE" />
        {[-4, 0, 4].map((dx) => (
          <circle key={dx} cx={50 + dx} cy={faceY - 2} r="1.3" fill="#FCD34D" />
        ))}
        <Eye cx={44} cy={faceY + 5} r={2.9} closed={closed} mood={eyeMood} irisColor="#5D3136" />
        <Eye cx={56} cy={faceY + 5} r={2.9} closed={closed} mood={eyeMood} irisColor="#5D3136" />
        <path
          d={`M 41.2 ${faceY + 2.2} L 39.5 ${faceY + 0.5}`}
          stroke="#5D3136"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d={`M 58.8 ${faceY + 2.2} L 60.5 ${faceY + 0.5}`}
          stroke="#5D3136"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="40" cy={faceY + 8} r="1.9" fill="#F472B6" opacity="0.45" />
        <circle cx="60" cy={faceY + 8} r="1.9" fill="#F472B6" opacity="0.45" />
        <Mouth cx={50} cy={faceY + 12} mood={mouthMood} color="#5D3136" r={3} />
        <g
          opacity={0.7 * (1 - sparkPhase)}
          transform={`translate(${36 - sparkPhase * 5} ${18 + sparkPhase * 8})`}
          style={{ transformOrigin: '0 0' }}
        >
          <path d="M 0 -4 L 1 0 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 0 Z" fill="#FEFBF6" />
        </g>
      </g>
    </svg>
  )
}
