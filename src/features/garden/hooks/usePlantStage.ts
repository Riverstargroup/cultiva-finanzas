import { masteryToStage, healthToState } from '../lib/stage'
import type { GrowthStage, HealthState } from '../types'

export function usePlantStage(mastery: number): GrowthStage {
  return masteryToStage(mastery)
}

export function usePlantHealth(health: number): HealthState {
  return healthToState(health)
}
