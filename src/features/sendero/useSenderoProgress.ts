import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useGameStats } from '@/features/minigames/hooks/useGameStats'
import {
  SENDERO_PHASE_ONE_NODES,
  type SenderoNode,
  type SenderoNodeStatus,
} from './senderoNodes'

const USER_COURSE_PROGRESS_TABLE = 'user_course_progress' as never

interface CourseProgressRow {
  completed_scenarios: string[] | null
}

export interface SenderoProgressState {
  completedScenarios: number
  nodes: SenderoNode[]
}

export function useSenderoProgress(): SenderoProgressState {
  const { user } = useAuth()
  const gameStats = useGameStats()

  const { data: completedScenarios = 0 } = useQuery({
    queryKey: ['sendero-progress', user?.id],
    enabled: !!user?.id,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(USER_COURSE_PROGRESS_TABLE)
        .select('completed_scenarios')
        .eq('user_id', user!.id)

      if (error || !data) return 0

      return (data as unknown as CourseProgressRow[]).reduce(
        (total, row) => total + (row.completed_scenarios?.length ?? 0),
        0,
      )
    },
  })

  const nodes = useMemo(
    () =>
      SENDERO_PHASE_ONE_NODES.map((node) => ({
        ...node,
        status: resolveNodeStatus(node, completedScenarios, gameStats[node.gameId ?? '']?.timesPlayed ?? 0),
      })),
    [completedScenarios, gameStats],
  )

  return { completedScenarios, nodes }
}

function resolveNodeStatus(
  node: SenderoNode,
  completedScenarios: number,
  timesPlayed: number,
): SenderoNodeStatus {
  if (node.type === 'boss') {
    return completedScenarios >= (node.requiredCompletedScenarios ?? 0) ? 'boss' : 'locked'
  }

  if (node.type === 'lesson') {
    return completedScenarios > 0 ? 'completed' : 'next'
  }

  if (node.gameId) {
    if (completedScenarios < (node.requiredCompletedScenarios ?? 0)) return 'locked'
    return timesPlayed > 0 ? 'completed' : 'next'
  }

  if (completedScenarios < (node.requiredCompletedScenarios ?? 0)) return 'locked'

  if (node.type === 'chest' || node.type === 'home') {
    return completedScenarios >= (node.requiredCompletedScenarios ?? 0) ? 'available' : 'locked'
  }

  return node.status
}
