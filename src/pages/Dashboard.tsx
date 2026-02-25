import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, Flame, Sprout, Bell, ArrowRight } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const weeklyData = [
  { day: "Lun", full: "Lunes", minutos: 25 },
  { day: "Mar", full: "Martes", minutos: 40 },
  { day: "Mié", full: "Miércoles", minutos: 15 },
  { day: "Jue", full: "Jueves", minutos: 50 },
  { day: "Vie", full: "Viernes", minutos: 30 },
  { day: "Sáb", full: "Sábado", minutos: 10 },
  { day: "Dom", full: "Domingo", minutos: 0 },
];

const maxMinutos = Math.max(...weeklyData.map((d) => d.minutos), 1);

const metrics = [
  { title: "Escenarios", value: "0", icon: BookOpen, iconLabel: "menu_book" },
  { title: "Tiempo", value: "0h", icon: Clock, iconLabel: "schedule" },
  { title: "Insignias", value: "0/8", icon: Trophy, iconLabel: "emoji_events" },
  { title: "Racha", value: "0 días", icon: Flame, iconLabel: "local_fire_department" },
];

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

export default function Dashboard() {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [activeBar, setActiveBar] = useState<number | null>(null);

  const name = loading ? "..." : profile?.full_name || "Jardinero";
  const greeting = `${getGreeting()}, ${name}`;

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

          {/* B) Hero Card */}
          <div className="organic-card relative overflow-hidden p-6 md:p-8">
            {/* Decorative blobs */}
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 blur-2xl"
              style={{
                background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)",
                borderRadius: "60% 40% 50% 50% / 40% 60% 40% 60%",
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 blur-xl"
              style={{
                background: "color-mix(in srgb, var(--terracotta-vivid) 10%, transparent)",
                borderRadius: "40% 60% 50% 50% / 60% 40% 60% 40%",
              }}
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
                Ver cursos
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

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
                    {/* Tooltip */}
                    {isActive && d.minutos > 0 && (
                      <div
                        className="absolute -top-8 z-10 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-semibold text-white shadow"
                        style={{ background: "var(--forest-deep)" }}
                      >
                        {d.minutos} min
                      </div>
                    )}
                    {/* Bar */}
                    <div
                      role="img"
                      aria-label={`${d.full}: ${d.minutos} minutos`}
                      className="group w-full cursor-pointer transition-all duration-300"
                      style={{
                        height: `${barHeight}%`,
                        background: isActive ? "var(--leaf-fresh)" : "var(--leaf-bright)",
                        borderRadius: "12px 14px 6px 8px / 14px 12px 8px 6px",
                        minHeight: 6,
                      }}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      onClick={() => setActiveBar(isActive ? null : i)}
                    >
                      {/* Desktop hover tooltip via CSS */}
                      {d.minutos > 0 && (
                        <div
                          className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-semibold text-white shadow group-hover:block md:block"
                          style={{ background: "var(--forest-deep)", display: isActive ? undefined : undefined }}
                        />
                      )}
                    </div>
                    {/* Day label */}
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
