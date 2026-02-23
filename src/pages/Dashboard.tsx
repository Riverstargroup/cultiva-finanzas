import { BookOpen, Clock, Trophy, Flame, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  { title: "Cursos completados", value: "0", icon: BookOpen, accent: "text-primary" },
  { title: "Tiempo invertido", value: "0h", icon: Clock, accent: "text-secondary" },
  { title: "Insignias obtenidas", value: "0/5", icon: Trophy, accent: "text-accent" },
  { title: "Racha de días", value: "0", icon: Flame, accent: "text-destructive" },
];

export default function Dashboard() {
  const { profile, loading } = useProfile();

  const greeting = loading
    ? "Cargando..."
    : `Hola, ${profile?.full_name || "Jardinero"}`;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Saludo */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
          {greeting} 🌱
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido de vuelta a tu jardín financiero.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.title}
              </CardTitle>
              <m.icon className={`h-5 w-5 ${m.accent}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico semanal */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary">
            Progreso semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
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

      {/* CTA */}
      <Button size="lg" className="rounded-full px-8 font-bold shadow-lg">
        Continuar aprendiendo
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
