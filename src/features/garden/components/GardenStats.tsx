import { Coins, Flame, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface GardenStatsProps {
  coins: number
  totalMastery: number
  streakDays: number
  plantsMastered: number
  compact?: boolean
  className?: string
}

export function GardenStats({ coins, totalMastery, streakDays, plantsMastered, compact, className }: GardenStatsProps) {
  const overallPct = Math.round((totalMastery / 4) * 100)

  if (compact) {
    return (
      <div className={`flex items-center gap-4 ${className ?? ''}`}>
        <span className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--garden-coin-gold)' }}>
          <Coins size={14} />
          {coins}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold text-orange-500">
          <Flame size={14} />
          {streakDays}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--garden-health-full)' }}>
          <Star size={14} />
          {overallPct}%
        </span>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className ?? ''}`}>
      <StatCard
        icon={<Coins size={20} />}
        value={coins.toLocaleString()}
        label="Monedas"
        color="var(--garden-coin-gold)"
      />
      <StatCard
        icon={<Flame size={20} />}
        value={`${streakDays}d`}
        label="Racha"
        color="#F97316"
      />
      <StatCard
        icon={<Star size={20} />}
        value={`${overallPct}%`}
        label="Maestría"
        color="var(--garden-health-full)"
      />
      <StatCard
        icon={<span className="text-lg">🌸</span>}
        value={`${plantsMastered}/4`}
        label="Dominadas"
        color="var(--garden-lirio-primary)"
      />
    </div>
  )
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <motion.div
      className="organic-card flex flex-col items-center gap-1 p-3"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ color }}>{icon}</div>
      <p className="text-lg font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  )
}
