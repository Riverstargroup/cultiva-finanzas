import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Target, Check, SkipForward } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { supabase } from "@/integrations/supabase/client";
import type { ScenarioOption } from "@/types/learning";

interface FeedbackStepProps {
  coaching: string;
  selectedOption: ScenarioOption;
  mission?: string | null;
  scenarioId?: string;
  userId?: string;
  missionStatus?: string | null; // 'pending' | 'done' | 'skipped' | null
  onContinue: () => void;
}

export default function FeedbackStep({ coaching, selectedOption, mission, scenarioId, userId, missionStatus: initialStatus, onContinue }: FeedbackStepProps) {
  const reduced = useReducedMotion();
  const [missionStatus, setMissionStatus] = useState<string | null>(initialStatus ?? null);
  const [saving, setSaving] = useState(false);

  const handleMission = async (status: "done" | "skipped") => {
    if (!userId || !scenarioId || saving) return;
    setSaving(true);
    try {
      await supabase
        .from("user_missions" as any)
        .upsert(
          {
            user_id: userId,
            scenario_id: scenarioId,
            status,
            done_at: status === "done" ? new Date().toISOString() : null,
          } as any,
          { onConflict: "user_id,scenario_id" }
        );
      setMissionStatus(status);
    } catch (err) {
      console.error("Error saving mission:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Selected option feedback */}
      <div
        className="organic-card p-4"
        style={{
          borderColor: selectedOption.is_best ? "var(--leaf-bright)" : "var(--terracotta-vivid)",
          background: selectedOption.is_best
            ? "color-mix(in srgb, var(--leaf-fresh) 8%, transparent)"
            : "color-mix(in srgb, var(--terracotta-vivid) 5%, transparent)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: selectedOption.is_best ? "var(--leaf-bright)" : "var(--terracotta-vivid)" }}>
          {selectedOption.is_best ? "✓ Buena elección" : "✗ No es la mejor opción"}
        </p>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-warm)" }}>
          {selectedOption.feedback}
        </p>
      </div>

      {/* Coaching */}
      <div className="organic-card p-5">
        <div className="flex items-start gap-3">
          <div
            className="organic-border h-9 w-9 flex items-center justify-center flex-shrink-0"
            style={{ background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)" }}
          >
            <MessageCircle className="h-4 w-4" style={{ color: "var(--leaf-bright)" }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--leaf-muted)" }}>
              Coach
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-warm)" }}>
              {coaching}
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      {mission && (
        <div className="organic-card p-4" style={{ background: "color-mix(in srgb, var(--soil-warm) 60%, transparent)" }}>
          <div className="flex items-start gap-3">
            <Target className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--terracotta-vivid)" }} />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--terracotta-vivid)" }}>
                Mini misión (1-2 min)
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-warm)" }}>
                {mission}
              </p>

              {/* Mission action buttons */}
              {userId && scenarioId && (
                <div className="mt-3">
                  {missionStatus === "done" ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" style={{ color: "var(--leaf-bright)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--leaf-bright)" }}>
                        Misión completada
                      </span>
                    </div>
                  ) : missionStatus === "skipped" ? (
                    <p className="text-xs" style={{ color: "var(--leaf-muted)" }}>Misión omitida</p>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMission("done")}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[40px]"
                        style={{
                          background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)",
                          border: "1.5px solid var(--leaf-bright)",
                          color: "var(--leaf-bright)",
                        }}
                      >
                        <Check className="h-3.5 w-3.5" /> Marcar como hecha
                      </button>
                      <button
                        onClick={() => handleMission("skipped")}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[40px]"
                        style={{
                          border: "1.5px solid var(--clay-soft)",
                          color: "var(--leaf-muted)",
                        }}
                      >
                        <SkipForward className="h-3.5 w-3.5" /> Omitir
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button onClick={onContinue} className="vibrant-btn w-full justify-center min-h-[44px] font-bold">
        Continuar al repaso
      </button>
    </motion.div>
  );
}
