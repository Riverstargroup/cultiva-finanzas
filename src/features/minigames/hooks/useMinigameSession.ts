import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

export function useMinigameSession() {
  const { user } = useAuth()

  const saveSession = async (activityType: string, score: number) => {
    if (!user?.id) return
    try {
      await supabase.from('user_activity_attempts').insert({
        user_id: user.id,
        activity_type: activityType,
        score,
        completed_at: new Date().toISOString(),
      })
    } catch {
      // Silently skip if table doesn't exist
    }
  }

  return { saveSession }
}
