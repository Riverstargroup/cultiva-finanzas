// Helpers shared by GardenScene sub-components

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'
export type Weather = 'clear' | 'rain'

export const SKY_COLORS: Readonly<Record<TimeOfDay, string>> = {
  dawn: 'linear-gradient(180deg, #F9C8A4 0%, #F9ECDF 38%, #EAD5D6 68%, #C9B28E 100%)',
  day: 'linear-gradient(180deg, #B0CCE8 0%, #D5E6EE 38%, #EDDFCA 64%, #C6A272 100%)',
  dusk: 'linear-gradient(180deg, #7C5658 0%, #A2777A 28%, #D8BFC0 54%, #A2825E 100%)',
  night: 'linear-gradient(180deg, #1E2A38 0%, #3A2E44 38%, #5D3136 68%, #2E1C1C 100%)',
}

export const GRASS_COLORS: Readonly<Record<TimeOfDay, readonly [string, string]>> = {
  dawn: ['#8FA95A', '#7E9850'],
  day: ['#78A94B', '#6A9840'],
  dusk: ['#5B7A3A', '#4D6A2E'],
  night: ['#3E5228', '#324420'],
}

export const GROUND_COLORS: Readonly<Record<TimeOfDay, readonly [string, string]>> = {
  dawn: ['#B89660', '#9E7E4C'],
  day: ['#A88754', '#8F6F3E'],
  dusk: ['#6E5238', '#5A3E26'],
  night: ['#3A2A1C', '#2A1E14'],
}

export function darken(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (n >> 16) - amt)
  const g = Math.max(0, ((n >> 8) & 0xff) - amt)
  const b = Math.max(0, (n & 0xff) - amt)
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

export const QUIPS: Readonly<Record<string, string>> = {
  control: 'Todo bajo control',
  credito: 'Ese interés me preocupa...',
  proteccion: 'Descansa. Yo cuido tu escudo',
  crecimiento: '+3% esta semana',
}

// Derive the time of day from the user's local clock.
// Deterministic ranges; used as default when GardenScene is not given an override.
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const h = date.getHours()
  if (h >= 5 && h < 8) return 'dawn'
  if (h >= 8 && h < 18) return 'day'
  if (h >= 18 && h < 20) return 'dusk'
  return 'night'
}

// Per-species fraction of the rendered plant container where the "head" sits,
// measured from the top. Used to anchor cosmetics to each plant's face.
// Keys are SkillDomain strings (plus 'tomate' for the extra slot species).
export const HEAD_TOP_FRACTION: Readonly<Record<string, number>> = {
  control: 0.20, // Girasol
  credito: 0.30, // Helecho
  proteccion: 0.32, // Lirio
  crecimiento: 0.22, // Margarita
  tomate: 0.26,
}
