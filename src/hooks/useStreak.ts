import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useStreak() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streak", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<number> => {
      if (!user) return 0;

      const { data, error } = await supabase
        .from("user_activity_days" as any)
        .select("day")
        .eq("user_id", user.id)
        .order("day", { ascending: false })
        .limit(60);

      if (error || !data || data.length === 0) return 0;

      const days = (data as any[]).map((d) => d.day as string).sort().reverse();

      // Calculate streak from today or yesterday
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let streak = 0;
      let checkDate: Date;

      if (days[0] === todayStr) {
        checkDate = today;
      } else if (days[0] === yesterdayStr) {
        checkDate = yesterday;
      } else {
        return 0;
      }

      const daySet = new Set(days);
      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (daySet.has(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    },
  });
}
