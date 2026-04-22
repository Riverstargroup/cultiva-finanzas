import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { DragItem } from '../types'

interface DraggableItemProps {
  item: DragItem
  disabled?: boolean
}

export function DraggableItem({ item, disabled }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
    touchAction: 'none' as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-border shadow-sm cursor-grab active:cursor-grabbing font-medium text-sm select-none transition-shadow hover:shadow-md"
    >
      {item.emoji && <span>{item.emoji}</span>}
      <span>{item.label}</span>
    </div>
  )
}
