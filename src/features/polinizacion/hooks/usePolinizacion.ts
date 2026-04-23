import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { PollinationSession, SkillDomain } from '../types'

// ---- Query keys ------------------------------------------------

export const polinizacionKeys = {
  all: ['polinizacion'] as const,
  todaySession: (userId: string) => [...polinizacionKeys.all, 'today', userId] as const,
  allSessions: (userId: string) => [...polinizacionKeys.all, 'sessions', userId] as const,
}

// ---- Helpers ---------------------------------------------------

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

// ---- Hooks -----------------------------------------------------

export function useTodaySession(userId: string) {
  const today = getTodayDateString()

  return useQuery({
    queryKey: polinizacionKeys.todaySession(userId),
    queryFn: async (): Promise<PollinationSession | null> => {
      const { data, error } = await (supabase as any)
        .from('user_pollination_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_date', today)
        .maybeSingle()

      if (error) throw error
      return (data ?? null) as PollinationSession | null
    },
    enabled: !!userId,
    staleTime: 60_000,
  })
}

export function useSessionCount(userId: string) {
  return useQuery({
    queryKey: polinizacionKeys.allSessions(userId),
    queryFn: async (): Promise<number> => {
      const { data, error } = await (supabase as any)
        .from('user_pollination_sessions')
        .select('id')
        .eq('user_id', userId)

      if (error) throw error
      return (data ?? []).length
    },
    enabled: !!userId,
    staleTime: 60_000,
  })
}

export function useSubmitInsight() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      domainLearned,
      insight,
    }: {
      domainLearned: SkillDomain
      insight: string
    }): Promise<PollinationSession> => {
      if (!user?.id) throw new Error('Not authenticated')

      const today = getTodayDateString()

      // Insert session
      const { data, error } = await (supabase as any)
        .from('user_pollination_sessions')
        .insert({
          user_id: user.id,
          session_date: today,
          domain_learned: domainLearned,
          insight,
          coins_earned: 20,
        })
        .select()
        .single()

      if (error) throw error

      // Award coins
      const { error: coinError } = await supabase.rpc('award_coins', {
        p_user_id: user.id,
        p_delta: 20,
        p_reason: 'Polinización cruzada completada',
      })
      if (coinError) throw coinError

      // Grow plant in the learned domain
      const { error: growError } = await supabase.rpc('grow_plant', {
        p_user_id: user.id,
        p_domain: domainLearned,
        p_mastery_delta: 0.02,
      })
      if (growError) throw growError

      return data as PollinationSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: polinizacionKeys.all })
    },
  })
}
