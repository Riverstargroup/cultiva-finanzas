import { motion } from "framer-motion";
import {
  Sprout, BookOpen, Trophy, Flame, Zap, Calculator, CreditCard, PiggyBank,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import BadgeCard from "@/components/BadgeCard";
import { BADGES } from "@/data/placeholders";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sprout, BookOpen, Trophy, Flame, Zap, Calculator, CreditCard, PiggyBank,
};

// Placeholder — Phase 3 replaces with real user data
const unlockedBadges: string[] = [];

export default function Logros() {
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Logros</h1>
          <p className="mt-1 text-muted-foreground">
            {unlockedBadges.length} de {BADGES.length} insignias desbloqueadas.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          {BADGES.map((b) => (
            <motion.div key={b.id} variants={item}>
              <BadgeCard
                icon={iconMap[b.icon] || Trophy}
                name={b.name}
                description={b.description}
                unlocked={unlockedBadges.includes(b.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
