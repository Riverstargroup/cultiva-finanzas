import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Flashcard } from '../types'

export const flashcardKeys = {
  all: ['flashcards'] as const,
  due: (userId: string) => [...flashcardKeys.all, 'due', userId] as const,
}

export function useDueCards() {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  return useQuery({
    queryKey: flashcardKeys.due(userId),
    queryFn: async (): Promise<Flashcard[]> => {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_at', now)
        .order('next_review_at', { ascending: true })
      if (error) throw error
      return (data ?? []) as Flashcard[]
    },
    enabled: !!userId,
    staleTime: 30_000,
  })
}
