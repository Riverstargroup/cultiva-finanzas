import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Gamepad2, Sprout, User, type LucideIcon } from 'lucide-react'
import { useOnboarding } from '../hooks/useOnboarding'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface OnboardingStep {
  icon: LucideIcon
  title: string
  description: string
}

const STEPS: OnboardingStep[] = [
  {
    icon: Sprout,
    title: 'Mi Jardín',
    description:
      '¡Bienvenido a tu jardín financiero! Cada planta representa una habilidad de dinero que vas creciendo.',
  },
  {
    icon: BookOpen,
    title: 'Cursos',
    description:
      'Aprende con escenarios reales. Completa lecciones para regar tus plantas y ganar monedas.',
  },
  {
    icon: Gamepad2,
    title: 'Juegos',
    description:
      'Pon a prueba lo que aprendiste. Clasifica gastos, toma decisiones y gana recompensas.',
  },
  {
    icon: User,
    title: 'Perfil',
    description:
      'Sigue tu progreso, revisa tus logros y usa la calculadora financiera.',
  },
]

export function OnboardingOverlay() {
  const { isOpen, step, total, next, skip } = useOnboarding()
  const reducedMotion = useReducedMotion()

  if (!isOpen) return null

  const current = STEPS[step]
  if (!current) return null

  const Icon = current.icon
  const isLast = step === total - 1

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="organic-card w-full max-w-sm p-8"
      >
        <AnimatePresence mode="wait" initial={reducedMotion ? false : undefined}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <Icon size={40} style={{ color: 'var(--leaf-bright)' }} aria-hidden="true" />
            <h2
              id="onboarding-title"
              className="font-heading text-xl font-bold"
              style={{ color: 'var(--forest-deep)' }}
            >
              {current.title}
            </h2>
            <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full transition-colors"
              style={{
                backgroundColor:
                  i === step ? 'var(--leaf-bright)' : 'var(--clay-soft)',
              }}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={skip}
            className="min-h-[44px] px-3 text-sm"
            style={{ color: 'var(--leaf-muted)' }}
          >
            Saltar
          </button>
          <button type="button" onClick={next} className="vibrant-btn">
            {isLast ? '¡Empezar!' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}
