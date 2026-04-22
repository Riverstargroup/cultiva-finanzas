import { Wheat } from 'lucide-react'
import { useRetos } from '../hooks/useRetos'
import { RetosCard } from './RetosCard'

export function WeeklyRetos() {
  const { data: challenges = [], isLoading } = useRetos()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wheat className="h-5 w-5" style={{ color: 'var(--leaf-bright)' }} />
        <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
          Retos de Cosecha
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="organic-card h-24 animate-pulse opacity-50" />
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <div className="organic-card p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
            No hay retos disponibles esta semana
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {challenges.map((ch) => (
            <RetosCard key={ch.id} challenge={ch} />
          ))}
        </div>
      )}
    </div>
  )
}
