import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface GameStat {
  highScore: number;
  timesPlayed: number;
  lastPlayedAt: string | null;
}

interface AttemptRow {
  activity_type: string | null;
  score: number | null;
  completed_at: string | null;
}

const STALE_TIME_MS = 60_000;

async function fetchGameStats(userId: string): Promise<Record<string, GameStat>> {
  const { data, error } = await supabase
    .from('user_activity_attempts')
    // The table has evolving schemas; we request the fields the minigame flow uses.
    .select('activity_type, score, completed_at')
    .eq('user_id', userId);

  if (error || !data) return {};

  const rows = data as unknown as AttemptRow[];
  const acc: Record<string, GameStat> = {};

  for (const row of rows) {
    if (!row.activity_type) continue;
    const gameId = row.activity_type.replace(/_/g, '-');
    const score = typeof row.score === 'number' ? row.score : 0;
    const completedAt = row.completed_at ?? null;

    const current = acc[gameId];
    if (!current) {
      acc[gameId] = {
        highScore: score,
        timesPlayed: 1,
        lastPlayedAt: completedAt,
      };
      continue;
    }

    acc[gameId] = {
      highScore: Math.max(current.highScore, score),
      timesPlayed: current.timesPlayed + 1,
      lastPlayedAt: pickLatestDate(current.lastPlayedAt, completedAt),
    };
  }

  return acc;
}

function pickLatestDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
}

export function useGameStats(): Record<string, GameStat> {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const { data } = useQuery({
    queryKey: ['minigames', 'stats', userId],
    queryFn: () => fetchGameStats(userId as string),
    enabled: !!userId,
    staleTime: STALE_TIME_MS,
  });

  return data ?? {};
}
