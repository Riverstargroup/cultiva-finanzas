import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { DraggableItem } from './DraggableItem'
import { DropZone } from './DropZone'
import { useDragDropSession } from '../hooks/useDragDropSession'
import type { DragDropExercise as DragDropExerciseType } from '../types'

interface DragDropExerciseProps {
  exercise: DragDropExerciseType
  onNext?: (wasCorrect: boolean) => void
}

export function DragDropExercise({ exercise, onNext }: DragDropExerciseProps) {
  const { session, placeItem, removeItem, submit, reset, allPlaced } =
    useDragDropSession(exercise)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 4 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 8 },
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      removeItem(String(active.id))
      return
    }
    const itemId = String(active.id)
    const zoneId = String(over.id)
    placeItem(itemId, zoneId)
  }

  const unplacedItems = exercise.items.filter(
    (item) => !(item.id in session.currentMapping)
  )

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Prompt */}
        <p
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--leaf-dark, #1B3B26)',
            lineHeight: 1.5,
          }}
        >
          {exercise.prompt}
        </p>

        {/* Item bank */}
        <div
          style={{
            background: 'rgba(244,236,225,0.4)',
            borderRadius: '16px',
            padding: '14px',
            border: '1px solid var(--clay-soft, #d4c5b0)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--leaf-muted, #5B7A3A)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            Arrastra los elementos
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '40px' }}>
            {unplacedItems.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                submitted={session.submitted}
              />
            ))}
            {unplacedItems.length === 0 && !session.submitted && (
              <span style={{ fontSize: '0.85rem', color: 'var(--leaf-muted)', opacity: 0.6 }}>
                Todos los elementos están colocados ✓
              </span>
            )}
          </div>
        </div>

        {/* Drop zones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {exercise.zones.map((zone) => {
            const zoneItems = exercise.items.filter(
              (item) => session.currentMapping[item.id] === zone.id
            )
            return (
              <DropZone
                key={zone.id}
                id={zone.id}
                label={zone.label}
                items={zoneItems}
                submitted={session.submitted}
                correctMapping={exercise.correctMapping}
                currentMapping={session.currentMapping}
              />
            )
          })}
        </div>

        {/* Feedback */}
        {session.submitted && session.correct !== null && (
          <div
            style={{
              borderRadius: '12px',
              padding: '14px 16px',
              background: session.correct
                ? 'rgba(34,197,94,0.1)'
                : 'rgba(239,68,68,0.08)',
              border: `1px solid ${session.correct ? '#22c55e' : '#ef4444'}`,
              fontSize: '0.9rem',
              fontWeight: 600,
              color: session.correct ? '#15803d' : '#b91c1c',
            }}
          >
            {session.correct
              ? `¡Excelente! Respuesta correcta 🌱 +${(session.masteryEarned * 100).toFixed(0)} dominio ganado`
              : 'Casi — revisa los elementos en rojo e intenta de nuevo'}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!session.submitted ? (
            <button
              onClick={submit}
              disabled={!allPlaced}
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                border: 'none',
                background: allPlaced ? 'var(--leaf-bright, #4CAF50)' : 'var(--clay-soft, #d4c5b0)',
                color: allPlaced ? '#fff' : 'var(--leaf-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: allPlaced ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >
              Verificar respuestas
            </button>
          ) : (
            <>
              <button
                onClick={reset}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: '2px solid var(--clay-soft)',
                  background: 'transparent',
                  color: 'var(--leaf-dark)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Reintentar
              </button>
              {onNext && (
                <button
                  onClick={() => onNext(session.correct === true)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '20px',
                    border: 'none',
                    background: 'var(--leaf-bright, #4CAF50)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Siguiente ejercicio →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </DndContext>
  )
}
