import { useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import BotanicalPage from "@/components/layout/BotanicalPage";
import { BookOpen } from "lucide-react";
import { COURSES_LIST } from "@/data/placeholders";

const userProgress: Record<string, { completedCount: number }> = {};

const TABS = [
  { key: "todos", label: "Todos" },
  { key: "progreso", label: "En progreso" },
  { key: "completados", label: "Completados" },
] as const;

export default function Cursos() {
  const [tab, setTab] = useState("todos");

  const courses = COURSES_LIST.map((c) => {
    const prog = userProgress[c.id];
    const completedCount = prog?.completedCount ?? 0;
    const progress = c.scenarios.length > 0 ? Math.round((completedCount / c.scenarios.length) * 100) : 0;
    return { ...c, completedCount, progress };
  });

  const filtered =
    tab === "progreso"
      ? courses.filter((c) => c.progress > 0 && c.progress < 100)
      : tab === "completados"
        ? courses.filter((c) => c.progress === 100)
        : courses;

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <BotanicalPage title="Cursos" subtitle="Explora y avanza en tu jardín financiero.">
      {/* Organic chip tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all min-h-[44px] ${
              tab === t.key
                ? "shadow-sm"
                : "hover:border-[var(--leaf-fresh)]"
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={tab === "todos" ? "Sin cursos disponibles" : tab === "progreso" ? "Ningún curso en progreso" : "Ningún curso completado"}
          description={tab === "todos" ? "Pronto habrá nuevos cursos para ti." : "Inicia un curso para verlo aquí."}
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((c) => (
            <motion.div key={c.id} variants={item}>
              <CourseCard
                id={c.id}
                title={c.title}
                description={c.description}
                difficulty={c.difficulty}
                progress={c.progress}
                scenarioCount={c.scenarios.length}
                completedCount={c.completedCount}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </BotanicalPage>
  );
}
