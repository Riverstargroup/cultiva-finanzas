import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserCourseProgress, UserScenarioState } from "@/types/learning";

export interface ProgressData {
  courseProgress: UserCourseProgress | null;
  scenarioStates: UserScenarioState[];
}

export function useProgress(courseId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["progress", courseId, user?.id],
    enabled: !!courseId && !!user,
    queryFn: async (): Promise<ProgressData> => {
      if (!courseId || !user) return { courseProgress: null, scenarioStates: [] };

      const [cpRes, ssRes] = await Promise.all([
        supabase
          .from("user_course_progress" as any)
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .maybeSingle(),
        supabase
          .from("user_scenario_state" as any)
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId),
      ]);

      return {
        courseProgress: (cpRes.data as unknown as UserCourseProgress) ?? null,
        scenarioStates: (ssRes.data ?? []) as unknown as UserScenarioState[],
      };
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["progress", courseId, user?.id] });
  };

  return { ...query, invalidate };
}
