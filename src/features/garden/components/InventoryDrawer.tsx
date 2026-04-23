import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useActivatePower } from '../hooks/useInventory'
import { SPECIAL_POWER_COLORS, SPECIAL_POWER_LABELS } from '../types'
import type { InventoryItem } from '../types'

interface InventoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inventory: InventoryItem[]
  onPlace: (item: InventoryItem) => void
}

export function InventoryDrawer({ open, onOpenChange, inventory, onPlace }: InventoryDrawerProps) {
  const activate = useActivatePower()
  const [pendingActivate, setPendingActivate] = useState<InventoryItem | null>(null)

  const unplaced = inventory.filter((i) => !i.isPlaced)
  const placed = inventory.filter((i) => i.isPlaced)

  const handleActivate = (item: InventoryItem) => {
    if (item.shopItem.specialPower === 'fire' || item.shopItem.specialPower === 'ice') {
      setPendingActivate(item)
    } else {
      activate.mutate(item.id)
    }
  }

  const confirmActivate = () => {
    if (!pendingActivate) return
    activate.mutate(pendingActivate.id, {
      onSettled: () => setPendingActivate(null),
    })
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle className="font-heading text-lg" style={{ color: 'var(--forest-deep)' }}>
              📦 Tu inventario
            </DrawerTitle>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-6 space-y-4">
            {inventory.length === 0 ? (
              <p className="text-center text-sm py-6" style={{ color: 'var(--leaf-muted)' }}>
                Visita la tienda para comprar tus primeras plantas 🌱
              </p>
            ) : (
              <>
                {unplaced.length > 0 && (
                  <section>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--leaf-muted)' }}>
                      Sin colocar
                    </p>
                    <div className="space-y-2">
                      {unplaced.map((item) => (
                        <InventoryItemRow
                          key={item.id}
                          item={item}
                          onPlace={() => { onOpenChange(false); onPlace(item) }}
                          onActivate={() => handleActivate(item)}
                          isActivating={activate.isPending}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {placed.length > 0 && (
                  <section>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--leaf-muted)' }}>
                      Colocadas
                    </p>
                    <div className="space-y-2">
                      {placed.map((item) => (
                        <InventoryItemRow
                          key={item.id}
                          item={item}
                          onPlace={undefined}
                          onActivate={item.shopItem.specialPower ? () => handleActivate(item) : undefined}
                          isActivating={activate.isPending}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Consume-confirmation for fire/ice */}
      <AlertDialog open={!!pendingActivate} onOpenChange={(o) => { if (!o) setPendingActivate(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Activar {pendingActivate?.shopItem.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingActivate?.shopItem.powerDescription} Se consumirá al activarlo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmActivate} disabled={activate.isPending}>
              Activar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface InventoryItemRowProps {
  item: InventoryItem
  onPlace: (() => void) | undefined
  onActivate: (() => void) | undefined
  isActivating: boolean
}

function InventoryItemRow({ item, onPlace, onActivate, isActivating }: InventoryItemRowProps) {
  const colors = item.shopItem.specialPower ? SPECIAL_POWER_COLORS[item.shopItem.specialPower] : null

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        background: colors ? colors.aura : 'rgba(255,255,255,0.7)',
        border: `1.5px solid ${colors ? colors.accent : 'var(--clay-soft)'}`,
      }}
    >
      <span className="text-2xl flex-shrink-0" role="img" aria-label={item.shopItem.name}>
        {item.shopItem.emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: 'var(--forest-deep)' }}>{item.shopItem.name}</p>
        {item.shopItem.specialPower && (
          <p className="text-xs" style={{ color: colors?.accent }}>
            {SPECIAL_POWER_LABELS[item.shopItem.specialPower]}
          </p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {onPlace && (
          <button
            onClick={onPlace}
            className="text-xs font-bold px-2.5 py-1 rounded-lg"
            style={{ background: 'var(--forest-deep)', color: '#fff' }}
          >
            Colocar
          </button>
        )}
        {onActivate && (
          <button
            onClick={onActivate}
            disabled={isActivating}
            className="text-xs font-bold px-2.5 py-1 rounded-lg disabled:opacity-50"
            style={{ background: colors?.accent ?? 'var(--leaf-bright)', color: '#fff' }}
          >
            Activar
          </button>
        )}
      </div>
    </div>
  )
}
