import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { InventoryItem } from '../types'

interface PlacementOverlayProps {
  item: InventoryItem
  onPlace: (posX: number, posY: number) => void
  onCancel: () => void
}

export function PlacementOverlay({ item, onPlace, onCancel }: PlacementOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)

  const toNormalized = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return null
    const x = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0.3, Math.min(0.95, (e.clientY - rect.top) / rect.height))
    return { x, y }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const pos = toNormalized(e)
    if (pos) setCursor(pos)
  }

  const handleClick = (e: React.PointerEvent) => {
    const pos = toNormalized(e)
    if (pos) onPlace(pos.x, pos.y)
  }

  return (
    <div
      ref={ref}
      className="absolute inset-0 rounded-2xl cursor-crosshair z-20"
      style={{ background: 'rgba(0,0,0,0.15)' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handleClick}
    >
      {/* Cancel button */}
      <button
        onClick={(e) => { e.stopPropagation(); onCancel() }}
        className="absolute top-3 right-3 z-30 text-xs font-bold px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
        aria-label="Cancelar colocación"
      >
        Cancelar ✕
      </button>

      {/* Instruction */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', whiteSpace: 'nowrap' }}
      >
        Toca donde quieres colocar {item.shopItem.emoji}
      </div>

      {/* Cursor preview */}
      {cursor && (
        <motion.div
          className="absolute pointer-events-none select-none text-4xl"
          style={{
            left: `${cursor.x * 100}%`,
            top: `${cursor.y * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.1 }}
          aria-hidden="true"
        >
          {item.shopItem.emoji}
        </motion.div>
      )}
    </div>
  )
}
