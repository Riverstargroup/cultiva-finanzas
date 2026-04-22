import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { ChallengeTemplate, UserWeeklyChallenge, ActiveChallengeWithTemplate } from '../types'

// ---- Query keys ------------------------------------------------

export const retosKeys = {
  all: ['retos'] as const,
  templates: () => [...retosKeys.all, 'templates'] as const,
  activeChallenges: (userId: string) => [...retosKeys.all, 'active', userId] as const,
}

// ---- Helpers ---------------------------------------------------

function getMondayOfCurrentWeek(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().split('T')[0]
}

function daysRemainingFromWeekStart(weekStart: string, durationDays: number): number {
  const start = new Date(weekStart)
  const end = new Date(start)
  end.setDate(start.getDate() + durationDays)
  const now = new Date()
  const msLeft = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
}

export { daysRemainingFromWeekStart }

// ---- Hooks -----------------------------------------------------

export function useAvailableChallenges() {
  return useQuery({
    queryKey: retosKeys.templates(),
    queryFn: async (): Promise<ChallengeTemplate[]> => {
      const { data, error } = await (supabase as any)
        .from('challenge_templates')
        .select('*')
        .eq('is_active', true)
        .order('difficulty', { ascending: true })

      if (error) throw error
      return (data ?? []) as ChallengeTemplate[]
    },
    staleTime: 60_000 * 5,
  })
}

export function useMyActiveChallenges(userId: string) {
  const weekStart = getMondayOfCurrentWeek()

  return useQuery({
    queryKey: retosKeys.activeChallenges(userId),
    queryFn: async (): Promise<ActiveChallengeWithTemplate[]> => {
      const { data, error } = await (supabase as any)
        .from('user_weekly_challenges')
        .select('*, template:challenge_templates(*)')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .eq('status', 'active')

      if (error) throw error
      return (data ?? []) as ActiveChallengeWithTemplate[]
    },
    enabled: !!userId,
    staleTime: 30_000,
  })
}

export function useWeeklyCompletedCount(userId: string) {
  const weekStart = getMondayOfCurrentWeek()

  return useQuery({
    queryKey: [...retosKeys.all, 'completed-count', userId, weekStart],
    queryFn: async (): Promise<number> => {
      const { data, error } = await (supabase as any)
        .from('user_weekly_challenges')
        .select('id')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .eq('status', 'completed')

      if (error) throw error
      return (data ?? []).length
    },
    enabled: !!userId,
    staleTime: 30_000,
  })
}

export function useStartChallenge() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (templateId: string): Promise<UserWeeklyChallenge> => {
      if (!user?.id) throw new Error('Not authenticated')
      const weekStart = getMondayOfCurrentWeek()

      const { data, error } = await (supabase as any)
        .from('user_weekly_challenges')
        .insert({
          user_id: user.id,
          template_id: templateId,
          week_start: weekStart,
          status: 'active',
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data as UserWeeklyChallenge
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retosKeys.all })
    },
  })
}

export function useCompleteChallenge() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      challengeId,
      template,
    }: {
      challengeId: string
      template: ChallengeTemplate
    }): Promise<void> => {
      if (!user?.id) throw new Error('Not authenticated')

      // Mark challenge as completed
      const { error: updateError } = await (supabase as any)
        .from('user_weekly_challenges')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', challengeId)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      // Award mastery to the relevant domain (or 'control' as fallback)
      const domain = template.target_domain ?? 'control'
      const { error: growError } = await supabase.rpc('grow_plant', {
        p_user_id: user.id,
        p_domain: domain,
        p_mastery_delta: Number(template.target_mastery_delta),
      })
      if (growError) throw growError

      // Award coins
      const { error: coinError } = await supabase.rpc('award_coins', {
        p_user_id: user.id,
        p_amount: template.reward_coins,
        p_reason: `Reto completado: ${template.title}`,
      })
      if (coinError) throw coinError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retosKeys.all })
    },
  })
}
