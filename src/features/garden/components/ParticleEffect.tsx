import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ParticleConfig } from '../types'

export interface ParticleEffectProps {
  config: ParticleConfig
  active: boolean
  onComplete?: () => void
}

interface ParticleInstance {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  color: string
  size: number
  rotateFrom: number
  rotateTo: number
  delay: number
  duration: number
}

const BOUNDS = { w: 120, h: 120 }

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function spawnBatch(config: ParticleConfig, genOffset: number): ParticleInstance[] {
  const { w, h } = BOUNDS
  const dur = (config.lifespan ?? config.duration ?? 1000) / 1000

  return Array.from({ length: config.count }, (_, i) => {
    let ox = w / 2
    let oy = h / 2
    const origin = config.origin
    if (typeof origin === 'object' && 'x' in origin) {
      ox = origin.x
      oy = origin.y
    } else if (origin === 'top-center') {
      oy = 0
    } else if (origin === 'bottom-center') {
      oy = h
    } else if (origin === 'random-within-bounds') {
      ox = rand(0, w)
      oy = rand(0, h)
    }

    if (config.spawnJitter) {
      ox += rand(-config.spawnJitter.x, config.spawnJitter.x)
      oy += rand(-config.spawnJitter.y, config.spawnJitter.y)
    }

    const speed = rand(config.velocity.min, config.velocity.max)
    const angleDeg =
      typeof config.velocity.angleDeg === 'number'
        ? config.velocity.angleDeg
        : rand(config.velocity.angleDeg.min, config.velocity.angleDeg.max)
    const rad = (angleDeg * Math.PI) / 180
    const vx = Math.cos(rad) * speed
    const vy = Math.sin(rad) * speed
    const g = config.gravity ?? 0

    const tx = ox + vx * dur
    const ty = oy + vy * dur + 0.5 * g * dur * dur

    const rotateFrom = config.rotation?.from ?? 0
    const rotateTo = config.rotation
      ? config.rotation.randomDir && Math.random() > 0.5
        ? -config.rotation.to
        : config.rotation.to
      : 0

    return {
      id: genOffset * 1000 + i,
      x: ox,
      y: oy,
      tx,
      ty,
      color: config.color[Math.floor(Math.random() * config.color.length)],
      size: rand(config.size.min, config.size.max),
      rotateFrom,
      rotateTo,
      delay: ((config.stagger ?? 0) * i) / 1000,
      duration: dur,
    }
  })
}

function ParticleShape({
  shape,
  size,
  color,
}: {
  shape: ParticleConfig['shape']
  size: number
  color: string
}) {
  const s = size
  if (shape === 'circle') {
    return <circle cx={s / 2} cy={s / 2} r={s / 2} fill={color} />
  }
  if (shape === 'star4') {
    const half = s / 2
    const pts = Array.from({ length: 8 }, (_, i) => {
      const r = i % 2 === 0 ? half : half * 0.4
      const a = (i * Math.PI) / 4 - Math.PI / 2
      return `${half + r * Math.cos(a)},${half + r * Math.sin(a)}`
    }).join(' ')
    return <polygon points={pts} fill={color} />
  }
  if (shape === 'droplet') {
    return (
      <path
        d={`M${s / 2} ${s} Q${s} ${s * 0.5} ${s / 2} ${s * 0.1} Q0 ${s * 0.5} ${s / 2} ${s}`}
        fill={color}
      />
    )
  }
  // ribbon
  return <rect x={s * 0.1} y={0} width={s * 0.8} height={s} rx={s * 0.1} fill={color} />
}

export function ParticleEffect({ config, active, onComplete }: ParticleEffectProps) {
  const shouldReduceMotion = useReducedMotion()
  const [particles, setParticles] = useState<ParticleInstance[]>([])
  const genRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | ReturnType<typeof setTimeout> | null>(null)

  const spawn = useCallback(() => {
    setParticles(spawnBatch(config, genRef.current++))
  }, [config])

  useEffect(() => {
    if (!active) {
      setParticles([])
      if (timerRef.current != null) clearInterval(timerRef.current)
      return
    }

    spawn()

    if (config.continuous && config.spawnInterval) {
      timerRef.current = setInterval(spawn, config.spawnInterval)
    } else {
      const totalDur = (config.duration ?? 1000) + (config.stagger ?? 0) * config.count + 200
      timerRef.current = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, totalDur)
    }

    return () => {
      if (timerRef.current != null) {
        if (config.continuous) clearInterval(timerRef.current)
        else clearTimeout(timerRef.current)
      }
    }
  }, [active, config, spawn, onComplete])

  if (shouldReduceMotion) return null

  const opacityKF =
    config.opacity.curve === 'bell'
      ? [config.opacity.from, config.opacity.peak ?? 0.8, config.opacity.to]
      : config.opacity.fadeStart != null
        ? [config.opacity.from, config.opacity.from, config.opacity.to]
        : [config.opacity.from, config.opacity.to]

  const opacityTimes =
    config.opacity.curve === 'bell'
      ? [0, 0.5, 1]
      : config.opacity.fadeStart != null
        ? [0, config.opacity.fadeStart, 1]
        : [0, 1]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              filter: config.blur ? `blur(${config.blur}px)` : undefined,
            }}
            initial={{ x: 0, y: 0, rotate: p.rotateFrom, opacity: config.opacity.from }}
            animate={{
              x: p.tx - p.x,
              y: p.ty - p.y,
              rotate: p.rotateTo,
              opacity: opacityKF,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'linear',
              opacity: { times: opacityTimes, ease: 'linear', duration: p.duration, delay: p.delay },
            }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <svg
              width={p.size}
              height={p.size}
              viewBox={`0 0 ${p.size} ${p.size}`}
              overflow="visible"
            >
              <ParticleShape shape={config.shape} size={p.size} color={p.color} />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
