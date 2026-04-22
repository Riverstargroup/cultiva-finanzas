import BotanicalPage from '@/components/layout/BotanicalPage'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  useTodaySession,
  useSessionCount,
  useSubmitInsight,
  PolinizacionSession,
  BeeProgress,
  DailyLock,
} from '@/features/polinizacion'
import type { SkillDomain } from '@/features/polinizacion'

export default function Polinizacion() {
  const { user } = useAuth()
  const { toast } = useToast()
  const userId = user?.id ?? ''

  const { data: todaySession, isLoading: sessionLoading } = useTodaySession(userId)
  const { data: sessionCount = 0 } = useSessionCount(userId)
  const submitInsight = useSubmitInsight()

  function handleSubmit(domain: SkillDomain, insight: string) {
    submitInsight.mutate(
      { domainLearned: domain, insight },
      {
        onSuccess: () => {
          toast({
            title: '¡Polinización completa! 🐝',
            description: '+20 monedas y +2% maestría en tu área elegida',
          })
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Inténtalo de nuevo'
          toast({ title: 'Error al guardar', description: message, variant: 'destructive' })
        },
      }
    )
  }

  return (
    <BotanicalPage title="Polinización Cruzada 🐝" subtitle="Aprende de otras áreas">
      <div className="space-y-6 max-w-2xl">

        {/* Bee progress indicator */}
        <BeeProgress sessionCount={sessionCount} />

        {/* Main content: session or lock */}
        {sessionLoading ? (
          <div className="organic-card p-8 flex items-center justify-center">
            <div className="animate-spin text-3xl">🌻</div>
          </div>
        ) : todaySession ? (
          <DailyLock />
        ) : (
          <PolinizacionSession
            onSubmit={handleSubmit}
            isPending={submitInsight.isPending}
          />
        )}
      </div>
    </BotanicalPage>
  )
}
