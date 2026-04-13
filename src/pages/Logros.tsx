import { motion } from "framer-motion";
import {
  Sprout, BookOpen, Trophy, Flame, Zap, Calculator, CreditCard, PiggyBank,
} from "lucide-react";
import BotanicalPage from "@/components/layout/BotanicalPage";
import BadgeCard from "@/components/BadgeCard";
import { BADGES } from "@/data/placeholders";
import { useAchievements } from "@/hooks/useAchievements";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sprout, BookOpen, Trophy, Flame, Zap, Calculator, CreditCard, PiggyBank,
};

export default function Logros() {
  const { data: achievements } = useAchievements();
  const unlockedIds = (achievements ?? []).map((a) => a.badge_id);
  const achievementMap = new Map((achievements ?? []).map((a) => [a.badge_id, a]));

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <BotanicalPage title="Logros" subtitle={`${unlockedIds.length} de ${BADGES.length} insignias desbloqueadas.`}>
      <div
        className="organic-card inline-flex items-center gap-2 px-4 py-2"
        style={{ background: "color-mix(in srgb, var(--clay-soft) 50%, transparent)", borderColor: "color-mix(in srgb, var(--leaf-fresh) 20%, transparent)" }}
      >
        <Trophy className="h-4 w-4" style={{ color: "var(--leaf-bright)" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--forest-deep)" }}>
          {unlockedIds.length}/{BADGES.length}
        </span>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {BADGES.map((b) => {
          const achievement = achievementMap.get(b.id);
          return (
            <motion.div key={b.id} variants={item}>
              <BadgeCard
                icon={iconMap[b.icon] || Trophy}
                name={b.name}
                description={b.description}
                unlocked={unlockedIds.includes(b.id)}
                unlockedAt={achievement?.unlocked_at}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </BotanicalPage>
  );
}
