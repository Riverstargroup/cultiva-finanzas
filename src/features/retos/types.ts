// ============================================================
// Retos de Cosecha — Type system
// Uses actual DB column names: target_domain, reward_coins, target_mastery_delta
// ============================================================

export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'skipped'

export type SkillDomain = 'control' | 'credito' | 'proteccion' | 'crecimiento'

export interface ChallengeTemplate {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly target_domain: SkillDomain | null
  readonly difficulty: 1 | 2 | 3
  readonly duration_days: number
  readonly reward_coins: number
  readonly target_mastery_delta: number
  readonly verification_hint: string | null
  readonly is_active: boolean
  readonly created_at: string
}

export interface UserWeeklyChallenge {
  readonly id: string
  readonly user_id: string
  readonly template_id: string
  readonly week_start: string
  readonly status: ChallengeStatus
  readonly started_at: string
  readonly completed_at: string | null
  // joined template
  readonly template?: ChallengeTemplate
}

export interface ActiveChallengeWithTemplate extends UserWeeklyChallenge {
  readonly template: ChallengeTemplate
}
