import { motion } from "framer-motion";
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
      <div className={`organic-card h-full ${unlocked ? "" : "opacity-[0.65]"}`}>
        <div className="p-4 flex flex-col items-center text-center space-y-2">
          <div
            className="organic-border h-12 w-12 flex items-center justify-center"
            style={{
              background: unlocked
                ? "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)"
                : "var(--clay-soft)",
            }}
          >
            {unlocked ? (
              <Icon className="h-6 w-6" style={{ color: "var(--leaf-bright)" }} />
            ) : (
              <Lock className="h-6 w-6" style={{ color: "var(--leaf-muted)" }} />
            )}
          </div>
          <h4 className="font-heading font-bold text-sm" style={{ color: "var(--forest-deep)" }}>
            {name}
          </h4>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-warm)" }}>
            {description}
          </p>
          {unlocked && unlockedAt && (
            <span className="text-xs font-medium" style={{ color: "var(--leaf-bright)" }}>
              {unlockedAt}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
