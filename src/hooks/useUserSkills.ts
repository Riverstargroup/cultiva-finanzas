import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserSkill } from "@/types/learning";

export function useUserSkills() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-skills", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<UserSkill[]> => {
      const { data, error } = await supabase
        .from("user_skills" as any)
        .select("*")
        .eq("user_id", user!.id);

      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}
