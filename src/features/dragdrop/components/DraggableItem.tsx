import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { DragItem } from '../types'

interface DraggableItemProps {
  item: DragItem
  submitted: boolean
  isCorrect?: boolean
  disabled?: boolean
}

export function DraggableItem({ item, submitted, isCorrect, disabled }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: submitted || disabled,
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: submitted || disabled ? 'default' : 'grab',
    touchAction: 'none',
  }

  const getBorderColor = () => {
    if (!submitted) return 'var(--clay-soft)'
    if (isCorrect === true) return '#22c55e'
    if (isCorrect === false) return '#ef4444'
    return 'var(--clay-soft)'
  }

  const getBackground = () => {
    if (!submitted) return 'rgba(255,255,255,0.9)'
    if (isCorrect === true) return 'rgba(34,197,94,0.08)'
    if (isCorrect === false) return 'rgba(239,68,68,0.08)'
    return 'rgba(255,255,255,0.9)'
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        border: `2px solid ${getBorderColor()}`,
        background: getBackground(),
        borderRadius: '20px',
        padding: '8px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.875rem',
        fontWeight: 600,
        userSelect: 'none',
        boxShadow: isDragging
          ? '0 8px 24px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto',
      }}
      {...listeners}
      {...attributes}
    >
      {item.emoji && <span style={{ fontSize: '1rem' }}>{item.emoji}</span>}
      <span style={{ color: 'var(--leaf-dark, #1B3B26)' }}>{item.label}</span>
    </div>
  )
}
