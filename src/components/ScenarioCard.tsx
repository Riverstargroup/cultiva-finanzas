import { motion } from "framer-motion";
import { Check, Lock, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type ScenarioStatus = "locked" | "in_progress" | "completed";

interface ScenarioCardProps {
  index: number;
  title: string;
  description: string;
  status: ScenarioStatus;
  onClick?: () => void;
}

const statusConfig: Record<ScenarioStatus, { icon: typeof Check; bgClass: string; borderClass: string }> = {
  completed: { icon: Check, bgClass: "bg-primary/15", borderClass: "border-primary/40" },
  in_progress: { icon: Play, bgClass: "bg-accent/15", borderClass: "border-accent/40" },
  locked: { icon: Lock, bgClass: "bg-muted", borderClass: "border-border/50" },
};

export default function ScenarioCard({ index, title, description, status, onClick }: ScenarioCardProps) {
  const reduced = useReducedMotion();
  const config = statusConfig[status];
  const Icon = config.icon;
  const isInteractive = status !== "locked";

  return (
    <motion.button
      whileHover={isInteractive && !reduced ? { y: -2 } : undefined}
      whileTap={isInteractive && !reduced ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left min-h-[44px] transition-colors ${config.borderClass} ${
        isInteractive ? "cursor-pointer hover:bg-muted/50" : "cursor-not-allowed opacity-60"
      }`}
    >
      <div className={`flex-shrink-0 rounded-full p-2 ${config.bgClass}`}>
        <Icon className={`h-4 w-4 ${status === "completed" ? "text-primary" : status === "in_progress" ? "text-accent-foreground" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">
          {index}. {title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mt-0.5">
          {description}
        </p>
      </div>
    </motion.button>
  );
}
