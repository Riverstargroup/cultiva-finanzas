import { useState } from 'react'
import { GardenPlot } from './GardenPlot'
import type { GardenPlot as GardenPlotData, PlantAnimationKey } from '../types'

interface GardenGridProps {
  plots: readonly GardenPlotData[]
  activePlotId?: string
  pendingAnimation?: Record<string, PlantAnimationKey>
  onPlotSelect?: (plotId: string) => void
  className?: string
}

export function GardenGrid({ plots, activePlotId, pendingAnimation = {}, onPlotSelect, className }: GardenGridProps) {
  const [selected, setSelected] = useState<string | null>(activePlotId ?? null)

  function handleSelect(plotId: string) {
    setSelected(plotId)
    onPlotSelect?.(plotId)
  }

  return (
    <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${className ?? ''}`}>
      {plots.map((plot) => (
        <GardenPlot
          key={plot.id}
          plot={plot}
          isActive={selected === plot.id}
          animation={pendingAnimation[plot.id] ?? 'idle'}
          onClick={handleSelect}
          className="min-h-[160px] sm:min-h-[180px]"
        />
      ))}
    </div>
  )
}
