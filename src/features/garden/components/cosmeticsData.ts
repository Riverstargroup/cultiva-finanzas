// Static catalog + localStorage persistence for plant-head cosmetics.
// Cosmetics are a client-side feature layered on top of the Supabase shop;
// ownership and equipped state live in localStorage until server sync lands.

import type { CosmeticId } from './CosmeticsOverlay'

export interface CosmeticItem {
  readonly id: CosmeticId
  readonly name: string
  readonly emoji: string
  readonly price: number
}

export const COSMETIC_ITEMS: readonly CosmeticItem[] = [
  { id: 'sombrero', name: 'Sombrero', emoji: '🎩', price: 15 },
  { id: 'corona',   name: 'Corona',   emoji: '👑', price: 25 },
  { id: 'birrete',  name: 'Birrete',  emoji: '🎓', price: 20 },
  { id: 'lentes',   name: 'Lentes',   emoji: '🕶', price: 10 },
  { id: 'bufanda',  name: 'Bufanda',  emoji: '🧣', price: 12 },
]

const OWNED_KEY = 'garden-cosmetics-owned'
const EQUIPPED_KEY = 'garden-cosmetics'
const COINS_KEY = 'garden-local-coins'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadOwnedCosmetics(): ReadonlyArray<CosmeticId> {
  if (typeof window === 'undefined') return []
  try { return safeParse<CosmeticId[]>(window.localStorage.getItem(OWNED_KEY), []) }
  catch { return [] }
}

export function saveOwnedCosmetics(owned: ReadonlyArray<CosmeticId>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(OWNED_KEY, JSON.stringify(owned))
  } catch {
    // ignore quota / disabled storage
  }
}

export type EquippedMap = Readonly<Record<string, CosmeticId | undefined>>

export function loadEquippedCosmetics(): EquippedMap {
  if (typeof window === 'undefined') return {}
  try { return safeParse<EquippedMap>(window.localStorage.getItem(EQUIPPED_KEY), {}) }
  catch { return {} }
}

export function saveEquippedCosmetics(equipped: EquippedMap): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(EQUIPPED_KEY, JSON.stringify(equipped))
  } catch {
    // ignore
  }
}

export function loadLocalCoinsOverride(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(COINS_KEY)
    if (raw === null) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch { return null }
}

export function saveLocalCoinsOverride(coins: number): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(COINS_KEY, String(coins))
  } catch {
    // ignore
  }
}
