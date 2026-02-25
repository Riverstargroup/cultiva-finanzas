import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  progress: number; // 0-100
  scenarioCount: number;
  completedCount: number;
}

const difficultyColors: Record<string, string> = {
  basico: "bg-primary/15 text-primary border-primary/30",
  intermedio: "bg-accent/15 text-accent-foreground border-accent/30",
  avanzado: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function CourseCard({
  id, title, description, difficulty, progress, scenarioCount, completedCount,
}: CourseCardProps) {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="cursor-pointer"
      onClick={() => navigate(`/cursos/${id}`)}
    >
      <Card className="border-border/50 overflow-hidden h-full">
        {/* Gradient placeholder image */}
        <div className="h-32 bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20" />
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`text-xs capitalize ${difficultyColors[difficulty] || ""}`}
            >
              {difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{scenarioCount} escenarios
            </span>
          </div>
          <h3 className="font-bold text-foreground leading-tight line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
          {progress > 0 && (
            <Progress value={progress} className="h-2" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
