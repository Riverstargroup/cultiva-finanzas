import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useNavigate } from "react-router-dom";
import DifficultyDots from "@/components/courses/DifficultyDots";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  progress: number;
  scenarioCount: number;
  completedCount: number;
  estimatedMinutes?: number;
}

export default function CourseCard({
  id, title, description, difficulty, progress, scenarioCount, completedCount, estimatedMinutes,
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
      <div className="organic-card overflow-hidden h-full">
        {/* Gradient header with organic top radius */}
        <div
          className="h-32"
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--leaf-bright) 20%, transparent), color-mix(in srgb, var(--leaf-fresh) 30%, transparent), color-mix(in srgb, var(--terracotta-vivid) 15%, transparent))",
            borderRadius: "30px 60px 0 0 / 50px 30px 0 0",
          }}
        />
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-xs capitalize font-semibold px-3 py-1 rounded-full border"
                style={{
                  background: "var(--soil-warm)",
                  color: "var(--forest-deep)",
                  borderColor: "var(--clay-soft)",
                }}
              >
                {difficulty}
              </span>
              <DifficultyDots level={difficulty} />
            </div>
            <span className="text-xs whitespace-nowrap" style={{ color: "var(--leaf-muted)" }}>
              {completedCount}/{scenarioCount} escenarios
            </span>
          </div>
          <h3 className="font-heading font-bold leading-tight line-clamp-2" style={{ color: "var(--forest-deep)" }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-warm)" }}>
            {description}
          </p>
          {typeof estimatedMinutes === "number" && estimatedMinutes > 0 && (
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
              style={{ background: "var(--clay-soft)", color: "var(--leaf-muted)" }}
            >
              <Clock size={12} /> ~{estimatedMinutes} min
            </span>
          )}
          {progress > 0 && (
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "var(--clay-soft)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: "var(--leaf-bright)" }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
