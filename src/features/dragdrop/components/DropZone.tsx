import { useDroppable } from '@dnd-kit/core'
import { DraggableItem } from './DraggableItem'
import type { DropZone as DropZoneType, DragItem, VerifyResult } from '../types'

interface DropZoneProps {
  zone: DropZoneType
  items: DragItem[]
  verifyResult: VerifyResult
  correctMapping: Record<string, string>
  onRemoveItem?: (itemId: string) => void
}

export function DropZone({ zone, items, verifyResult, correctMapping, onRemoveItem }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: zone.id })

  const zoneClass = () => {
    if (verifyResult === null) {
      return isOver
        ? 'border-primary bg-primary/10'
        : 'border-dashed border-border bg-muted/40'
    }
    const allCorrect = items.every(item => correctMapping[item.id] === zone.id)
    const hasItems = items.length > 0
    if (!hasItems) return 'border-dashed border-border bg-muted/40'
    return allCorrect
      ? 'border-green-400 bg-green-50'
      : 'border-red-400 bg-red-50'
  }

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 p-3 min-h-[80px] transition-colors ${zoneClass()}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
        {zone.label}
      </p>
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onRemoveItem?.(item.id)}
            className="cursor-pointer"
          >
            <DraggableItem item={item} disabled={verifyResult !== null} />
          </div>
        ))}
      </div>
    </div>
  )
}
