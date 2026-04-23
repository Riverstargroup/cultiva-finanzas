import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useShopItems } from '../hooks/useShopItems'
import { usePurchaseItem } from '../hooks/useInventory'
import { ShopItemCard } from './ShopItemCard'
import type { ShopItem } from '../types'

interface PlantShopDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coins: number
}

type Tab = 'especiales' | 'cosmeticos'

export function PlantShopDrawer({ open, onOpenChange, coins }: PlantShopDrawerProps) {
  const [tab, setTab] = useState<Tab>('especiales')
  const { data: items = [] } = useShopItems()
  const purchase = usePurchaseItem()

  const specials = items.filter((i) => !i.isCosmetic)
  const cosmetics = items.filter((i) => i.isCosmetic)
  const shown = tab === 'especiales' ? specials : cosmetics

  const handleBuy = (item: ShopItem) => {
    purchase.mutate(item.id, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-heading text-lg" style={{ color: 'var(--forest-deep)' }}>
              🏪 Tienda del jardín
            </DrawerTitle>
            <span className="text-sm font-bold px-2.5 py-1 rounded-full" style={{ background: 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)', color: 'var(--forest-deep)' }}>
              🪙 {coins}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 p-1 rounded-xl" style={{ background: 'var(--clay-soft)' }}>
            {(['especiales', 'cosmeticos'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize"
                style={{
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? 'var(--forest-deep)' : 'var(--leaf-muted)',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {t === 'especiales' ? '⚡ Especiales' : '🌸 Cosméticos'}
              </button>
            ))}
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-6 pt-3">
          {shown.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: 'var(--leaf-muted)' }}>
              Próximamente más artículos ✨
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {shown.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  coins={coins}
                  onBuy={handleBuy}
                  isBuying={purchase.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
