import { useState } from 'react'
import { Layers } from 'lucide-react'
import { useDragDropExercises } from '@/features/dragdrop/hooks/useDragDropSession'
import { DragDropExercise } from '@/features/dragdrop/components/DragDropExercise'

export default function Ejercicios() {
  const { data: exercises = [], isLoading } = useDragDropExercises()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const current = exercises[selectedIndex] ?? null

  return (
    <div className="dashboard-skin botanical-bg min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--forest-deep)' }}>
              Ejercicios 🎯
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Arrastra y clasifica para aprender
            </p>
          </div>
          <Layers className="text-leaf-bright" size={28} />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="organic-card h-24 animate-pulse opacity-50" />
            <div className="organic-card h-40 animate-pulse opacity-50" />
          </div>
        ) : exercises.length === 0 ? (
          <div className="organic-card flex flex-col items-center gap-4 py-12 text-center">
            <span className="text-5xl">🎲</span>
            <p className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
              No hay ejercicios disponibles
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Los ejercicios se irán añadiendo pronto.
            </p>
          </div>
        ) : (
          <>
            {/* Exercise selector (if multiple) */}
            {exercises.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {exercises.map((ex, i) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedIndex(i)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      i === selectedIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Ejercicio {i + 1}
                  </button>
                ))}
              </div>
            )}

            {current && <DragDropExercise exercise={current} />}
          </>
        )}
      </div>
    </div>
  )
}
