import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'
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
              Tienda del jardin
            </DrawerTitle>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold" style={{ background: 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)', color: 'var(--forest-deep)' }}>
              <img src={coinSprout} alt="" className="h-5 w-5" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
              {coins}
            </span>
          </div>

          <div className="mt-3 flex gap-1 rounded-xl p-1" style={{ background: 'var(--clay-soft)' }}>
            {(['especiales', 'cosmeticos'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 rounded-lg py-1.5 text-xs font-bold capitalize transition-all"
                style={{
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? 'var(--forest-deep)' : 'var(--leaf-muted)',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {t === 'especiales' ? 'Especiales' : 'Cosmeticos'}
              </button>
            ))}
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-6 pt-3">
          {shown.length === 0 ? (
            <p className="py-8 text-center text-sm" style={{ color: 'var(--leaf-muted)' }}>
              Proximamente mas articulos
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
