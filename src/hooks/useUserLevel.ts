import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export type LevelTier = 'semilla' | 'brote' | 'jardinero' | 'maestro'

export interface UserLevel {
  tier: LevelTier
  title: string
  icon: string
  completedScenarios: number
  avgMastery: number
  nextTier: LevelTier | null
  nextTitle: string | null
  nextIcon: string | null
  nextRequirement: string | null
  progressPercent: number
}

const LEVELS: Record<LevelTier, { title: string; icon: string }> = {
  semilla: { title: 'Semilla', icon: '🌱' },
  brote:   { title: 'Brote',   icon: '🌿' },
  jardinero: { title: 'Jardinero', icon: '🌻' },
  maestro:   { title: 'Maestro del Jardín', icon: '🏡' },
}

function computeLevel(completedScenarios: number, totalScenarios: number, avgMastery: number): UserLevel {
  let tier: LevelTier
  let progressPercent: number

  if (completedScenarios >= totalScenarios && totalScenarios > 0 && avgMastery >= 0.8) {
    tier = 'maestro'
    progressPercent = 100
  } else if (completedScenarios >= 5 && avgMastery >= 0.5) {
    tier = 'jardinero'
    // Progress toward maestro: need all scenarios + 80% mastery
    const scenarioPct = Math.min(completedScenarios / Math.max(totalScenarios, 1), 1)
    const masteryPct = Math.min(avgMastery / 0.8, 1)
    progressPercent = Math.round(((scenarioPct + masteryPct) / 2) * 100)
  } else if (completedScenarios >= 2) {
    tier = 'brote'
    // Progress toward jardinero: need 5 scenarios + 50% mastery
    const scenarioPct = Math.min(completedScenarios / 5, 1)
    progressPercent = Math.round(scenarioPct * 100)
  } else {
    tier = 'semilla'
    progressPercent = Math.round((completedScenarios / 2) * 100)
  }

  const nextMap: Record<LevelTier, LevelTier | null> = {
    semilla: 'brote',
    brote: 'jardinero',
    jardinero: 'maestro',
    maestro: null,
  }

  const requirementMap: Record<LevelTier, string> = {
    semilla: 'Completa 2 escenarios',
    brote: 'Completa 5 escenarios y llega a 50% de maestría promedio',
    jardinero: 'Completa todos los escenarios con 80% de maestría promedio',
    maestro: '',
  }

  const next = nextMap[tier]

  return {
    tier,
    title: LEVELS[tier].title,
    icon: LEVELS[tier].icon,
    completedScenarios,
    avgMastery,
    nextTier: next,
    nextTitle: next ? LEVELS[next].title : null,
    nextIcon: next ? LEVELS[next].icon : null,
    nextRequirement: requirementMap[tier] || null,
    progressPercent,
  }
}

export function useUserLevel() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['user-level', user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async (): Promise<UserLevel> => {
      if (!user) return computeLevel(0, 1, 0)

      const [progressRes, gardenRes, scenariosRes] = await Promise.all([
        supabase
          .from('user_course_progress' as any)
          .select('completed_scenarios, mastery_score')
          .eq('user_id', user.id),
        supabase
          .from('user_garden_plots' as any)
          .select('mastery')
          .eq('user_id', user.id),
        supabase
          .from('scenarios' as any)
          .select('id', { count: 'exact', head: true }),
      ])

      const completedScenarios = ((progressRes.data ?? []) as any[]).reduce(
        (sum: number, p: any) => sum + ((p.completed_scenarios as string[])?.length ?? 0),
        0
      )

      const totalScenarios = scenariosRes.count ?? 0

      const plots = (gardenRes.data ?? []) as any[]
      const avgMastery = plots.length > 0
        ? plots.reduce((sum: number, p: any) => sum + (p.mastery ?? 0), 0) / plots.length
        : 0

      return computeLevel(completedScenarios, totalScenarios, avgMastery)
    },
  })
}
