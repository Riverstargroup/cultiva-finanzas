import { useState } from 'react'
import { GripVertical, CheckCircle2, Circle } from 'lucide-react'
import { DragDropExercise } from '@/features/dragdrop/components/DragDropExercise'
import { EXERCISES } from '@/features/dragdrop/data/exercises'
import { DOMAIN_LABELS } from '@/features/garden/types'
import { RewardToast, RewardToastContainer } from '@/components/RewardToast'
import type { DragDropExercise as DragDropExerciseType } from '@/features/dragdrop/types'

const DOMAIN_EMOJI: Record<string, string> = {
  control: '🌼',
  credito: '🌺',
  proteccion: '🌿',
  crecimiento: '🌻',
}

export default function Ejercicios() {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null)
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())
  const [showReward, setShowReward] = useState(false)

  const activeExercise = activeExerciseId
    ? EXERCISES.find((ex) => ex.id === activeExerciseId) ?? null
    : null

  const activeIndex = activeExercise
    ? EXERCISES.findIndex((ex) => ex.id === activeExerciseId)
    : -1

  const handleNext = (wasCorrect?: boolean) => {
    if (activeExerciseId) {
      setCompletedToday((prev) => new Set([...prev, activeExerciseId]))
      if (wasCorrect) setShowReward(true)
    }
    const nextIndex = activeIndex + 1
    if (nextIndex < EXERCISES.length) {
      setActiveExerciseId(EXERCISES[nextIndex].id)
    } else {
      setActiveExerciseId(null)
    }
  }

  const handleCardClick = (exercise: DragDropExerciseType) => {
    setActiveExerciseId(exercise.id)
  }

  if (activeExercise) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveExerciseId(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '1rem',
              color: 'var(--leaf-muted)',
            }}
            aria-label="Volver a la lista"
          >
            ← Volver
          </button>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--leaf-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {DOMAIN_EMOJI[activeExercise.domain]}{' '}
            {DOMAIN_LABELS[activeExercise.domain]}
          </span>
        </div>

        {/* Progress indicator */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '20px',
          }}
        >
          {EXERCISES.map((ex, idx) => (
            <div
              key={ex.id}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '4px',
                background:
                  completedToday.has(ex.id)
                    ? 'var(--leaf-bright, #4CAF50)'
                    : ex.id === activeExerciseId
                    ? 'var(--leaf-muted, #5B7A3A)'
                    : 'var(--clay-soft, #d4c5b0)',
                transition: 'background 0.3s',
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Exercise card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid var(--clay-soft, #d4c5b0)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <DragDropExercise exercise={activeExercise} onNext={handleNext} />
        </div>

        <RewardToastContainer>
          {showReward && (
            <RewardToast
              key="dragdrop-reward"
              coins={15}
              onDismiss={() => setShowReward(false)}
            />
          )}
        </RewardToastContainer>
      </div>
    )
  }

  // Exercise list view
  const exercisesByDomain = EXERCISES.reduce<Record<string, DragDropExerciseType[]>>(
    (acc, ex) => {
      const key = ex.domain
      const existing = acc[key] ?? []
      return { ...acc, [key]: [...existing, ex] }
    },
    {}
  )

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4px 0' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <GripVertical
          size={28}
          style={{ color: 'var(--leaf-bright, #4CAF50)', flexShrink: 0 }}
        />
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--leaf-dark, #1B3B26)',
              margin: 0,
            }}
          >
            Ejercicios
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--leaf-muted, #5B7A3A)',
              margin: 0,
              marginTop: '2px',
            }}
          >
            Practica arrastrando conceptos financieros al lugar correcto
          </p>
        </div>
      </div>

      {/* Domain sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
        {Object.entries(exercisesByDomain).map(([domain, exercises]) => (
          <section key={domain}>
            <h2
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--leaf-muted, #5B7A3A)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginBottom: '10px',
              }}
            >
              {DOMAIN_EMOJI[domain]} {DOMAIN_LABELS[domain as keyof typeof DOMAIN_LABELS]}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {exercises.map((exercise) => {
                const isDone = completedToday.has(exercise.id)
                return (
                  <button
                    key={exercise.id}
                    onClick={() => handleCardClick(exercise)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      background: isDone
                        ? 'rgba(34,197,94,0.06)'
                        : 'rgba(255,255,255,0.85)',
                      borderRadius: '16px',
                      border: `1.5px solid ${isDone ? '#86efac' : 'var(--clay-soft, #d4c5b0)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDone) {
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                          'var(--leaf-bright, #4CAF50)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                          '0 4px 16px rgba(76,175,80,0.12)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDone) {
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                          'var(--clay-soft, #d4c5b0)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                          '0 2px 8px rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2
                        size={22}
                        style={{ color: '#22c55e', flexShrink: 0 }}
                      />
                    ) : (
                      <Circle
                        size={22}
                        style={{ color: 'var(--clay-soft, #d4c5b0)', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'var(--leaf-dark, #1B3B26)',
                          marginBottom: '2px',
                        }}
                      >
                        {exercise.prompt.split(':')[0]}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--leaf-muted, #5B7A3A)',
                          opacity: 0.8,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {exercise.items.length} elementos · {exercise.zones.length} categorías
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: isDone ? '#22c55e' : 'var(--leaf-muted)',
                        flexShrink: 0,
                      }}
                    >
                      {isDone ? 'Completado' : 'Pendiente'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
