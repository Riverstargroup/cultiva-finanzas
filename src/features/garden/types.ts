// ============================================================
// Mi Jardín — Core type system
// All stage math lives in lib/stage.ts — never inline thresholds
// ============================================================

export type PlantSpecies = 'margarita' | 'lirio' | 'helecho' | 'girasol'

export type GrowthStage =
  | 'seed'
  | 'sprout'
  | 'growing'
  | 'blooming'
  | 'mastered'

export type SkillDomain =
  | 'control'
  | 'credito'
  | 'proteccion'
  | 'crecimiento'

export type HealthState = 'thriving' | 'healthy' | 'wilting' | 'dying'

export type PlantAnimationKey =
  | 'idle'
  | 'watered'
  | 'growth'
  | 'glow'
  | 'hover'

// ---- Domain <-> Species mapping ----------------------------

export const DOMAIN_TO_SPECIES: Readonly<Record<SkillDomain, PlantSpecies>> = {
  control: 'margarita',
  credito: 'lirio',
  proteccion: 'helecho',
  crecimiento: 'girasol',
} as const

export const SPECIES_TO_DOMAIN: Readonly<Record<PlantSpecies, SkillDomain>> = {
  margarita: 'control',
  lirio: 'credito',
  helecho: 'proteccion',
  girasol: 'crecimiento',
} as const

export const DOMAIN_LABELS: Readonly<Record<SkillDomain, string>> = {
  control: 'Control',
  credito: 'Crédito',
  proteccion: 'Protección',
  crecimiento: 'Crecimiento',
} as const

export const SPECIES_EMOJI: Readonly<Record<PlantSpecies, string>> = {
  margarita: '🌼',
  lirio: '🌺',
  helecho: '🌿',
  girasol: '🌻',
} as const

// ---- Mastery -> Stage thresholds ---------------------------

export interface StageThreshold {
  readonly stage: GrowthStage
  readonly minMastery: number
  readonly maxMastery: number
}

export const STAGE_THRESHOLDS: readonly StageThreshold[] = [
  { stage: 'seed',     minMastery: 0.0, maxMastery: 0.2 },
  { stage: 'sprout',   minMastery: 0.2, maxMastery: 0.4 },
  { stage: 'growing',  minMastery: 0.4, maxMastery: 0.6 },
  { stage: 'blooming', minMastery: 0.6, maxMastery: 0.8 },
  { stage: 'mastered', minMastery: 0.8, maxMastery: 1.01 },
] as const

// ---- Color scheme ------------------------------------------

export interface PlantColorScheme {
  readonly primary: string
  readonly secondary: string
  readonly light: string
  readonly dark: string
  readonly particle: string
}

export const PLANT_COLOR_SCHEMES: Readonly<Record<PlantSpecies, PlantColorScheme>> = {
  margarita: {
    primary:   '#F5C43A',
    secondary: '#E8A628',
    light:     '#FFFFFF',
    dark:      '#5B7A3A',
    particle:  '#FFE89A',
  },
  lirio: {
    primary:   '#C2185B',
    secondary: '#E91E63',
    light:     '#F8BBD0',
    dark:      '#2E5D34',
    particle:  '#FFD1E1',
  },
  helecho: {
    primary:   '#2E7D4F',
    secondary: '#4CAF50',
    light:     '#A8D8B0',
    dark:      '#1B3B26',
    particle:  '#C8E6C9',
  },
  girasol: {
    primary:   '#F59E0B',
    secondary: '#D97706',
    light:     '#FCD34D',
    dark:      '#78350F',
    particle:  '#FEF3C7',
  },
} as const

// ---- Plant state -------------------------------------------

export interface Plant {
  readonly id: string
  readonly species: PlantSpecies
  readonly domain: SkillDomain
  readonly mastery: number
  readonly stage: GrowthStage
  readonly health: number
  readonly healthState: HealthState
  readonly lastWateredAt: string | null
  readonly plantedAt: string
}

export interface GardenPlot {
  readonly id: string
  readonly userId: string
  readonly domain: SkillDomain
  readonly plant: Plant
}

export interface GardenState {
  readonly plots: readonly GardenPlot[]
  readonly coins: number
  readonly totalMastery: number
  readonly streakDays: number
  readonly isLoading: boolean
}

// ---- Event system ------------------------------------------

export type GardenEvent =
  | { type: 'coin_earned'; amount: number; plotId: string }
  | { type: 'plant_watered'; plotId: string; masteryDelta: number }
  | { type: 'stage_upgrade'; plotId: string; from: GrowthStage; to: GrowthStage }
  | { type: 'mastered'; plotId: string }
  | { type: 'health_warning'; plotId: string; health: number }

// ---- Particle system ---------------------------------------

export type ParticleShape = 'circle' | 'star4' | 'droplet' | 'ribbon'

export type ParticlePattern = 'burst-arc' | 'burst-radial' | 'rain' | 'drift-up'

export type ParticleOrigin =
  | 'center'
  | 'top-center'
  | 'bottom-center'
  | 'random-within-bounds'
  | { x: number; y: number }

export interface RangeOrValue {
  readonly min: number
  readonly max: number
}

export interface ParticleVelocity {
  readonly min: number
  readonly max: number
  readonly angleDeg: number | RangeOrValue
}

export interface ParticleOpacity {
  readonly from: number
  readonly to: number
  readonly peak?: number
  readonly fadeStart?: number
  readonly curve?: 'linear' | 'bell' | 'ease-out'
}

export interface ParticleConfig {
  readonly count: number
  readonly duration?: number
  readonly continuous?: boolean
  readonly spawnInterval?: number
  readonly lifespan?: number
  readonly origin: ParticleOrigin
  readonly pattern: ParticlePattern
  readonly size: RangeOrValue
  readonly color: readonly string[]
  readonly shape: ParticleShape
  readonly velocity: ParticleVelocity
  readonly gravity?: number
  readonly opacity: ParticleOpacity
  readonly rotation?: { readonly from: number; readonly to: number; readonly randomDir?: boolean }
  readonly spawnJitter?: { readonly x: number; readonly y: number }
  readonly stagger?: number
  readonly blur?: number
}

// ============================================================
// Backyard economy extensions (Phase 2)
// ============================================================

export type SpecialPower = 'fire' | 'gold' | 'ice'

export interface ShopItem {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly price: number
  readonly species: string
  readonly emoji: string
  readonly specialPower: SpecialPower | null
  readonly powerDescription: string | null
  readonly isCosmetic: boolean
  readonly sortOrder: number
}

export interface InventoryItem {
  readonly id: string
  readonly shopItem: ShopItem
  readonly isPlaced: boolean
  readonly posX: number | null
  readonly posY: number | null
  readonly purchasedAt: string
}

export interface GardenEconomy {
  readonly rentDueAt: string
  readonly rentAmount: number
  readonly fireActiveUntil: string | null
  readonly goldActiveUntil: string | null
  readonly iceActiveUntil: string | null
  readonly lastPassiveCoinsAt: string | null
}

export const SPECIAL_POWER_COLORS: Readonly<Record<SpecialPower, { aura: string; glow: string; accent: string }>> = {
  fire: { aura: 'rgba(255,94,58,0.35)',  glow: 'rgba(255,160,60,0.5)',  accent: '#FF5E3A' },
  gold: { aura: 'rgba(245,196,58,0.35)', glow: 'rgba(255,215,0,0.5)',   accent: '#F5C842' },
  ice:  { aura: 'rgba(137,196,244,0.35)',glow: 'rgba(180,220,255,0.5)', accent: '#89C4F4' },
} as const

export const SPECIAL_POWER_LABELS: Readonly<Record<SpecialPower, string>> = {
  fire: 'Escudo de racha',
  gold: 'Ingreso pasivo',
  ice:  'Renta congelada',
} as const

export const SPECIAL_POWER_EMOJIS: Readonly<Record<SpecialPower, string>> = {
  fire: '🔥',
  gold: '🥇',
  ice:  '🧊',
} as const
