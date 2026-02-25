import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import PageTransition from "@/components/PageTransition";
import { BookOpen } from "lucide-react";
import { COURSES_LIST } from "@/data/placeholders";

// Placeholder progress — Phase 3 will replace with real data
const userProgress: Record<string, { completedCount: number }> = {};

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
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Cursos</h1>
          <p className="mt-1 text-muted-foreground">Explora y avanza en tu jardín financiero.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="progreso">En progreso</TabsTrigger>
            <TabsTrigger value="completados">Completados</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
