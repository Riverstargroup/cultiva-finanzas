import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Scenario } from "@/types/learning";

export function useScenario(scenarioId: string | undefined) {
  return useQuery({
    queryKey: ["scenario", scenarioId],
    enabled: !!scenarioId,
    queryFn: async (): Promise<Scenario | null> => {
      if (!scenarioId) return null;
      const { data, error } = await supabase
        .from("scenarios" as any)
        .select("*")
        .eq("id", scenarioId)
        .single();
      if (error) return null;
      return data as unknown as Scenario;
    },
  });
}
