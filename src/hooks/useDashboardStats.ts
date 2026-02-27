import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BADGES } from "@/data/placeholders";

export interface DashboardStats {
  completedScenarios: number;
  totalMinutes: number;
  badgesUnlocked: number;
  totalBadges: number;
  streak: number;
  weeklyMinutes: { day: string; full: string; minutos: number }[];
}

const DAY_NAMES: Record<number, { short: string; full: string }> = {
  0: { short: "Dom", full: "Domingo" },
  1: { short: "Lun", full: "Lunes" },
  2: { short: "Mar", full: "Martes" },
  3: { short: "Mié", full: "Miércoles" },
  4: { short: "Jue", full: "Jueves" },
  5: { short: "Vie", full: "Viernes" },
  6: { short: "Sáb", full: "Sábado" },
};

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboard-stats", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<DashboardStats> => {
      if (!user)
        return {
          completedScenarios: 0,
          totalMinutes: 0,
          badgesUnlocked: 0,
          totalBadges: BADGES.length,
          streak: 0,
          weeklyMinutes: [],
        };

      // Fetch all in parallel
      const [progressRes, activityRes, achievementsRes] = await Promise.all([
        supabase
          .from("user_course_progress" as any)
          .select("completed_scenarios")
          .eq("user_id", user.id),
        supabase
          .from("user_activity_days" as any)
          .select("day, minutes")
          .eq("user_id", user.id)
          .order("day", { ascending: false })
          .limit(60),
        supabase
          .from("user_achievements" as any)
          .select("badge_id")
          .eq("user_id", user.id),
      ]);

      // Completed scenarios count
      const completedScenarios = (progressRes.data ?? []).reduce(
        (sum: number, p: any) => sum + ((p.completed_scenarios as string[])?.length ?? 0),
        0
      );

      // Total minutes
      const activityDays = (activityRes.data ?? []) as any[];
      const totalMinutes = activityDays.reduce(
        (sum: number, d: any) => sum + (d.minutes ?? 0),
        0
      );

      // Badges
      const badgesUnlocked = (achievementsRes.data ?? []).length;

      // Streak
      const dayStrings = activityDays.map((d: any) => d.day as string).sort().reverse();
      let streak = 0;
      if (dayStrings.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toLocaleDateString('en-CA');
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString('en-CA');

        let checkDate: Date;
        if (dayStrings[0] === todayStr) {
          checkDate = today;
        } else if (dayStrings[0] === yesterdayStr) {
          checkDate = yesterday;
        } else {
          checkDate = today; // will yield 0
        }

        const daySet = new Set(dayStrings);
        if (dayStrings[0] === todayStr || dayStrings[0] === yesterdayStr) {
          while (true) {
            const dateStr = checkDate.toLocaleDateString('en-CA');
            if (daySet.has(dateStr)) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
      }

      // Weekly minutes (last 7 days)
      const weeklyMinutes: DashboardStats["weeklyMinutes"] = [];
      const dayMap = new Map(activityDays.map((d: any) => [d.day, d.minutes ?? 0]));
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');
        const dayOfWeek = d.getDay();
        const names = DAY_NAMES[dayOfWeek];
        weeklyMinutes.push({
          day: names.short,
          full: names.full,
          minutos: dayMap.get(dateStr) ?? 0,
        });
      }

      return {
        completedScenarios,
        totalMinutes,
        badgesUnlocked,
        totalBadges: BADGES.length,
        streak,
        weeklyMinutes,
      };
    },
  });
}
