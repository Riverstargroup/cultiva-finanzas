import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ScenarioOption } from "@/types/learning";

interface DecisionStepProps {
  prompt: string;
  options: ScenarioOption[];
  onSelect: (option: ScenarioOption) => void;
}

export default function DecisionStep({ prompt, options, onSelect }: DecisionStepProps) {
  const reduced = useReducedMotion();

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed" style={{ color: "var(--text-warm)" }}>
        {prompt}
      </p>
      <div className="space-y-3">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            whileTap={!reduced ? { scale: 0.98 } : undefined}
            onClick={() => onSelect(opt)}
            className="w-full text-left organic-card p-4 min-h-[44px] transition-all hover:shadow-md"
            style={{ borderColor: "var(--clay-soft)" }}
          >
            <p className="font-medium leading-relaxed" style={{ color: "var(--forest-deep)" }}>
              {opt.text}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
