import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { COURSES_LIST, type ScenarioOption } from "@/data/placeholders";

export default function Escenario() {
  const { courseId, scenarioId } = useParams<{ courseId: string; scenarioId: string }>();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const course = COURSES_LIST.find((c) => c.id === courseId);
  const scenario = course?.scenarios.find((s) => s.id === scenarioId);
  const scenarioIndex = course?.scenarios.findIndex((s) => s.id === scenarioId) ?? -1;

  if (!course || !scenario) {
    return (
      <PageTransition>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Escenario no encontrado.</p>
          <Button variant="ghost" onClick={() => navigate("/cursos")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </div>
      </PageTransition>
    );
  }

  const selected = scenario.options.find((o) => o.id === selectedOption);
  const isLast = scenarioIndex === course.scenarios.length - 1;
  const nextScenario = !isLast ? course.scenarios[scenarioIndex + 1] : null;

  const handleSelect = (opt: ScenarioOption) => {
    if (selectedOption) return; // already picked
    setSelectedOption(opt.id);
    // Phase 3: update progress + check achievements here
  };

  const handleNext = () => {
    if (nextScenario) {
      setSelectedOption(null);
      navigate(`/cursos/${course.id}/escenario/${nextScenario.id}`, { replace: true });
    } else {
      navigate(`/cursos/${course.id}`);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Button variant="ghost" size="sm" onClick={() => navigate(`/cursos/${course.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {course.title}
        </Button>

        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Escenario {scenarioIndex + 1} de {course.scenarios.length}
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {scenario.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {scenario.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isRevealed = selectedOption !== null;

            return (
              <motion.div
                key={opt.id}
                whileTap={!isRevealed && !reduced ? { scale: 0.98 } : undefined}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all min-h-[44px] border-2 ${
                    isSelected
                      ? opt.is_best
                        ? "border-primary bg-primary/5"
                        : "border-destructive/50 bg-destructive/5"
                      : isRevealed
                        ? opt.is_best
                          ? "border-primary/30 opacity-60"
                          : "border-border/50 opacity-40"
                        : "border-border/50 hover:border-primary/40"
                  }`}
                  onClick={() => handleSelect(opt)}
                >
                  <p className="font-medium text-foreground leading-relaxed">{opt.text}</p>

                  <AnimatePresence>
                    {isRevealed && (isSelected || opt.is_best) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: reduced ? 0.1 : 0.25 }}
                        className="mt-3 pt-3 border-t border-border/50"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2
                            className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              opt.is_best ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {opt.feedback}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Next */}
        <AnimatePresence>
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: reduced ? 0.1 : 0.25 }}
            >
              <Button
                size="lg"
                className="rounded-full px-8 font-bold shadow-lg min-h-[44px] w-full sm:w-auto"
                onClick={handleNext}
              >
                {isLast ? "Finalizar curso" : "Siguiente escenario"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
