import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Course } from "@/types/learning";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    staleTime: 300_000,
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses" as any)
        .select("*")
        .eq("is_published", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Course[];
    },
  });
}
