import { Check, LockKeyhole, Play, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import pathNode from '@/assets/pixel/optimized/ui-path-node.webp'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'
import type { ScenarioStatus } from '@/components/ScenarioCard'

interface CoursePathScenario {
  id: string
  title: string
  prompt: string
}

interface CoursePathMapProps {
  scenarios: readonly CoursePathScenario[]
  getStatus: (index: number) => ScenarioStatus
  getEstimatedXp: (index: number) => number
  onScenarioClick: (scenarioId: string) => void
}

const STATUS_COPY: Record<ScenarioStatus, { label: string; action: string }> = {
  locked: { label: 'Bloqueado', action: 'Completa el nodo anterior' },
  in_progress: { label: 'Siguiente nodo', action: 'Jugar nodo' },
  completed: { label: 'Completado', action: 'Repetir' },
  mastered: { label: 'Dominado', action: 'Repasar dominio' },
}

export function CoursePathMap({
  scenarios,
  getStatus,
  getEstimatedXp,
  onScenarioClick,
}: CoursePathMapProps) {
  return (
    <section
      className="overflow-hidden rounded-lg border"
      style={{
        borderColor: 'color-mix(in srgb, var(--clay-soft) 75%, transparent)',
        background: 'linear-gradient(145deg, rgba(254,251,246,0.96), rgba(232,220,196,0.62))',
        boxShadow: '0 14px 36px rgba(93,49,54,0.1)',
      }}
    >
      <div className="border-b p-4" style={{ borderColor: 'var(--clay-soft)' }}>
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
          Ruta del curso
        </div>
        <h2 className="mt-1 font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          Avanza por semillas, no por lecciones sueltas
        </h2>
      </div>

      <div className="relative p-4 md:p-5">
        <div
          className="absolute left-8 right-8 top-1/2 hidden h-2 rounded-full md:block"
          style={{
            background:
              'linear-gradient(90deg, color-mix(in srgb, var(--leaf-bright) 55%, white), color-mix(in srgb, var(--coin-gold, #E5B84B) 70%, white), rgba(91,122,58,0.24))',
          }}
          aria-hidden="true"
        />

        <div className="relative grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          {scenarios.map((scenario, index) => {
            const status = getStatus(index)
            const copy = STATUS_COPY[status]
            const disabled = status === 'locked'
            const isNext = status === 'in_progress'
            const isDone = status === 'completed' || status === 'mastered'
            const xp = getEstimatedXp(index)

            return (
              <motion.article
                key={scenario.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.2 }}
                className="relative flex min-h-[210px] flex-col justify-between rounded-lg border p-3"
                style={{
                  borderColor: isNext
                    ? 'var(--leaf-bright)'
                    : isDone
                      ? 'color-mix(in srgb, var(--forest-deep) 35%, var(--clay-soft))'
                      : 'var(--clay-soft)',
                  background: disabled ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.78)',
                  boxShadow: isNext ? '0 0 0 3px color-mix(in srgb, var(--leaf-bright) 16%, transparent)' : 'none',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="relative h-14 w-14">
                      <img
                        src={pathNode}
                        alt=""
                        className="h-full w-full"
                        style={{ imageRendering: 'pixelated', opacity: disabled ? 0.45 : 1 }}
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {disabled ? (
                          <LockKeyhole className="h-5 w-5" style={{ color: 'var(--leaf-muted)' }} />
                        ) : isDone ? (
                          <Check className="h-5 w-5" style={{ color: 'var(--forest-deep)' }} />
                        ) : (
                          <Play className="h-5 w-5" style={{ color: 'var(--forest-deep)' }} />
                        )}
                      </div>
                    </div>
                    {isNext && <Sparkles className="h-5 w-5" style={{ color: 'var(--coin-gold, #E5B84B)' }} />}
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isNext ? 'var(--forest-deep)' : 'var(--leaf-muted)' }}>
                      Semilla {index + 1} - {copy.label}
                    </div>
                    <h3 className="mt-1 font-heading text-base font-bold leading-tight" style={{ color: 'var(--forest-deep)' }}>
                      {scenario.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
                      {scenario.prompt.slice(0, 92)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: 'rgba(229,184,75,0.18)', color: '#6B4B12' }}>
                    <img src={coinSprout} alt="" className="h-4 w-4" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
                    {xp} XP al resolver
                  </div>
                </div>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onScenarioClick(scenario.id)}
                  className="mt-3 min-h-[40px] rounded-md px-3 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
                  style={{
                    background: isNext ? 'var(--forest-deep)' : 'color-mix(in srgb, var(--forest-deep) 10%, transparent)',
                    color: isNext ? '#fff' : 'var(--forest-deep)',
                  }}
                >
                  {copy.action}
                </button>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
