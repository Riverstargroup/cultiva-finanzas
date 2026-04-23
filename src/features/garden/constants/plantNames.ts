import type { PlantSpecies } from '../types'

// ────────────────────────────────────────────────────────────────
// Suggested plant names per species (Spanish, ≤20 chars, no dupes)
// Used by the NameYourPlant onboarding modal (Sprint 1).
// ────────────────────────────────────────────────────────────────

export const SUGGESTED_PLANT_NAMES: Readonly<Record<PlantSpecies, readonly string[]>> = {
  girasol: ['Solecito', 'Rayo', 'Dorado', 'Chispa', 'Brillante'],
  margarita: ['Blanquita', 'Pétalo', 'Nube', 'Alegría', 'Lucía'],
  lirio: ['Violeta', 'Elegante', 'Rosa', 'Dulce', 'Pasión'],
  helecho: ['Verdín', 'Fronda', 'Selva', 'Musgo', 'Valiente'],
} as const
