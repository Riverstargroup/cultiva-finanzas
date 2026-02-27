import { motion } from "framer-motion";
import { MessageCircle, Target } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ScenarioOption } from "@/types/learning";

interface FeedbackStepProps {
  coaching: string;
  selectedOption: ScenarioOption;
  mission?: string | null;
  onContinue: () => void;
}

export default function FeedbackStep({ coaching, selectedOption, mission, onContinue }: FeedbackStepProps) {
  const reduced = useReducedMotion();

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
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--terracotta-vivid)" }}>
                Mini misión (1-2 min)
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-warm)" }}>
                {mission}
              </p>
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
