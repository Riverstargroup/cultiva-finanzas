import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export function useDailyLock() {
  const { user } = useAuth()

  const { data: isLocked = false, isLoading } = useQuery({
    queryKey: ['pollination-lock', user?.id],
    queryFn: async () => {
      if (!user?.id) return false
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('user_pollination_sessions')
        .select('id')
        .eq('user_id', user.id)
        .gte('completed_at', today + 'T00:00:00')
        .not('completed_at', 'is', null)
        .maybeSingle()
      return !!data
    },
    enabled: !!user?.id,
    staleTime: 60_000,
  })

  return { isLocked, isLoading }
}
