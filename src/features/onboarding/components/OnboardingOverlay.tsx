import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Gamepad2, Home, ShieldAlert, Sprout, type LucideIcon } from 'lucide-react'
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'
import nopalitoCelebrating from '@/assets/pixel/optimized/plantamigo-nopalito-celebrating.webp'
import gastoHormigaIdle from '@/assets/pixel/optimized/enemy-gasto-hormiga-idle.webp'
import greenhousePoi from '@/assets/pixel/optimized/poi-course-greenhouse.webp'
import gardenHomePoi from '@/assets/pixel/optimized/poi-garden-home.webp'
import onboardingGardenEntrance from '@/assets/world/onboarding-garden-entrance.webp'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useOnboarding } from '../hooks/useOnboarding'

interface OnboardingStep {
  icon: LucideIcon
  title: string
  speaker: string
  dialogue: string
  image: string
  imageAlt: string
}

const STEPS: OnboardingStep[] = [
  {
    icon: ShieldAlert,
    title: 'Algo se mueve entre las hojas',
    speaker: 'Nopalito',
    dialogue:
      'Shh... llegaste justo cuando el Gasto Hormiga encontro la entrada. Se alimenta de compras chiquitas que nadie nota.',
    image: gastoHormigaIdle,
    imageAlt: 'Gasto Hormiga',
  },
  {
    icon: Sprout,
    title: 'Un brote salta al camino',
    speaker: 'Nopalito',
    dialogue:
      'Soy Nopalito. Puedo ayudarte a detectar fugas de dinero, pero necesito que completes tu primera semilla.',
    image: nopalitoIdle,
    imageAlt: 'Nopalito',
  },
  {
    icon: BookOpen,
    title: 'La ruta empieza en el invernadero',
    speaker: 'Nopalito',
    dialogue:
      'Ahi no vienes a leer por leer. Cada nodo te pone una decision real y hace crecer este mundo.',
    image: greenhousePoi,
    imageAlt: 'Invernadero de cursos',
  },
  {
    icon: Gamepad2,
    title: 'Cada accion golpea al enemigo',
    speaker: 'Nopalito',
    dialogue:
      'Cursos, repasos, rachas y juegos bajan su poder. Si dudas, preguntame. Yo te guio por el jardin.',
    image: nopalitoCelebrating,
    imageAlt: 'Nopalito celebrando',
  },
  {
    icon: Home,
    title: 'Hay que llegar a la casita',
    speaker: 'Nopalito',
    dialogue:
      'Alla viven tus plantamigos. Vamos juntos: toma la primera semilla y recuperemos el camino.',
    image: gardenHomePoi,
    imageAlt: 'Casita del jardin',
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-2xl overflow-hidden rounded-lg border"
        style={{
          borderColor: 'color-mix(in srgb, var(--leaf-bright) 36%, var(--clay-soft))',
          background: 'linear-gradient(145deg, #FEFBF6, rgba(232,220,196,0.94))',
          boxShadow: '0 24px 80px rgba(27,59,38,0.34)',
        }}
      >
        <AnimatePresence mode="wait" initial={reducedMotion ? false : undefined}>
          <motion.div
            key={step}
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]"
          >
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden p-6">
              <img
                src={onboardingGardenEntrance}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FEFBF6]/36 via-transparent to-[#FEFBF6]/10" aria-hidden="true" />
              <img
                src={current.image}
                alt={current.imageAlt}
                className="relative max-h-56 w-full object-contain drop-shadow-[0_12px_22px_rgba(43,79,53,0.24)]"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <div className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
                  <Icon className="h-4 w-4" />
                  Prologo
                </div>
                <h2
                  id="onboarding-title"
                  className="mt-2 font-heading text-2xl font-bold"
                  style={{ color: 'var(--forest-deep)' }}
                >
                  {current.title}
                </h2>

                <div
                  className="mt-5 rounded-lg border p-4"
                  style={{
                    borderColor: 'var(--clay-soft)',
                    background: 'rgba(255,255,255,0.62)',
                  }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
                    {current.speaker}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--forest-deep)' }}>
                    {current.dialogue}
                  </p>
                </div>
              </div>

              <div>
                <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full transition-colors"
                      style={{
                        backgroundColor: i === step ? 'var(--leaf-bright)' : 'var(--clay-soft)',
                      }}
                    />
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={skip}
                    className="min-h-[44px] px-3 text-sm"
                    style={{ color: 'var(--leaf-muted)' }}
                  >
                    Saltar
                  </button>
                  <button type="button" onClick={next} className="vibrant-btn">
                    {isLast ? 'Tomar la primera semilla' : 'Continuar'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
