import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { LucideIcon } from "lucide-react";

interface BadgeCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function BadgeCard({ icon: Icon, name, description, unlocked, unlockedAt }: BadgeCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className={`border-border/50 h-full ${unlocked ? "" : "opacity-50"}`}>
        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
          <div className={`rounded-full p-3 ${unlocked ? "bg-primary/15" : "bg-muted"}`}>
            {unlocked ? (
              <Icon className="h-6 w-6 text-primary" />
            ) : (
              <Lock className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <h4 className="font-bold text-sm text-foreground">{name}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          {unlocked && unlockedAt && (
            <span className="text-xs text-primary font-medium">{unlockedAt}</span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
