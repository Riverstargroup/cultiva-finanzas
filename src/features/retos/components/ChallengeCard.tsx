import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { ChallengeTemplate } from '../types'
import type { SkillDomain } from '../types'

const DOMAIN_EMOJI: Record<SkillDomain, string> = {
  control: '💰',
  credito: '💳',
  proteccion: '🛡️',
  crecimiento: '🌱',
}

const DOMAIN_LABEL: Record<SkillDomain, string> = {
  control: 'Control',
  credito: 'Crédito',
  proteccion: 'Protección',
  crecimiento: 'Crecimiento',
}

const DOMAIN_COLOR: Record<SkillDomain, string> = {
  control: 'var(--leaf-bright)',
  credito: '#C2185B',
  proteccion: 'var(--forest-deep)',
  crecimiento: 'var(--leaf-dark)',
}

interface ChallengeCardProps {
  template: ChallengeTemplate
  isActive: boolean
  onAccept: (templateId: string) => void
  isPending?: boolean
}

export function ChallengeCard({ template, isActive, onAccept, isPending }: ChallengeCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const domain = template.target_domain ?? 'control'

  const difficultyStars = '⭐'.repeat(template.difficulty)

  return (
    <motion.div
      className="organic-card p-4 space-y-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
    >
      {/* Domain badge + difficulty */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: DOMAIN_COLOR[domain as SkillDomain] + '22',
            color: DOMAIN_COLOR[domain as SkillDomain],
          }}
        >
          {DOMAIN_EMOJI[domain as SkillDomain]}
          {DOMAIN_LABEL[domain as SkillDomain]}
        </span>
        <span className="text-xs" title={`Dificultad ${template.difficulty}/3`}>
          {difficultyStars}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--forest-deep)' }}>
        {template.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {template.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>⏱ {template.duration_days}d</span>
        <span>🪙 {template.reward_coins} monedas</span>
      </div>

      {/* Accept button */}
      <button
        className="vibrant-btn w-full min-h-[44px] text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onAccept(template.id)}
        disabled={isActive || isPending}
      >
        {isActive ? '✓ Reto activo' : isPending ? 'Iniciando...' : 'Aceptar reto'}
      </button>
    </motion.div>
  )
}
