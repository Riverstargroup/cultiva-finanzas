import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserScenarioState } from "@/types/learning";

/**
 * Returns the list of scenarios the current user needs to review TODAY.
 *
 * A scenario is "due for review" when its `next_due_at` timestamp is in the
 * past — calculated by the SM-2 spaced-repetition algorithm each time the
 * user completes a scenario in Escenario.tsx.
 *
 * Returns [] when:
 *  - The user has no overdue scenarios (great — nothing to review)
 *  - The query fails (logged in the console; Dashboard shows an empty queue
 *    rather than crashing)
 *
 * The Dashboard uses the returned array length to show the "Repasar" badge.
 * Pass `courseId` to limit the queue to a single course.
 */
export function useReviewQueue(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["review-queue", user?.id, courseId],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async (): Promise<UserScenarioState[]> => {
      if (!user) return [];

      let query = supabase
        .from("user_scenario_state" as any)
        .select("*")
        .eq("user_id", user.id)
        .lte("next_due_at", new Date().toISOString()) // only overdue scenarios
        .order("next_due_at");                         // oldest-due first

      if (courseId) {
        query = query.eq("course_id", courseId);
      }

      const { data, error } = await query;
      if (error) {
        console.error("useReviewQueue: failed to fetch review queue", error);
        return [];
      }
      return (data ?? []) as unknown as UserScenarioState[];
    },
  });
}
