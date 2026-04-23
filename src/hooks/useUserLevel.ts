import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export type UserLevel = 'Semilla' | 'Brote' | 'Jardinero' | 'Maestro del Jardín'

export interface UserLevelInfo {
  level: UserLevel
  completedScenarios: number
  avgMastery: number
  nextLevel: UserLevel | null
  progressToNext: number // 0–1
}

const LEVELS: UserLevel[] = ['Semilla', 'Brote', 'Jardinero', 'Maestro del Jardín']

export function computeLevel(completedScenarios: number, avgMastery: number): UserLevel {
  if (completedScenarios >= 10 && avgMastery >= 0.8) return 'Maestro del Jardín'
  if (completedScenarios >= 5 && avgMastery >= 0.5) return 'Jardinero'
  if (completedScenarios >= 2) return 'Brote'
  return 'Semilla'
}

function progressToNext(level: UserLevel, completedScenarios: number, avgMastery: number): number {
  if (level === 'Semilla') {
    return Math.min(completedScenarios / 2, 1)
  }
  if (level === 'Brote') {
    const scenarioPct = Math.min((completedScenarios - 2) / 3, 1)
    return scenarioPct
  }
  if (level === 'Jardinero') {
    const scenarioPct = Math.min((completedScenarios - 5) / 5, 1)
    const masteryPct = Math.min((avgMastery - 0.5) / 0.3, 1)
    return (scenarioPct + masteryPct) / 2
  }
  return 1
}

export function useUserLevel(): UserLevelInfo & { isLoading: boolean } {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['user-level', user?.id],
    enabled: !!user?.id,
    staleTime: 60_000,
    queryFn: async () => {
      if (!user?.id) return { completedScenarios: 0, avgMastery: 0 }

      const [progressRes, plotsRes] = await Promise.all([
        supabase
          .from('user_course_progress' as any)
          .select('completed_scenarios')
          .eq('user_id', user.id),
        supabase
          .from('user_garden_plots' as any)
          .select('mastery')
          .eq('user_id', user.id),
      ])

      const completedScenarios = ((progressRes.data ?? []) as any[]).reduce(
        (sum, p) => sum + ((p.completed_scenarios as string[])?.length ?? 0),
        0,
      )

      const plots = (plotsRes.data ?? []) as any[]
      const avgMastery =
        plots.length > 0
          ? plots.reduce((sum, p) => sum + (p.mastery ?? 0), 0) / plots.length
          : 0

      return { completedScenarios, avgMastery }
    },
  })

  const completedScenarios = data?.completedScenarios ?? 0
  const avgMastery = data?.avgMastery ?? 0
  const level = computeLevel(completedScenarios, avgMastery)
  const idx = LEVELS.indexOf(level)
  const nextLevel = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null

  return {
    level,
    completedScenarios,
    avgMastery,
    nextLevel,
    progressToNext: progressToNext(level, completedScenarios, avgMastery),
    isLoading,
  }
}
