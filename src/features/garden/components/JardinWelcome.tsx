import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface JardinWelcomeProps {
  isPending: boolean
  isError: boolean
  onStart: () => void
}

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

const HOW_IT_WORKS = [
  { emoji: '🌿', label: 'Planta = dominio', desc: 'Cada área (ahorro, crédito…) tiene su propia planta' },
  { emoji: '📈', label: 'Maestría = prácticas', desc: 'Completa escenarios para que tu planta crezca' },
  { emoji: '🪙', label: 'Monedas = recompensas', desc: 'Gana monedas por cada logro; úsalas en la tienda' },
  { emoji: '🏡', label: 'Jardín = tu finanzas', desc: 'Mantenlo sano: paga la renta, cuida tus plantas' },
]

export function JardinWelcome({ isPending, isError, onStart }: JardinWelcomeProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="organic-card p-6 md:p-8 space-y-6"
    >
      <motion.div variants={reduced ? undefined : item} className="text-center space-y-2">
        <span className="text-6xl block" role="img" aria-label="Planta">🌱</span>
        <h2 className="font-heading text-xl font-bold md:text-2xl" style={{ color: 'var(--forest-deep)' }}>
          ¡Bienvenido a tu jardín financiero!
        </h2>
        <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-warm)' }}>
          Tu jardín es el reflejo de tus finanzas: cuídalo y florecerá.
        </p>
      </motion.div>

      <motion.ul variants={reduced ? undefined : item} className="space-y-3">
        {HOW_IT_WORKS.map(({ emoji, label, desc }) => (
          <li key={label} className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">{emoji}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--forest-deep)' }}>{label}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-warm)' }}>{desc}</p>
            </div>
          </li>
        ))}
      </motion.ul>

      <motion.div variants={reduced ? undefined : item} className="flex justify-center">
        <button
          onClick={onStart}
          disabled={isPending}
          className="vibrant-btn min-h-[48px] px-8 font-bold text-base disabled:opacity-60"
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Plantando semillas...</>
          ) : (
            <>🌱 Plantar mis semillas</>
          )}
        </button>
      </motion.div>

      {isError && (
        <motion.p variants={reduced ? undefined : item} className="text-xs text-center" style={{ color: 'var(--terracotta-vivid)' }}>
          🌧️ Algo salió mal. Por favor intenta de nuevo.
        </motion.p>
      )}
    </motion.div>
  )
}
