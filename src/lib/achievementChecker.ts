import { supabase } from "@/integrations/supabase/client";

export interface AchievementContext {
  userId: string;
  completedScenarios: string[];
  totalScenarios: number;
  currentScenarioTags?: string[];
  currentScenarioTitle?: string;
  streak?: number;
}

const BADGE_RULES: {
  id: string;
  check: (ctx: AchievementContext) => boolean;
}[] = [
  {
    id: "first_steps",
    check: (ctx) => ctx.completedScenarios.length >= 1,
  },
  {
    id: "steady_learner",
    check: (ctx) => ctx.completedScenarios.length >= 3,
  },
  {
    id: "financial_master",
    check: (ctx) =>
      ctx.totalScenarios > 0 &&
      ctx.completedScenarios.length >= ctx.totalScenarios,
  },
  {
    id: "debt_expert",
    check: (ctx) =>
      (ctx.currentScenarioTags?.includes("deuda") ?? false) ||
      (ctx.currentScenarioTitle?.toLowerCase().includes("tarjeta") ?? false) ||
      (ctx.currentScenarioTitle?.toLowerCase().includes("deuda") ?? false),
  },
  {
    id: "saver",
    check: (ctx) =>
      (ctx.currentScenarioTags?.includes("ahorro") ?? false) ||
      (ctx.currentScenarioTitle?.toLowerCase().includes("fondo") ?? false) ||
      (ctx.currentScenarioTitle?.toLowerCase().includes("ahorro") ?? false),
  },
  {
    id: "streak_3",
    check: (ctx) => (ctx.streak ?? 0) >= 3,
  },
  {
    id: "streak_7",
    check: (ctx) => (ctx.streak ?? 0) >= 7,
  },
];

/**
 * Check and unlock achievements idempotently.
 * Uses ON CONFLICT DO NOTHING via upsert.
 */
export async function checkAndUnlockAchievements(
  ctx: AchievementContext
): Promise<string[]> {
  const unlocked: string[] = [];

  for (const rule of BADGE_RULES) {
    if (rule.check(ctx)) {
      const { error } = await supabase
        .from("user_achievements" as any)
        .upsert(
          { user_id: ctx.userId, badge_id: rule.id } as any,
          { onConflict: "user_id,badge_id" }
        );
      if (!error) {
        unlocked.push(rule.id);
      }
    }
  }

  return unlocked;
}

/**
 * Unlock a single badge idempotently.
 */
export async function unlockBadge(
  userId: string,
  badgeId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("user_achievements" as any)
    .upsert(
      { user_id: userId, badge_id: badgeId } as any,
      { onConflict: "user_id,badge_id" }
    );
  return !error;
}
