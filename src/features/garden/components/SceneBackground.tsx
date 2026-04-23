import { useEffect, useState } from 'react'
import type { TimeOfDay, Weather } from './sceneHelpers'
import { darken } from './sceneHelpers'

interface BackgroundProps {
  timeOfDay: TimeOfDay
  weather: Weather
  grassA: string
  groundA: string
  groundB: string
}

function SunMoon({ timeOfDay }: { timeOfDay: TimeOfDay }): JSX.Element {
  const isNight = timeOfDay === 'night'
  const isDusk = timeOfDay === 'dusk'
  const bg = isNight
    ? 'radial-gradient(circle at 35% 35%, #FEFBF6, #D8BFC0)'
    : isDusk
      ? 'radial-gradient(circle at 40% 40%, #F9ECDF, #D97706)'
      : 'radial-gradient(circle at 40% 40%, #FEF9C3, #FCD34D)'
  const shadow = isNight ? '0 0 36px rgba(254,251,246,0.5)' : '0 0 50px rgba(252,211,77,0.55)'
  return (
    <div
      style={{
        position: 'absolute',
        top: '8%',
        right: isNight ? '11%' : '13%',
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: bg,
        boxShadow: shadow,
        opacity: 0.92,
      }}
    />
  )
}

function Clouds({ phase }: { phase: number }): JSX.Element {
  const clouds = [
    { x: 18 + phase * 0.28, y: 10, s: 0.9, o: 0.7 },
    { x: 55 + phase * 0.45, y: 16, s: 0.62, o: 0.5 },
    { x: 80 + phase * 0.35, y: 5, s: 0.78, o: 0.62 },
  ]
  return (
    <>
      {clouds.map((c, i) => (
        <svg
          key={i}
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: 90 * c.s,
            opacity: c.o,
            pointerEvents: 'none',
          }}
          viewBox="0 0 90 40"
        >
          <ellipse cx="20" cy="26" rx="16" ry="12" fill="#FEFBF6" />
          <ellipse cx="38" cy="19" rx="20" ry="14" fill="#FEFBF6" />
          <ellipse cx="58" cy="23" rx="18" ry="12" fill="#FEFBF6" />
          <ellipse cx="72" cy="27" rx="13" ry="10" fill="#FEFBF6" />
        </svg>
      ))}
    </>
  )
}

function Stars(): JSX.Element {
  const stars = [
    { x: 12, y: 8 },
    { x: 28, y: 5 },
    { x: 45, y: 12 },
    { x: 62, y: 6 },
    { x: 78, y: 11 },
    { x: 88, y: 4 },
  ]
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: 2.5,
            height: 2.5,
            borderRadius: '50%',
            background: '#FEFBF6',
            opacity: 0.85,
            boxShadow: '0 0 4px rgba(255,255,255,0.7)',
          }}
        />
      ))}
    </>
  )
}

function Mountains({ timeOfDay }: { timeOfDay: TimeOfDay }): JSX.Element {
  const isNight = timeOfDay === 'night'
  return (
    <svg
      style={{
        position: 'absolute',
        bottom: '32%',
        left: 0,
        width: '100%',
        height: '18%',
        pointerEvents: 'none',
      }}
      viewBox="0 0 400 72"
      preserveAspectRatio="none"
    >
      <path
        d="M 0 72 L 55 36 L 105 52 L 165 22 L 225 48 L 295 28 L 355 52 L 400 38 L 400 72 Z"
        fill={isNight ? '#28181A' : '#A2825E'}
        opacity="0.45"
      />
      <path
        d="M 0 72 L 35 52 L 95 62 L 155 42 L 215 58 L 275 48 L 335 64 L 400 52 L 400 72 Z"
        fill={isNight ? '#381E22' : '#7C5E3E'}
        opacity="0.65"
      />
    </svg>
  )
}

function LawnTiles({ grassA, groundB }: { grassA: string; groundB: string }): JSX.Element {
  return (
    <div style={{ position: 'absolute', left: '4%', right: '4%', bottom: '7%', top: '46%' }}>
      {[0, 1].map((row) => (
        <div
          key={row}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${row * 52}%`,
            height: '46%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
          }}
        >
          {[0, 1].map((col) => {
            const alt = (row + col) % 2 === 0
            const bg = alt
              ? `repeating-linear-gradient(90deg, ${grassA} 0px, ${grassA} 16px, ${darken(grassA, 8)} 16px, ${darken(grassA, 8)} 32px)`
              : `repeating-linear-gradient(90deg, ${darken(grassA, 5)} 0px, ${darken(grassA, 5)} 16px, ${darken(grassA, 12)} 16px, ${darken(grassA, 12)} 32px)`
            return (
              <div
                key={col}
                style={{
                  background: bg,
                  borderRadius: 4,
                  boxShadow: 'inset 0 0 0 1px rgba(93,49,54,0.08), inset 0 3px 8px rgba(0,0,0,0.06)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '10%',
                    transform: 'translateX(-50%)',
                    width: '45%',
                    height: 12,
                    borderRadius: '50%',
                    background: `radial-gradient(ellipse, ${groundB} 0%, transparent 70%)`,
                    filter: 'blur(1.5px)',
                  }}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Fence({ timeOfDay }: { timeOfDay: TimeOfDay }): JSX.Element {
  const fill = timeOfDay === 'night' ? '#D8BFC0' : '#FEFBF6'
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '44%',
        width: '100%',
        height: '5%',
        pointerEvents: 'none',
      }}
      viewBox="0 0 400 28"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 28 }).map((_, i) => {
        const x = i * 15
        return (
          <g key={i}>
            <rect x={x} y={5} width={7} height={22} fill={fill} stroke="#5D3136" strokeWidth="0.7" />
            <polygon points={`${x},5 ${x + 3.5},0 ${x + 7},5`} fill={fill} stroke="#5D3136" strokeWidth="0.7" />
          </g>
        )
      })}
      <line x1="0" y1="11" x2="400" y2="11" stroke="#5D3136" strokeWidth="0.5" opacity="0.45" />
      <line x1="0" y1="20" x2="400" y2="20" stroke="#5D3136" strokeWidth="0.5" opacity="0.45" />
    </svg>
  )
}

export function SceneBackground({ timeOfDay, weather, grassA, groundA, groundB }: BackgroundProps): JSX.Element {
  const [cloudPhase, setCloudPhase] = useState(0)

  useEffect(() => {
    let raf = 0
    let s: number | null = null
    const tick = (t: number): void => {
      if (s === null) s = t
      setCloudPhase(((t - s) / 220) % 100)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const isDayish = timeOfDay === 'day' || timeOfDay === 'dawn'

  return (
    <>
      <SunMoon timeOfDay={timeOfDay} />
      {isDayish && <Clouds phase={cloudPhase} />}
      {timeOfDay === 'night' && <Stars />}
      <Mountains timeOfDay={timeOfDay} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '56%',
          background: `linear-gradient(180deg, ${groundA} 0%, ${groundB} 100%)`,
        }}
      />
      <LawnTiles grassA={grassA} groundB={groundB} />
      <Fence timeOfDay={timeOfDay} />
      {isDayish && weather !== 'rain' && <Butterfly />}
    </>
  )
}

function Butterfly(): JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        top: '28%',
        animation: 'flyAcross 16s linear infinite',
        pointerEvents: 'none',
      }}
    >
      <div style={{ animation: 'flutter 0.5s ease-in-out infinite' }}>
        <svg width="14" height="11" viewBox="0 0 20 14">
          <ellipse cx="5" cy="7" rx="4.5" ry="6" fill="#A78BFA" stroke="#7C3AED" strokeWidth="0.5" />
          <ellipse cx="15" cy="7" rx="4.5" ry="6" fill="#A78BFA" stroke="#7C3AED" strokeWidth="0.5" />
          <ellipse cx="5" cy="7" rx="1.5" ry="2" fill="#FCD34D" />
          <ellipse cx="15" cy="7" rx="1.5" ry="2" fill="#FCD34D" />
          <rect x="9.5" y="4" width="1" height="6" fill="#1B3B26" rx="0.5" />
        </svg>
      </div>
    </div>
  )
}
