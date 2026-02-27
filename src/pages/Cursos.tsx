import { useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import BotanicalPage from "@/components/layout/BotanicalPage";
import { BookOpen } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TABS = [
  { key: "todos", label: "Todos" },
  { key: "progreso", label: "En progreso" },
  { key: "completados", label: "Completados" },
] as const;

export default function Cursos() {
  const [tab, setTab] = useState("todos");
  const { data: coursesRaw, isLoading } = useCourses();
  const { user } = useAuth();

  // Fetch all progress for this user
  const { data: progressData } = useQuery({
    queryKey: ["all-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_course_progress" as any)
        .select("course_id, completed_scenarios, completed_at")
        .eq("user_id", user!.id);
      return (data ?? []) as any[];
    },
  });

  const progressMap = new Map(
    (progressData ?? []).map((p: any) => [p.course_id, p])
  );

  const courses = (coursesRaw ?? []).map((c) => {
    const prog: any = progressMap.get(c.id);
    const completedCount = prog?.completed_scenarios?.length ?? 0;
    // We need scenario count - fetch from course detail would be heavy, use estimated
    // For now approximate from the course
    return { ...c, completedCount, completedAt: prog?.completed_at };
  });

  // We need scenario counts per course - let's fetch them
  const { data: scenarioCounts } = useQuery({
    queryKey: ["scenario-counts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("scenarios" as any)
        .select("course_id");
      const counts: Record<string, number> = {};
      (data ?? []).forEach((s: any) => {
        counts[s.course_id] = (counts[s.course_id] ?? 0) + 1;
      });
      return counts;
    },
  });

  const enriched = courses.map((c) => {
    const scenarioCount = scenarioCounts?.[c.id] ?? 0;
    const progress = scenarioCount > 0 ? Math.round((c.completedCount / scenarioCount) * 100) : 0;
    return { ...c, scenarioCount, progress };
  });

  const filtered =
    tab === "progreso"
      ? enriched.filter((c) => c.progress > 0 && c.progress < 100)
      : tab === "completados"
        ? enriched.filter((c) => c.completedAt !== null)
        : enriched;

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <BotanicalPage title="Cursos" subtitle="Explora y avanza en tu jardín financiero.">
      {/* Organic chip tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all min-h-[44px] ${
              tab === t.key ? "shadow-sm" : "hover:border-[var(--leaf-fresh)]"
            }`}
            style={{
              background: tab === t.key ? "white" : "transparent",
              borderColor: tab === t.key ? "var(--leaf-bright)" : "var(--clay-soft)",
              color: tab === t.key ? "var(--forest-deep)" : "var(--leaf-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="organic-card p-8 text-center">
          <p style={{ color: "var(--leaf-muted)" }}>Cargando cursos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={tab === "todos" ? "Sin cursos disponibles" : tab === "progreso" ? "Ningún curso en progreso" : "Ningún curso completado"}
          description={tab === "todos" ? "Pronto habrá nuevos cursos para ti." : "Inicia un curso para verlo aquí."}
        />
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <motion.div key={c.id} variants={item}>
              <CourseCard
                id={c.id}
                title={c.title}
                description={c.description ?? ""}
                difficulty={c.level}
                progress={c.progress}
                scenarioCount={c.scenarioCount}
                completedCount={c.completedCount}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </BotanicalPage>
  );
}
