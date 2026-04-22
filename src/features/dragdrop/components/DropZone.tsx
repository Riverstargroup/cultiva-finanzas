import { useDroppable } from '@dnd-kit/core'
import { DraggableItem } from './DraggableItem'
import type { DragItem, DropZoneId } from '../types'

interface DropZoneProps {
  id: DropZoneId
  label: string
  items: DragItem[]
  submitted: boolean
  correctMapping: Record<string, DropZoneId>
  currentMapping: Record<string, DropZoneId>
}

export function DropZone({
  id,
  label,
  items,
  submitted,
  correctMapping,
  currentMapping,
}: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const getZoneBorder = () => {
    if (submitted) {
      const allCorrect =
        items.length > 0 &&
        items.every((item) => correctMapping[item.id] === id)
      const hasWrong = items.some((item) => correctMapping[item.id] !== id)
      if (allCorrect && !hasWrong) return '2px solid #22c55e'
      if (hasWrong) return '2px solid #ef4444'
    }
    if (isOver) return '2px solid var(--leaf-bright, #4CAF50)'
    return '2px dashed var(--clay-soft, #d4c5b0)'
  }

  const getZoneBackground = () => {
    if (isOver && !submitted) return 'rgba(76,175,80,0.06)'
    return 'rgba(255,255,255,0.5)'
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: '80px',
        border: getZoneBorder(),
        borderRadius: '16px',
        padding: '12px',
        background: getZoneBackground(),
        transition: 'border-color 0.2s, background 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--leaf-muted, #5B7A3A)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '36px' }}>
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            submitted={submitted}
            isCorrect={submitted ? correctMapping[item.id] === currentMapping[item.id] : undefined}
          />
        ))}
      </div>
    </div>
  )
}
