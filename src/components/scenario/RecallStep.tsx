import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { RecallQuestion } from "@/types/learning";

interface RecallStepProps {
  questions: RecallQuestion[];
  onComplete: (correctCount: number, total: number) => void;
}

export default function RecallStep({ questions, onComplete }: RecallStepProps) {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[currentIndex];
  if (!current) return null;

  const isAnswered = selectedId !== null;
  const isCorrect = selectedId === current.correct_choice_id;
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (choiceId: string) => {
    if (isAnswered) return;
    setSelectedId(choiceId);
    if (choiceId === current.correct_choice_id) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalCorrect = correctCount + (isCorrect ? 0 : 0); // already counted
      onComplete(correctCount, questions.length);
    } else {
      setSelectedId(null);
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <motion.div
      key={currentIndex}
      initial={reduced ? undefined : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--leaf-muted)" }}>
          Pregunta {currentIndex + 1} de {questions.length}
        </p>
      </div>

      <p className="font-heading font-bold text-lg leading-relaxed" style={{ color: "var(--forest-deep)" }}>
        {current.question}
      </p>

      <div className="space-y-2">
        {current.choices.map((choice) => {
          const isThis = selectedId === choice.id;
          const isCorrectChoice = choice.id === current.correct_choice_id;

          let borderColor = "var(--clay-soft)";
          let bg = "transparent";
          if (isAnswered) {
            if (isCorrectChoice) {
              borderColor = "var(--leaf-bright)";
              bg = "color-mix(in srgb, var(--leaf-fresh) 8%, transparent)";
            } else if (isThis && !isCorrectChoice) {
              borderColor = "var(--terracotta-vivid)";
              bg = "color-mix(in srgb, var(--terracotta-vivid) 5%, transparent)";
            }
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              disabled={isAnswered}
              className="w-full text-left organic-card p-3.5 min-h-[44px] transition-all flex items-center gap-3"
              style={{ borderColor, background: bg }}
            >
              {isAnswered && isCorrectChoice && (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "var(--leaf-bright)" }} />
              )}
              {isAnswered && isThis && !isCorrectChoice && (
                <XCircle className="h-4 w-4 flex-shrink-0" style={{ color: "var(--terracotta-vivid)" }} />
              )}
              <span className="text-sm leading-relaxed" style={{ color: "var(--forest-deep)" }}>
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="organic-card p-4"
          style={{
            background: isCorrect
              ? "color-mix(in srgb, var(--leaf-fresh) 8%, transparent)"
              : "color-mix(in srgb, var(--terracotta-vivid) 5%, transparent)",
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-warm)" }}>
            {current.explanation}
          </p>
        </motion.div>
      )}

      {isAnswered && (
        <button onClick={handleNext} className="vibrant-btn w-full justify-center min-h-[44px] font-bold">
          {isLast ? "Ver resultado" : "Siguiente pregunta"}
        </button>
      )}
    </motion.div>
  );
}
