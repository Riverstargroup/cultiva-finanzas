import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { startOfWeek, format } from 'date-fns'
import type { WeeklyChallenge } from '../types'

export const retosKeys = {
  all: ['retos'] as const,
  weekly: (userId: string, weekStart: string) => ['retos', 'weekly', userId, weekStart] as const,
}

function currentWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function useRetos() {
  const { user } = useAuth()
  const weekStart = currentWeekStart()

  return useQuery({
    queryKey: retosKeys.weekly(user?.id ?? '', weekStart),
    queryFn: async (): Promise<WeeklyChallenge[]> => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('user_weekly_challenges' as any)
        .select('*, challenge_templates(*)')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)

      if (error) throw error

      // If no challenges assigned yet, call the function then refetch
      if (!data || data.length === 0) {
        await supabase.rpc('assign_weekly_challenges' as any, { p_user_id: user.id })
        const { data: refetched, error: e2 } = await supabase
          .from('user_weekly_challenges' as any)
          .select('*, challenge_templates(*)')
          .eq('user_id', user.id)
          .eq('week_start', weekStart)
        if (e2) throw e2
        return mapRows(refetched ?? [])
      }

      return mapRows(data)
    },
    enabled: !!user?.id,
    staleTime: 30_000,
  })
}

function mapRows(rows: any[]): WeeklyChallenge[] {
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    templateId: r.template_id,
    weekStart: r.week_start,
    progress: Number(r.progress ?? 0),
    completed: r.completed ?? false,
    harvested: r.harvested ?? false,
    completedAt: r.completed_at ?? null,
    createdAt: r.created_at,
    template: r.challenge_templates
      ? {
          id: r.challenge_templates.id,
          title: r.challenge_templates.title,
          description: r.challenge_templates.description ?? null,
          targetMasteryDelta: Number(r.challenge_templates.target_mastery_delta),
          targetDomain: r.challenge_templates.target_domain ?? null,
          rewardCoins: r.challenge_templates.reward_coins ?? 100,
          difficulty: r.challenge_templates.difficulty ?? 1,
          emoji: r.challenge_templates.emoji ?? '🌾',
          isActive: r.challenge_templates.is_active ?? true,
        }
      : null,
  }))
}
