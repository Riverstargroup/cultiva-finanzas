import { useEffect } from 'react'
import { GardenGrid } from '@/features/garden/components/GardenGrid'
import { GardenStats } from '@/features/garden/components/GardenStats'
import { useGarden, useInitGarden } from '@/features/garden/hooks/useGarden'
import { Leaf } from 'lucide-react'

export default function Jardin() {
  const garden = useGarden()
  const initGarden = useInitGarden()

  // Auto-init garden on first visit if no plots exist
  useEffect(() => {
    if (!garden.isLoading && garden.plots.length === 0) {
      initGarden.mutate()
    }
  }, [garden.isLoading, garden.plots.length])

  const plantsMastered = garden.plots.filter((p) => p.plant.stage === 'mastered').length

  return (
    <div className="dashboard-skin botanical-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--forest-deep)' }}>
              Mi Jardín 🌱
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tu progreso financiero, hecho visible
            </p>
          </div>
          <Leaf className="text-leaf-bright" size={28} />
        </div>

        {/* Stats */}
        <GardenStats
          coins={garden.coins}
          totalMastery={garden.totalMastery}
          streakDays={garden.streakDays}
          plantsMastered={plantsMastered}
        />

        {/* Garden grid */}
        {garden.isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="garden-plot-surface h-[180px] animate-pulse opacity-50" />
            ))}
          </div>
        ) : garden.plots.length === 0 ? (
          <div className="organic-card flex flex-col items-center gap-4 py-12 text-center">
            <span className="text-5xl">🌱</span>
            <p className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
              Tu jardín está listo para crecer
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Completa escenarios y flashcards para que tus plantas florezcan
            </p>
          </div>
        ) : (
          <GardenGrid plots={garden.plots} />
        )}

        {/* Coming soon hooks for future agents */}
        <div className="organic-card p-4 space-y-2 opacity-60">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Próximamente
          </p>
          <div className="flex flex-wrap gap-2">
            {['Flashcards', 'Drag & Drop', 'Simuladores', 'Mini-Juegos', 'Cosecha Semanal', 'Pronósticos', 'Polinización'].map((item) => (
              <span key={item} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
