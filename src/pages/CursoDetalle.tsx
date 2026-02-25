import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ScenarioCard, { type ScenarioStatus } from "@/components/ScenarioCard";
import PageTransition from "@/components/PageTransition";
import { COURSES_LIST } from "@/data/placeholders";

// Placeholder — Phase 3 replaces with real data
const completedScenarioIds: string[] = [];

export default function CursoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const course = COURSES_LIST.find((c) => c.id === id);
  if (!course) {
    return (
      <PageTransition>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Curso no encontrado.</p>
          <Button variant="ghost" onClick={() => navigate("/cursos")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a cursos
          </Button>
        </div>
      </PageTransition>
    );
  }

  const completedCount = completedScenarioIds.length;
  const progress = Math.round((completedCount / course.scenarios.length) * 100);

  const getStatus = (index: number): ScenarioStatus => {
    const sid = course.scenarios[index].id;
    if (completedScenarioIds.includes(sid)) return "completed";
    // First uncompleted is in_progress, rest locked
    const firstUncompletedIdx = course.scenarios.findIndex(
      (s) => !completedScenarioIds.includes(s.id)
    );
    return index === firstUncompletedIdx ? "in_progress" : "locked";
  };

  const nextScenario = course.scenarios.find((s) => !completedScenarioIds.includes(s.id));

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => navigate("/cursos")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Cursos
        </Button>

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 p-6 md:p-8 space-y-3">
          <Badge variant="outline" className="capitalize">
            {course.difficulty}
          </Badge>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {course.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            {course.description}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{course.scenarios.length} escenarios</span>
            <span>·</span>
            <span>~{course.duration_min} min</span>
          </div>
          <div className="max-w-xs space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Scenarios */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-foreground">Escenarios</h2>
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
            {course.scenarios.map((s, i) => (
              <motion.div key={s.id} variants={item}>
                <ScenarioCard
                  index={i + 1}
                  title={s.title}
                  description={s.description}
                  status={getStatus(i)}
                  onClick={() => navigate(`/cursos/${course.id}/escenario/${s.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        {nextScenario && (
          <Button
            size="lg"
            className="rounded-full px-8 font-bold shadow-lg min-h-[44px]"
            onClick={() => navigate(`/cursos/${course.id}/escenario/${nextScenario.id}`)}
          >
            {completedCount === 0 ? "Comenzar curso" : "Continuar"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </PageTransition>
  );
}
