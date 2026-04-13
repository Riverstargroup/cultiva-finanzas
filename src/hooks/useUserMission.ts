import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserMission } from "@/types/learning";

export function useUserMission(scenarioId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-mission", user?.id, scenarioId],
    enabled: !!user && !!scenarioId,
    queryFn: async (): Promise<UserMission | null> => {
      const { data, error } = await supabase
        .from("user_missions" as any)
        .select("*")
        .eq("user_id", user!.id)
        .eq("scenario_id", scenarioId!)
        .maybeSingle();

      if (error) throw error;
      return (data as any) ?? null;
    },
  });
}
