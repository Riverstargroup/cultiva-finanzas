import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScenarioCard, { type ScenarioStatus } from "@/components/ScenarioCard";
import BotanicalPage from "@/components/layout/BotanicalPage";
import ContinueBanner from "@/components/courses/ContinueBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseDetail } from "@/hooks/useCourseDetail";
import { useProgress } from "@/hooks/useProgress";
import { estimatedXp } from "@/lib/courseMeta";

type LevelKey = "basico" | "intermedio" | "avanzado";
function toLevelKey(level: string): LevelKey {
  const normalized = level.toLowerCase();
  if (normalized === "intermedio" || normalized === "medio") return "intermedio";
  if (normalized === "avanzado" || normalized === "dificil" || normalized === "difícil") return "avanzado";
  return "basico";
}

function CourseDetailSkeleton() {
  return (
    <BotanicalPage title="Cargando curso..." subtitle="">
      <div className="organic-card p-5 space-y-4">
        <Skeleton className="h-5 w-20 rounded-full" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
        <Skeleton className="h-4 w-full" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
        <Skeleton className="h-4 w-4/5" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
        <Skeleton className="h-2 w-full rounded-full" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="organic-card p-4 flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
              <Skeleton className="h-3 w-full" style={{ background: "color-mix(in srgb, var(--clay-soft) 80%, transparent)" }} />
            </div>
          </div>
        ))}
      </div>
    </BotanicalPage>
  );
}

export default function CursoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading } = useCourseDetail(id);
  const { data: progress } = useProgress(id);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <BotanicalPage title="Error" subtitle="">
        <div className="text-center py-8">
          <p style={{ color: "var(--leaf-muted)" }}>Curso no encontrado.</p>
          <button className="vibrant-btn mt-4 min-h-[44px]" onClick={() => navigate("/cursos")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a cursos
          </button>
        </div>
      </BotanicalPage>
    );
  }

  const completedIds = progress?.courseProgress?.completed_scenarios ?? [];
  const scenarioStates = progress?.scenarioStates ?? [];
  const completedCount = completedIds.length;
  const progressPct = Math.round((completedCount / course.scenarios.length) * 100);

  // Mastery: scenarios with last_score >= 0.8
  const masteredCount = scenarioStates.filter((s) => s.last_score >= 0.8).length;

  const getStatus = (index: number): ScenarioStatus => {
    const sid = course.scenarios[index].id;
    if (completedIds.includes(sid)) {
      const state = scenarioStates.find((s) => s.scenario_id === sid);
      if (state && state.last_score >= 0.8) return "mastered";
      return "completed";
    }
    // First uncompleted is in_progress, rest locked
    const firstUncompletedIdx = course.scenarios.findIndex(
      (s) => !completedIds.includes(s.id)
    );
    return index === firstUncompletedIdx ? "in_progress" : "locked";
  };

  const nextScenario = course.scenarios.find((s) => !completedIds.includes(s.id));
  const levelKey = toLevelKey(course.level);
  const showContinueBanner = completedCount > 0 && progressPct < 100;

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <BotanicalPage title={course.title} subtitle={`${course.scenarios.length} semillas · ~${course.estimated_minutes} min`}>
      {showContinueBanner && nextScenario && (
        <ContinueBanner
          courseId={course.id}
          courseTitle={course.title}
          progressPct={progressPct}
          nextScenarioTitle={nextScenario.title}
          onContinue={() => navigate(`/cursos/${course.id}/escenario/${nextScenario.id}`)}
        />
      )}
      {/* Back */}
      <button
        onClick={() => navigate("/cursos")}
        className="flex items-center gap-2 text-sm font-semibold min-h-[44px]"
        style={{ color: "var(--leaf-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" /> Cursos
      </button>

      {/* Hero */}
      <div className="organic-card p-5 md:p-6 space-y-4">
        <span
          className="text-xs capitalize font-semibold px-3 py-1 rounded-full border inline-block"
          style={{ background: "var(--soil-warm)", color: "var(--forest-deep)", borderColor: "var(--clay-soft)" }}
        >
          {course.level}
        </span>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-warm)" }}>
          {course.description}
        </p>

        {/* Progress bars */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs" style={{ color: "var(--leaf-muted)" }}>
            <span>Completado</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--clay-soft)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: "var(--leaf-bright)" }} />
          </div>
          {masteredCount > 0 && (
            <>
              <div className="flex justify-between text-xs" style={{ color: "var(--leaf-muted)" }}>
                <span>Dominado</span>
                <span>{Math.round((masteredCount / course.scenarios.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--clay-soft)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(masteredCount / course.scenarios.length) * 100}%`, background: "var(--forest-deep)" }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-3">
        <h2 className="font-heading font-bold text-lg" style={{ color: "var(--forest-deep)" }}>
          Semillas
        </h2>
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          {course.scenarios.map((s, i) => (
            <motion.div key={s.id} variants={item}>
              <ScenarioCard
                index={i + 1}
                title={s.title}
                description={s.prompt.substring(0, 80) + "..."}
                status={getStatus(i)}
                onClick={() => navigate(`/cursos/${course.id}/escenario/${s.id}`)}
                estimatedXp={estimatedXp(i, levelKey)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      {nextScenario && (
        <button
          className="vibrant-btn w-full sm:w-auto justify-center min-h-[44px] font-bold"
          onClick={() => navigate(`/cursos/${course.id}/escenario/${nextScenario.id}`)}
        >
          {completedCount === 0 ? "Comenzar curso" : "Continuar"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      )}
    </BotanicalPage>
  );
}
