import { GardenScene } from './GardenScene'
import type { GardenPlot, InventoryItem, GardenEconomy } from '../types'

interface BackyardViewProps {
  plots: readonly GardenPlot[]
  inventory: InventoryItem[]
  placing: InventoryItem | null
  onPlaced: (inventoryId: string, posX: number, posY: number) => void
  onCancelPlace: () => void
  economy: GardenEconomy | null
  coins?: number
}

// Derive total coins from inventory + economy context is handled upstream.
// We accept an optional coins prop so Jardin.tsx can pass garden.coins without
// changes; when missing, default to 0.
export function BackyardView({ plots, coins = 0 }: BackyardViewProps) {
  return <GardenScene plots={plots} coins={coins} timeOfDay="day" weather="clear" showLabels />
}
