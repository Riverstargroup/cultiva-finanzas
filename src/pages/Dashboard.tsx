import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, Flame, Sprout, Bell, ArrowRight, Zap } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function Dashboard() {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const { user } = useAuth();

  const { data: stats } = useDashboardStats();
  const { data: reviewQueue } = useReviewQueue();
  const { data: courses } = useCourses();

  // Momentum: count missions done in last 7 days
  const { data: momentum } = useQuery({
    queryKey: ["momentum", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count } = await supabase
        .from("user_missions" as any)
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("status", "done")
        .gte("done_at", sevenDaysAgo.toISOString());
      return count ?? 0;
    },
  });

  const name = loading ? "..." : profile?.full_name || "Jardinero";
  const greeting = `${getGreeting()}, ${name}`;

  const metrics = [
    { title: "Escenarios", value: String(stats?.completedScenarios ?? 0), icon: BookOpen },
    { title: "Tiempo", value: formatTime(stats?.totalMinutes ?? 0), icon: Clock },
    { title: "Insignias", value: `${stats?.badgesUnlocked ?? 0}/${stats?.totalBadges ?? 8}`, icon: Trophy },
    { title: "Racha", value: `${stats?.streak ?? 0} días`, icon: Flame },
    ...((momentum ?? 0) > 0 ? [{ title: "Impulso", value: `${momentum}`, icon: Zap }] : []),
  ];

  const weeklyData = stats?.weeklyMinutes ?? [
    { day: "Lun", full: "Lunes", minutos: 0 },
    { day: "Mar", full: "Martes", minutos: 0 },
    { day: "Mié", full: "Miércoles", minutos: 0 },
    { day: "Jue", full: "Jueves", minutos: 0 },
    { day: "Vie", full: "Viernes", minutos: 0 },
    { day: "Sáb", full: "Sábado", minutos: 0 },
    { day: "Dom", full: "Domingo", minutos: 0 },
  ];

  const maxMinutos = Math.max(...weeklyData.map((d) => d.minutos), 1);

  const hasReviews = (reviewQueue?.length ?? 0) > 0;
  const hasStarted = (stats?.completedScenarios ?? 0) > 0;
  const firstCourse = courses?.[0];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <PageTransition>
      <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* A) Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "color-mix(in srgb, var(--leaf-fresh) 20%, transparent)" }}>
                  <Sprout className="h-5 w-5" style={{ color: "var(--leaf-bright)" }} />
                </div>
                <h1 className="font-heading text-2xl font-black md:text-3xl" style={{ color: "var(--forest-deep)" }}>
                  {greeting} 🌱
                </h1>
              </div>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-widest" style={{ color: "var(--leaf-muted)" }}>
                {getFormattedDate()}
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                style={{ background: "color-mix(in srgb, var(--clay-soft) 60%, transparent)" }}
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5" style={{ color: "var(--text-warm)" }} />
              </button>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "var(--leaf-bright)" }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Semilla de hoy */}
          {hasReviews ? (
            <div className="organic-card relative overflow-hidden p-6 md:p-8">
              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center organic-border"
                  style={{ background: "var(--terracotta-vivid)" }}
                >
                  <Flame className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="font-heading text-xl font-bold md:text-2xl" style={{ color: "var(--forest-deep)" }}>
                    Semilla de repaso
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-warm)" }}>
                    Tienes {reviewQueue!.length} semilla{reviewQueue!.length > 1 ? "s" : ""} por repasar. ¡No pierdas tu racha!
                  </p>
                </div>
                <button
                  className="vibrant-btn shrink-0"
                  onClick={() => {
                    const r = reviewQueue![0];
                    navigate(`/cursos/${r.course_id}/escenario/${r.scenario_id}`);
                  }}
                >
                  Repasar (~3 min) <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : hasStarted ? (
            <div className="organic-card relative overflow-hidden p-6 md:p-8">
              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center organic-border"
                  style={{ background: "var(--leaf-bright)" }}
                >
                  <Sprout className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="font-heading text-xl font-bold md:text-2xl" style={{ color: "var(--forest-deep)" }}>
                    ¡Todo al día! 🌿
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-warm)" }}>
                    No tienes repasos pendientes. Sigue avanzando en tu curso.
                  </p>
                </div>
                {firstCourse && (
                  <button className="vibrant-btn shrink-0" onClick={() => navigate(`/cursos/${firstCourse.id}`)}>
                    Continuar curso <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="organic-card relative overflow-hidden p-6 md:p-8">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 blur-2xl"
                style={{ background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)", borderRadius: "60% 40% 50% 50% / 40% 60% 40% 60%" }}
              />
              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center organic-border"
                  style={{ background: "var(--leaf-bright)" }}
                >
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="font-heading text-xl font-bold md:text-2xl" style={{ color: "var(--forest-deep)" }}>
                    Empieza tu primer curso
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-warm)" }}>
                    Siembra conocimiento financiero hoy. Tu jardín te espera.
                  </p>
                </div>
                <button className="vibrant-btn shrink-0" onClick={() => navigate("/cursos")}>
                  Ver cursos <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* C) Stats Grid */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {metrics.map((m) => (
              <motion.div key={m.title} variants={reduced ? undefined : item} className="card-stat p-4 md:p-5">
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center organic-border"
                  style={{ background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)" }}
                >
                  <m.icon className="h-5 w-5" style={{ color: "var(--leaf-bright)" }} />
                </div>
                <p className="font-heading text-2xl font-bold" style={{ color: "var(--forest-deep)" }}>
                  {m.value}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--leaf-muted)" }}>
                  {m.title}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* D) Weekly Chart */}
          <div className="organic-card p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-1 w-8 rounded-full" style={{ background: "var(--leaf-bright)" }} />
              <h3 className="font-heading text-lg font-bold" style={{ color: "var(--forest-deep)" }}>
                Progreso semanal
              </h3>
            </div>
            <div className="flex items-end justify-between gap-2" style={{ height: 180 }}>
              {weeklyData.map((d, i) => {
                const pct = maxMinutos > 0 ? (d.minutos / maxMinutos) * 100 : 0;
                const barHeight = Math.max(pct, 4);
                const isActive = activeBar === i;
                return (
                  <div key={d.day} className="relative flex flex-1 flex-col items-center gap-1.5">
                    {isActive && d.minutos > 0 && (
                      <div
                        className="absolute -top-8 z-10 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-semibold text-white shadow"
                        style={{ background: "var(--forest-deep)" }}
                      >
                        {d.minutos} min
                      </div>
                    )}
                    <div
                      role="img"
                      aria-label={`${d.full}: ${d.minutos} minutos`}
                      className="w-full cursor-pointer transition-all duration-300"
                      style={{
                        height: `${barHeight}%`,
                        background: isActive ? "var(--leaf-fresh)" : "var(--leaf-bright)",
                        borderRadius: "12px 14px 6px 8px / 14px 12px 8px 6px",
                        minHeight: 6,
                      }}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      onClick={() => setActiveBar(isActive ? null : i)}
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--leaf-muted)" }}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
