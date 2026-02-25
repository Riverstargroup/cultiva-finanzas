import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, Flame, ArrowRight, LayoutDashboard, Calculator, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { COURSES_LIST } from "@/data/placeholders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const weeklyData = [
  { day: "Lun", minutos: 25 },
  { day: "Mar", minutos: 40 },
  { day: "Mié", minutos: 15 },
  { day: "Jue", minutos: 50 },
  { day: "Vie", minutos: 30 },
  { day: "Sáb", minutos: 10 },
  { day: "Dom", minutos: 0 },
];

const metrics = [
  { title: "Escenarios", value: "0", icon: BookOpen, accent: "text-primary" },
  { title: "Tiempo", value: "0h", icon: Clock, accent: "text-secondary" },
  { title: "Insignias", value: "0/8", icon: Trophy, accent: "text-accent" },
  { title: "Racha", value: "0", icon: Flame, accent: "text-destructive" },
];

const quickLinks = [
  { label: "Inicio", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Cursos", icon: Award, path: "/cursos" },
  { label: "Calculadora", icon: Calculator, path: "/calculadora" },
  { label: "Logros", icon: Trophy, path: "/logros" },
  { label: "Perfil", icon: User, path: "/perfil" },
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

  const name = loading ? "..." : profile?.full_name || "Jardinero";
  const greeting = `${getGreeting()}, ${name}`;

  // Placeholder: no courses started
  const currentCourse = null as typeof COURSES_LIST[0] | null;
  const currentProgress = 0;

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* A) Compact Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-primary md:text-3xl">
            {greeting} 🌱
          </h1>
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">
            {getFormattedDate()}
          </p>
        </div>

        {/* B) Card Hero "Continuar" — max-h constrained */}
        {currentCourse ? (
          <motion.div
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={reduced ? undefined : { scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="max-h-[140px] cursor-pointer border-primary/30 bg-primary/5" onClick={() => navigate(`/cursos/${currentCourse.id}`)}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">Continuar</p>
                  <h3 className="truncate font-bold text-foreground">{currentCourse.title}</h3>
                  <Progress value={currentProgress} className="h-1.5" />
                </div>
                <Button size="sm" className="min-h-[44px] shrink-0 rounded-full">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="max-h-[140px] border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Empieza tu primer curso</p>
                <p className="text-sm text-muted-foreground">Siembra conocimiento financiero hoy.</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="min-h-[44px] shrink-0 rounded-full"
                onClick={() => navigate("/cursos")}
              >
                Ver cursos
              </Button>
            </CardContent>
          </Card>
        )}

        {/* C) Quick Access Launcher — horizontal scroll with no-swipe */}
        <div
          className="no-swipe -mx-4 flex gap-3 overflow-x-auto px-4 pb-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {quickLinks.map((link) => (
            <motion.button
              key={link.path}
              whileTap={reduced ? undefined : { scale: 0.96 }}
              onClick={() => navigate(link.path)}
              className="flex min-h-[44px] min-w-[72px] shrink-0 scroll-snap-align-start flex-col items-center gap-1 rounded-xl border border-border/50 px-3 py-2.5 transition-colors hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ scrollSnapAlign: "start" }}
            >
              <link.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-foreground">{link.label}</span>
            </motion.button>
          ))}
        </div>

        {/* D) Stats Grid — improved */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {metrics.map((m) => (
            <motion.div key={m.title} variants={item}>
              <Card className="border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10`}>
                    <m.icon className={`h-5 w-5 ${m.accent}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* E) Weekly Chart */}
        <Card className="border-border/50">
          <CardContent className="no-swipe p-5">
            <h3 className="mb-4 text-lg font-bold text-primary">Progreso semanal</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => [`${value} min`, "Tiempo"]}
                  />
                  <Bar dataKey="minutos" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
