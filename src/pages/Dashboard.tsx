import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, Flame, ArrowRight, Calculator, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
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
  { title: "Escenarios completados", value: "0", icon: BookOpen, accent: "text-primary" },
  { title: "Tiempo invertido", value: "0h", icon: Clock, accent: "text-secondary" },
  { title: "Insignias obtenidas", value: "0/8", icon: Trophy, accent: "text-accent" },
  { title: "Racha de días", value: "0", icon: Flame, accent: "text-destructive" },
];

const quickLinks = [
  { label: "Cursos", icon: Award, path: "/cursos" },
  { label: "Calculadora", icon: Calculator, path: "/calculadora" },
  { label: "Perfil", icon: User, path: "/perfil" },
];

export default function Dashboard() {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const greeting = loading ? "Cargando..." : `Hola, ${profile?.full_name || "Jardinero"}`;

  // Placeholder: no courses started
  const currentCourse = null as typeof COURSES_LIST[0] | null;
  const currentProgress = 0;

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <PageTransition>
      <div className="space-y-6 md:space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
            {greeting} 🌱
          </h1>
          <p className="mt-1 text-muted-foreground">
            Bienvenido de vuelta a tu jardín financiero.
          </p>
        </div>

        {/* Continue section */}
        {currentCourse ? (
          <motion.div
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={reduced ? undefined : { scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="border-primary/30 bg-primary/5 cursor-pointer" onClick={() => navigate(`/cursos/${currentCourse.id}`)}>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs text-primary font-medium uppercase tracking-wider">Continuar aprendiendo</p>
                <h3 className="font-bold text-lg text-foreground">{currentCourse.title}</h3>
                <Progress value={currentProgress} className="h-2" />
                <Button size="sm" className="rounded-full min-h-[44px]">
                  Continuar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Tu jardín está listo"
            description="Inicia tu primer curso y comienza a sembrar conocimiento financiero."
            actionLabel="Explorar cursos"
            onAction={() => navigate("/cursos")}
          />
        )}

        {/* Metrics */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <motion.div key={m.title} variants={item}>
              <StatCard title={m.title} value={m.value} icon={m.icon} accentClass={m.accent} />
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly chart */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Progreso semanal</h3>
            <div className="h-64">
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

        {/* Quick links */}
        <div className="grid gap-3 grid-cols-3">
          {quickLinks.map((link) => (
            <motion.div
              key={link.path}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card
                className="border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(link.path)}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                  <link.icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{link.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
