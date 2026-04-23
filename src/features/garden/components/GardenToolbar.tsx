import { ShoppingBag, Package } from 'lucide-react'

interface GardenToolbarProps {
  onOpenShop: () => void
  onOpenInventory: () => void
  inventoryCount: number
}

export function GardenToolbar({ onOpenShop, onOpenInventory, inventoryCount }: GardenToolbarProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onOpenShop}
        className="flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-xl font-bold text-sm transition-all active:scale-95"
        style={{
          background: 'var(--forest-deep)',
          color: '#fff',
        }}
        aria-label="Abrir tienda de plantas"
      >
        <ShoppingBag className="h-4 w-4" />
        Tienda
      </button>

      <button
        onClick={onOpenInventory}
        className="relative flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-xl font-bold text-sm transition-all active:scale-95"
        style={{
          background: 'color-mix(in srgb, var(--forest-deep) 12%, transparent)',
          border: '1.5px solid var(--clay-soft)',
          color: 'var(--forest-deep)',
        }}
        aria-label={`Abrir inventario (${inventoryCount} sin colocar)`}
      >
        <Package className="h-4 w-4" />
        Inventario
        {inventoryCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
            style={{ background: 'var(--terracotta-vivid)', color: '#fff' }}
          >
            {inventoryCount}
          </span>
        )}
      </button>
    </div>
  )
}
