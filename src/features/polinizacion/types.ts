// ============================================================
// Polinización Cruzada — Type system
// ============================================================

export type SkillDomain = 'control' | 'credito' | 'proteccion' | 'crecimiento'

export interface PollinationSession {
  readonly id: string
  readonly user_id: string
  readonly session_date: string
  readonly domain_learned: SkillDomain
  readonly insight: string
  readonly coins_earned: number
  readonly created_at: string
}

export interface DomainTip {
  readonly domain: SkillDomain
  readonly tip: string
}
