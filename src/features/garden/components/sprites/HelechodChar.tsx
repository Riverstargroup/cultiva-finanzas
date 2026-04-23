import { Eye, Mouth, useBlink, useOscillate } from './primitives'
import type { PlantCharProps, PlantMood } from './primitives'

interface FrondProps {
  dx: number
  dy: number
  rot: number
  scale?: number
  dark?: boolean
  rustle: number
}

function Frond({ dx, dy, rot, scale = 1, dark = false, rustle }: FrondProps): JSX.Element {
  const fill = dark ? '#059669' : '#34D399'
  const stroke = dark ? '#047857' : '#059669'
  const r = rot + rustle * (dx < 0 ? -1 : 1)
  return (
    <g transform={`translate(${50 + dx} ${75 + dy}) rotate(${r}) scale(${scale})`}>
      <path d="M 0 0 Q -1 -14 0 -30" stroke={stroke} strokeWidth="1.5" fill="none" />
      {Array.from({ length: 5 }).map((_, i) => {
        const t = (i + 1) / 5
        const lx = 7 * (1 - t * 0.3)
        const ly = -t * 30
        return (
          <g key={i}>
            <ellipse
              cx={-lx}
              cy={ly + 2}
              rx="4.5"
              ry="2.2"
              fill={fill}
              stroke={stroke}
              strokeWidth="0.5"
              transform={`rotate(-28 ${-lx} ${ly + 2})`}
            />
            <ellipse
              cx={lx}
              cy={ly - 1}
              rx="4.5"
              ry="2.2"
              fill={fill}
              stroke={stroke}
              strokeWidth="0.5"
              transform={`rotate(28 ${lx} ${ly - 1})`}
            />
          </g>
        )
      })}
      <ellipse cx="0" cy="-32" rx="2" ry="3.5" fill={fill} stroke={stroke} strokeWidth="0.5" />
    </g>
  )
}

export function HelechodChar({ size = 110, mood = 'idle' }: PlantCharProps): JSX.Element {
  const closed = useBlink(mood !== 'sleeping')
  const breath = 1 + useOscillate(3800, 0.025)
  const rustle = useOscillate(2400, 2)
  const faceY = 50
  const eyeMood: PlantMood = mood === 'idle' ? 'worried' : mood
  const mouthMood: PlantMood = mood === 'idle' ? 'idle' : mood

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: 'visible' }}>
      <Frond dx={-18} dy={0} rot={-55} scale={1.1} dark rustle={rustle} />
      <Frond dx={18} dy={0} rot={55} scale={1.1} dark rustle={rustle} />
      <Frond dx={-8} dy={-4} rot={-30} rustle={rustle} />
      <Frond dx={8} dy={-4} rot={30} rustle={rustle} />
      <g style={{ transformOrigin: `50px 75px`, transform: `scale(${breath})` }}>
        <path d="M 50 124 Q 49 105 50 85" stroke="#1B3B26" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {Array.from({ length: 3 }).map((_, i) => {
          const ly = 80 - i * 8
          return (
            <g key={i}>
              <ellipse
                cx="42"
                cy={ly}
                rx="5.5"
                ry="2.8"
                fill="#34D399"
                stroke="#059669"
                strokeWidth="0.6"
                transform={`rotate(-22 42 ${ly})`}
              />
              <ellipse
                cx="58"
                cy={ly}
                rx="5.5"
                ry="2.8"
                fill="#34D399"
                stroke="#059669"
                strokeWidth="0.6"
                transform={`rotate(22 58 ${ly})`}
              />
            </g>
          )
        })}
        <ellipse cx="50" cy={faceY} rx="15.5" ry="14.5" fill="#34D399" stroke="#059669" strokeWidth="1.3" />
        <ellipse cx="46" cy={faceY - 3} rx="5" ry="4" fill="#6EE7B7" opacity="0.65" />
        <path d="M 50 36 Q 48 30 50 27" stroke="#059669" strokeWidth="1.5" fill="none" />
        <ellipse cx="50" cy="26" rx="2.2" ry="3.2" fill="#34D399" stroke="#059669" strokeWidth="0.7" />
        <circle cx="55.5" cy={faceY + 0.5} r="6" fill="none" stroke="#1B3B26" strokeWidth="0.7" opacity="0.45" />
        <line x1="55.5" y1={faceY + 6} x2="56.5" y2={faceY + 10} stroke="#1B3B26" strokeWidth="0.6" opacity="0.45" />
        <Eye cx={44.5} cy={faceY} r={3.5} closed={closed} mood={eyeMood} irisColor="#047857" />
        <Eye cx={55.5} cy={faceY} r={3.5} closed={closed} mood={eyeMood} irisColor="#047857" />
        <Mouth cx={50} cy={faceY + 7} mood={mouthMood} color="#1B3B26" r={3.2} />
      </g>
    </svg>
  )
}
