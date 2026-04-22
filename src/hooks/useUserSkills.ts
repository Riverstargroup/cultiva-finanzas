import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserSkill } from "@/types/learning";

export function useUserSkills() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-skills", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async (): Promise<UserSkill[]> => {
      const { data, error } = await supabase
        .from("user_skills" as any)
        .select("*")
        .eq("user_id", user!.id);

      if (error) {
        console.error("useUserSkills: failed to fetch user_skills", error);
        return [];
      }
      return (data as any[]) ?? [];
    },
  });
}
