import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Course, Scenario } from "@/types/learning";

export interface CourseDetail extends Course {
  scenarios: Scenario[];
}

export function useCourseDetail(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course-detail", courseId],
    enabled: !!courseId,
    queryFn: async (): Promise<CourseDetail | null> => {
      if (!courseId) return null;

      const { data: course, error: cErr } = await supabase
        .from("courses" as any)
        .select("*")
        .eq("id", courseId)
        .single();
      if (cErr || !course) return null;

      const { data: scenarios, error: sErr } = await supabase
        .from("scenarios" as any)
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");
      if (sErr) throw sErr;

      return {
        ...(course as unknown as Course),
        scenarios: (scenarios ?? []) as unknown as Scenario[],
      };
    },
  });
}
