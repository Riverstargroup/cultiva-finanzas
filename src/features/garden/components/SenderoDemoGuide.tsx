import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookOpen, Check, Gamepad2, RotateCcw, Sparkles, Sprout, Trophy, type LucideIcon } from 'lucide-react'
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'

type DemoStepId = 'prologue' | 'lesson' | 'game' | 'review' | 'reward' | 'boss'

interface DemoStep {
  id: DemoStepId
  title: string
  description: string
  cta: string
  icon: LucideIcon
  onAction: () => void
}

interface SenderoDemoGuideProps {
  onOpenFirstLesson: () => void
  onOpenGame: () => void
  onOpenReview: () => void
}

const GUIDE_STORAGE_KEY = 'cf.demo.guidedRoute.completed'
const ONBOARDING_STORAGE_KEY = 'cf.onboarding.v3'
const CHEST_STORAGE_KEY = 'cf.demo.claimedSenderoNodes'

export function SenderoDemoGuide({
  onOpenFirstLesson,
  onOpenGame,
  onOpenReview,
}: SenderoDemoGuideProps) {
  const [completed, setCompleted] = useState<DemoStepId[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(GUIDE_STORAGE_KEY)
      setCompleted(raw ? JSON.parse(raw) as DemoStepId[] : [])
    } catch {
      setCompleted([])
    }
  }, [])

  const markDone = useCallback((stepId: DemoStepId) => {
    setCompleted((current) => {
      const next = Array.from(new Set([...current, stepId]))
      try {
        window.localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore storage errors
      }
      return next
    })
  }, [])

  const resetDemo = useCallback(() => {
    setCompleted([])
    try {
      window.localStorage.removeItem(GUIDE_STORAGE_KEY)
      window.localStorage.removeItem(CHEST_STORAGE_KEY)
    } catch {
      // ignore storage errors
    }
  }, [])

  const replayPrologue = useCallback(() => {
    markDone('prologue')
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY)
      window.location.reload()
    } catch {
      // ignore storage errors
    }
  }, [markDone])

  const steps = useMemo<DemoStep[]>(
    () => [
      {
        id: 'prologue',
        title: 'Ver prologo',
        description: 'Nopalito presenta el mundo y el problema del Gasto Hormiga.',
        cta: 'Reproducir',
        icon: Sprout,
        onAction: replayPrologue,
      },
      {
        id: 'lesson',
        title: 'Tomar primera semilla',
        description: 'Abre la primera leccion para probar el flujo educativo base.',
        cta: 'Ir a leccion',
        icon: BookOpen,
        onAction: () => {
          markDone('lesson')
          onOpenFirstLesson()
        },
      },
      {
        id: 'game',
        title: 'Entrenar con juego',
        description: 'Juega un reto corto para mostrar aprendizaje activo.',
        cta: 'Abrir juego',
        icon: Gamepad2,
        onAction: () => {
          markDone('game')
          onOpenGame()
        },
      },
      {
        id: 'review',
        title: 'Repasar memoria',
        description: 'Entra al Vivero de Memoria para reforzar conceptos.',
        cta: 'Repasar',
        icon: RotateCcw,
        onAction: () => {
          markDone('review')
          onOpenReview()
        },
      },
      {
        id: 'reward',
        title: 'Reclamar cofre',
        description: 'Toca el cofre del mapa y reclama la recompensa demo.',
        cta: 'Marcar visto',
        icon: Sparkles,
        onAction: () => markDone('reward'),
      },
      {
        id: 'boss',
        title: 'Enfrentar jefe',
        description: 'Toca Gasto Hormiga para explicar como se debilita con aprendizaje.',
        cta: 'Marcar visto',
        icon: Trophy,
        onAction: () => markDone('boss'),
      },
    ],
    [markDone, onOpenFirstLesson, onOpenGame, onOpenReview, replayPrologue],
  )

  const completedCount = completed.length
  const progress = Math.round((completedCount / steps.length) * 100)

  return (
    <section className="demo-guide-panel" aria-label="Ruta guiada para demo">
      <div className="flex items-start gap-3">
        <div className="demo-guide-companion">
          <img src={nopalitoIdle} alt="" className="sprite-clean" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="demo-guide-kicker">Demo de 5 minutos</p>
          <h2 className="font-heading text-xl font-black leading-tight" style={{ color: 'var(--forest-deep)' }}>
            Prueba el ciclo completo del Sendero.
          </h2>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            Usa esta guia para validar si el usuario entiende: historia, leccion, juego, repaso, recompensa y jefe.
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8D2A9]" aria-label={`${progress}% del demo completado`}>
        <div className="h-full rounded-full bg-gradient-to-r from-[#78A94B] to-[#E5B84B]" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 grid gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon
          const done = completed.includes(step.id)

          return (
            <div key={step.id} className="demo-guide-step" data-complete={done}>
              <div className="demo-guide-step-token">
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: 'var(--leaf-muted)' }}>
                    Paso {index + 1}
                  </span>
                  {done && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase" style={{ background: 'rgba(120,169,75,0.14)', color: 'var(--forest-deep)' }}>
                      listo
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-black" style={{ color: 'var(--forest-deep)' }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
                  {step.description}
                </p>
              </div>
              <button type="button" onClick={step.onAction} className="demo-guide-action">
                {step.cta}
              </button>
            </div>
          )
        })}
      </div>

      <button type="button" onClick={resetDemo} className="demo-guide-reset">
        Reiniciar checklist demo
      </button>
    </section>
  )
}
