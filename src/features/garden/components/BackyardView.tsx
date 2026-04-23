import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PlantSprite } from './PlantSprite'
import { SpecialPowerPlant } from './SpecialPowerPlant'
import { BackyardDecorations } from './BackyardDecorations'
import { PlacementOverlay } from './PlacementOverlay'
import { DOMAIN_LABELS } from '../types'
import type { GardenPlot, InventoryItem, GardenEconomy, SpecialPower } from '../types'

// Normalized positions within the backyard canvas (0–1)
const DOMAIN_ANCHORS: Record<string, { x: number; y: number }> = {
  control:    { x: 0.18, y: 0.72 },
  credito:    { x: 0.72, y: 0.60 },
  proteccion: { x: 0.32, y: 0.56 },
  crecimiento:{ x: 0.80, y: 0.76 },
}

function plantSize(stage: string): number {
  const sizes: Record<string, number> = {
    seed: 44, sprout: 58, growing: 72, blooming: 88, mastered: 100,
  }
  return sizes[stage] ?? 72
}

function isWilting(health: number): boolean {
  return health < 50
}

function powerForEconomy(economy: GardenEconomy | null, power: SpecialPower): boolean {
  if (!economy) return false
  const until = power === 'fire' ? economy.fireActiveUntil
    : power === 'gold' ? economy.goldActiveUntil
    : economy.iceActiveUntil
  return !!until && new Date(until) > new Date()
}

interface BackyardViewProps {
  plots: readonly GardenPlot[]
  inventory: InventoryItem[]
  placing: InventoryItem | null
  onPlaced: (inventoryId: string, posX: number, posY: number) => void
  onCancelPlace: () => void
  economy: GardenEconomy | null
}

export function BackyardView({ plots, inventory, placing, onPlaced, onCancelPlace, economy }: BackyardViewProps) {
  const reduced = useReducedMotion()

  const placedInventory = inventory.filter(
    (i) => i.isPlaced && !i.shopItem.isCosmetic && i.posX !== null && i.posY !== null
  )
  const decorations = inventory.filter((i) => i.isPlaced && i.shopItem.isCosmetic)

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{
        aspectRatio: '4 / 3',
        background: 'linear-gradient(180deg, #b8d4e8 0%, #c8dce8 28%, #d6c8a0 52%, #c4a87a 70%, #b89660 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
      role="group"
      aria-label={`Vista del jardín: ${plots.length} plantas de dominio`}
    >
      {/* Sky cloud texture (static) */}
      <div className="absolute inset-x-0 top-0 h-2/5 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 70% 15%, rgba(255,255,255,0.25) 0%, transparent 70%)' }} aria-hidden="true" />

      {/* Ground texture overlay */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none" style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(140,90,40,0.18) 0%, transparent 70%)' }} aria-hidden="true" />

      {/* Decorative cosmetics layer (behind plants) */}
      <BackyardDecorations items={decorations} />

      {/* Domain plants — fixed anchors */}
      {plots.map((plot) => {
        const anchor = DOMAIN_ANCHORS[plot.domain] ?? { x: 0.5, y: 0.7 }
        const size = plantSize(plot.plant.stage)
        const wilting = isWilting(plot.plant.health)

        return (
          <motion.div
            key={`domain-${plot.id}`}
            layoutId={`plant-${plot.id}`}
            className="absolute flex flex-col items-center"
            style={{
              left: `${anchor.x * 100}%`,
              top: `${anchor.y * 100}%`,
              transform: 'translate(-50%, -100%)',
              filter: wilting ? 'saturate(0.65) brightness(0.9)' : undefined,
            }}
            initial={reduced ? undefined : { y: 30, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <PlantSprite
              species={plot.plant.species}
              stage={plot.plant.stage}
              healthState={plot.plant.healthState}
              size={size}
              animation="idle"
              ariaLabel={`${DOMAIN_LABELS[plot.domain]}: ${plot.plant.stage}`}
            />
            {/* Domain label chip */}
            <span
              className="mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full opacity-80"
              style={{ background: 'rgba(0,0,0,0.35)', color: '#fff' }}
            >
              {DOMAIN_LABELS[plot.domain]}
            </span>
          </motion.div>
        )
      })}

      {/* Purchased special plants — freely positioned */}
      <AnimatePresence>
        {placedInventory.map((inv) => {
          const power = inv.shopItem.specialPower
          const isActive = power ? powerForEconomy(economy, power) : false

          return (
            <motion.div
              key={`inv-${inv.id}`}
              className="absolute flex flex-col items-center"
              style={{
                left: `${(inv.posX ?? 0.5) * 100}%`,
                top: `${(inv.posY ?? 0.7) * 100}%`,
                transform: 'translate(-50%, -100%)',
              }}
              initial={reduced ? undefined : { y: 40, scale: 0.6, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { y: -20, scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {power ? (
                <SpecialPowerPlant
                  power={power}
                  emoji={inv.shopItem.emoji}
                  name={inv.shopItem.name}
                  isActive={isActive}
                  size={60}
                />
              ) : (
                <span className="text-4xl" role="img" aria-label={inv.shopItem.name}>
                  {inv.shopItem.emoji}
                </span>
              )}
              <span
                className="mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full opacity-80"
                style={{ background: 'rgba(0,0,0,0.35)', color: '#fff' }}
              >
                {inv.shopItem.name}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Placement overlay */}
      <AnimatePresence>
        {placing && (
          <motion.div
            key="placement"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PlacementOverlay
              item={placing}
              onPlace={(posX, posY) => onPlaced(placing.id, posX, posY)}
              onCancel={onCancelPlace}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
