import type { InventoryItem } from '../types'

interface BackyardDecorationsProps {
  items: InventoryItem[]
}

export function BackyardDecorations({ items }: BackyardDecorationsProps) {
  const placed = items.filter((i) => i.isPlaced && i.shopItem.isCosmetic && i.posX !== null && i.posY !== null)

  return (
    <>
      {placed.map((item) => (
        <span
          key={item.id}
          className="absolute select-none pointer-events-none text-2xl"
          style={{
            left: `${(item.posX ?? 0) * 100}%`,
            top: `${(item.posY ?? 0) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          role="img"
          aria-label={item.shopItem.name}
        >
          {item.shopItem.emoji}
        </span>
      ))}
    </>
  )
}
