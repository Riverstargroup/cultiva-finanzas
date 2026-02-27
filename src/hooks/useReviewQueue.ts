import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserScenarioState } from "@/types/learning";

export function useReviewQueue(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["review-queue", user?.id, courseId],
    enabled: !!user,
    queryFn: async (): Promise<UserScenarioState[]> => {
      if (!user) return [];
      let query = supabase
        .from("user_scenario_state" as any)
        .select("*")
        .eq("user_id", user.id)
        .lte("next_due_at", new Date().toISOString())
        .order("next_due_at");

      if (courseId) {
        query = query.eq("course_id", courseId);
      }

      const { data, error } = await query;
      if (error) return [];
      return (data ?? []) as unknown as UserScenarioState[];
    },
  });
}
