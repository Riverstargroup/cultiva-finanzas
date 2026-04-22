import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const DOMAINS = ['control', 'credito', 'proteccion', 'crecimiento'] as const
const DOMAIN_COLORS: Record<string, string> = {
  control: '#90be6d',
  credito: '#f9c74f',
  proteccion: '#f8961e',
  crecimiento: '#43aa8b',
}
const DOMAIN_LABELS: Record<string, string> = {
  control: 'Control',
  credito: 'Crédito',
  proteccion: 'Protección',
  crecimiento: 'Crecimiento',
}

// Arc positions for 4 flowers (semi-circle)
const FLOWER_POSITIONS = [
  { x: 10, y: 70 },
  { x: 35, y: 20 },
  { x: 65, y: 20 },
  { x: 90, y: 70 },
]

interface BeeProgressProps {
  currentDomain: string | null
}

export function BeeProgress({ currentDomain }: BeeProgressProps) {
  const reduced = useReducedMotion()

  const activeDomainIndex = currentDomain ? DOMAINS.indexOf(currentDomain as any) : -1
  const beePos = activeDomainIndex >= 0 ? FLOWER_POSITIONS[activeDomainIndex] : { x: 50, y: 50 }

  return (
    <div className="w-full max-w-xs mx-auto" aria-hidden="true">
      <svg viewBox="0 0 100 90" className="w-full h-auto">
        {/* Arc path guide (decorative) */}
        <path
          d="M 10 70 Q 35 10 50 15 Q 65 10 90 70"
          fill="none"
          stroke="var(--clay-soft)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Flowers */}
        {DOMAINS.map((domain, i) => {
          const pos = FLOWER_POSITIONS[i]
          const isActive = domain === currentDomain
          const color = DOMAIN_COLORS[domain]

          return (
            <g key={domain} transform={`translate(${pos.x}, ${pos.y})`}>
              {/* Petals */}
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <motion.ellipse
                  key={angle}
                  cx={Math.cos((angle * Math.PI) / 180) * 5}
                  cy={Math.sin((angle * Math.PI) / 180) * 5}
                  rx={3}
                  ry={2}
                  fill={color}
                  opacity={isActive ? 1 : 0.35}
                  animate={reduced ? undefined : { opacity: isActive ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
              {/* Center */}
              <circle r={3} fill={isActive ? color : '#d4c9b8'} />
              {/* Label */}
              <text
                y={14}
                textAnchor="middle"
                fontSize="4"
                fill="var(--leaf-muted)"
                fontFamily="sans-serif"
              >
                {DOMAIN_LABELS[domain]}
              </text>
            </g>
          )
        })}

        {/* Bee */}
        {reduced ? null : (
          <motion.text
            x={beePos.x}
            y={beePos.y - 12}
            textAnchor="middle"
            fontSize="10"
            animate={{ x: beePos.x, y: beePos.y - 12 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            🐝
          </motion.text>
        )}
      </svg>
    </div>
  )
}
