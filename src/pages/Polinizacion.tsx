import { useDailyLock } from '@/features/polinizacion/hooks/useDailyLock'
import PolinizacionSession from '@/features/polinizacion/components/PolinizacionSession'
import { DailyLock } from '@/features/polinizacion/components/DailyLock'
import BotanicalPage from '@/components/layout/BotanicalPage'

export default function Polinizacion() {
  const { isLocked, isLoading } = useDailyLock()

  return (
    <BotanicalPage
      title="Polinización Cruzada 🐝"
      subtitle="Repasa tarjetas de distintos dominios"
    >
      {isLoading ? (
        <div className="organic-card p-8 text-center animate-pulse opacity-50">
          <p style={{ color: 'var(--leaf-muted)' }}>Cargando...</p>
        </div>
      ) : isLocked ? (
        <DailyLock />
      ) : (
        <PolinizacionSession />
      )}
    </BotanicalPage>
  )
}
