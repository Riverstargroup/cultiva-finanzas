import { STAGE_THRESHOLDS, type GrowthStage, type HealthState } from '../types'

export function masteryToStage(mastery: number): GrowthStage {
  for (const { stage, minMastery, maxMastery } of STAGE_THRESHOLDS) {
    if (mastery >= minMastery && mastery < maxMastery) return stage
  }
  return 'mastered'
}

export function healthToState(health: number): HealthState {
  if (health >= 75) return 'thriving'
  if (health >= 50) return 'healthy'
  if (health >= 25) return 'wilting'
  return 'dying'
}

export function masteryProgress(mastery: number, stage: GrowthStage): number {
  const threshold = STAGE_THRESHOLDS.find(t => t.stage === stage)
  if (!threshold) return 1
  const range = threshold.maxMastery - threshold.minMastery
  return Math.min(1, (mastery - threshold.minMastery) / range)
}
