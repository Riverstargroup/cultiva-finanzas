import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DraggableItem } from './DraggableItem'
import { DropZone } from './DropZone'
import { useDragDropSession } from '../hooks/useDragDropSession'
import type { DragDropExercise as DragDropExerciseType, DragItem } from '../types'

interface DragDropExerciseProps {
  exercise: DragDropExerciseType
}

export function DragDropExercise({ exercise }: DragDropExerciseProps) {
  const session = useDragDropSession(exercise)
  const [activeItem, setActiveItem] = useState<DragItem | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  )

  const unplacedItems = exercise.items.filter(item => session.placement[item.id] === undefined)

  const itemsInZone = (zoneId: string) =>
    exercise.items.filter(item => session.placement[item.id] === zoneId)

  const handleDragStart = (event: DragStartEvent) => {
    const item = exercise.items.find(i => i.id === event.active.id)
    setActiveItem(item ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null)
    const { active, over } = event
    if (!over) return
    const itemId = active.id as string
    const zoneId = over.id as string
    const isZone = exercise.zones.some(z => z.id === zoneId)
    if (!isZone) return

    const isCorrect = exercise.correctMapping[itemId] === zoneId
    if (!isCorrect && session.verifyResult === null) {
      setTimeout(() => session.removeItem(itemId), 400)
    }
    session.moveItem(itemId, zoneId)
  }

  if (session.isDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <span className="text-5xl">🌱</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          ¡Correcto!
        </h3>
        <p className="text-muted-foreground text-sm">Tu planta ha crecido un poco más.</p>
        <button
          onClick={session.reset}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Intentar de nuevo
        </button>
      </motion.div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        {/* Prompt */}
        <div className="organic-card p-4">
          <p className="font-semibold text-sm" style={{ color: 'var(--forest-deep)' }}>
            {exercise.prompt}
          </p>
        </div>

        {/* Unplaced items bank */}
        <div className="flex flex-wrap gap-2 min-h-[48px] p-2 rounded-xl border border-dashed border-muted-foreground/30">
          {unplacedItems.length === 0 ? (
            <span className="text-xs text-muted-foreground self-center w-full text-center">
              Todos los elementos han sido colocados
            </span>
          ) : (
            unplacedItems.map(item => (
              <DraggableItem key={item.id} item={item} disabled={session.verifyResult !== null} />
            ))
          )}
        </div>

        {/* Drop zones */}
        <div className="grid grid-cols-1 gap-3">
          {exercise.zones.map(zone => (
            <DropZone
              key={zone.id}
              zone={zone}
              items={itemsInZone(zone.id)}
              verifyResult={session.verifyResult}
              correctMapping={exercise.correctMapping}
              onRemoveItem={session.verifyResult === null ? session.removeItem : undefined}
            />
          ))}
        </div>

        {/* Feedback */}
        {session.verifyResult === 'incorrect' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-600 font-medium"
          >
            Algunos elementos no están en el lugar correcto. ¡Inténtalo de nuevo!
          </motion.p>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={session.reset}
            className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Reiniciar
          </button>
          <button
            onClick={session.verify}
            disabled={!session.allPlaced || session.verifyResult === 'correct'}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verificar
          </button>
        </div>
      </div>

      <DragOverlay>
        {activeItem && <DraggableItem item={activeItem} />}
      </DragOverlay>
    </DndContext>
  )
}
