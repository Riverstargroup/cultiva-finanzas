import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { unlockBadge } from "@/lib/achievementChecker";
import type { UserAchievement } from "@/types/learning";

export function useAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["achievements", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<UserAchievement[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_achievements" as any)
        .select("*")
        .eq("user_id", user.id);
      if (error) return [];
      return (data ?? []) as unknown as UserAchievement[];
    },
  });

  const unlock = async (badgeId: string) => {
    if (!user) return false;
    const success = await unlockBadge(user.id, badgeId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["achievements", user.id] });
    }
    return success;
  };

  return { ...query, unlock };
}
