import { supabase } from "@/integrations/supabase/client";
import { TAG_SKILL_MAP } from "./tagSkillMap";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function updateSkillsOnCompletion(
  userId: string,
  tags: string[],
  lastScore: number,
  isFirstCompletion: boolean
): Promise<void> {
  if (!isFirstCompletion) return;

  // Determine unique skill IDs from tags
  const skillIds = new Set<string>();
  for (const tag of tags) {
    const mapped = TAG_SKILL_MAP[tag];
    if (mapped) mapped.forEach((s) => skillIds.add(s));
  }
  if (skillIds.size === 0) return;

  const delta = clamp(0.08 + 0.22 * lastScore, 0.08, 0.30);

  // Fetch existing user_skills for these skill IDs
  const { data: existing } = await supabase
    .from("user_skills" as any)
    .select("skill_id, mastery")
    .eq("user_id", userId)
    .in("skill_id", Array.from(skillIds));

  const existingMap = new Map<string, number>();
  if (existing) {
    for (const row of existing as any[]) {
      existingMap.set(row.skill_id, Number(row.mastery));
    }
  }

  // Upsert each skill
  for (const skillId of skillIds) {
    const oldMastery = existingMap.get(skillId) ?? 0;
    const newMastery = Math.min(1.0, oldMastery + delta);
    const status = newMastery >= 0.8 ? "mastered" : "unlocked";

    await supabase
      .from("user_skills" as any)
      .upsert(
        {
          user_id: userId,
          skill_id: skillId,
          mastery: newMastery,
          status,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: "user_id,skill_id" }
      );
  }
}
