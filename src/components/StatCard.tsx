import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  accentClass?: string;
}

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="card-stat p-4 md:p-5 space-y-3">
        <div
          className="organic-border h-10 w-10 flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)" }}
        >
          <Icon className="h-5 w-5" style={{ color: "var(--leaf-bright)" }} />
        </div>
        <p
          className="font-heading text-2xl font-bold"
          style={{ color: "var(--forest-deep)" }}
        >
          {value}
        </p>
        <p
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--leaf-muted)" }}
        >
          {title}
        </p>
      </div>
    </motion.div>
  );
}
