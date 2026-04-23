import { describe, it, expect } from 'vitest'
import { SUGGESTED_PLANT_NAMES } from './plantNames'
import type { PlantSpecies } from '../types'

// ── Species keys ──────────────────────────────────────────────────────────────

describe('SUGGESTED_PLANT_NAMES — species keys', () => {
  it('contains an entry for girasol', () => {
    // Arrange / Act / Assert
    expect(SUGGESTED_PLANT_NAMES).toHaveProperty('girasol')
  })

  it('contains an entry for margarita', () => {
    // Arrange / Act / Assert
    expect(SUGGESTED_PLANT_NAMES).toHaveProperty('margarita')
  })

  it('contains an entry for lirio', () => {
    // Arrange / Act / Assert
    expect(SUGGESTED_PLANT_NAMES).toHaveProperty('lirio')
  })

  it('contains an entry for helecho', () => {
    // Arrange / Act / Assert
    expect(SUGGESTED_PLANT_NAMES).toHaveProperty('helecho')
  })

  it('has exactly the 4 expected species as keys', () => {
    // Arrange
    const expectedSpecies: PlantSpecies[] = ['girasol', 'margarita', 'lirio', 'helecho']

    // Act
    const keys = Object.keys(SUGGESTED_PLANT_NAMES)

    // Assert — all 4 species must be present
    for (const species of expectedSpecies) {
      expect(keys).toContain(species)
    }
  })
})

// ── Minimum name count ────────────────────────────────────────────────────────

describe('SUGGESTED_PLANT_NAMES — minimum name count per species', () => {
  const species: PlantSpecies[] = ['girasol', 'margarita', 'lirio', 'helecho']

  it.each(species)('%s has at least 3 suggested names', (s) => {
    // Arrange
    const names = SUGGESTED_PLANT_NAMES[s]

    // Act / Assert
    expect(Array.isArray(names)).toBe(true)
    expect(names.length).toBeGreaterThanOrEqual(3)
  })
})

// ── Name type validation ──────────────────────────────────────────────────────

describe('SUGGESTED_PLANT_NAMES — name type and content', () => {
  const species: PlantSpecies[] = ['girasol', 'margarita', 'lirio', 'helecho']

  it.each(species)('all names for %s are non-empty strings', (s) => {
    // Arrange
    const names = SUGGESTED_PLANT_NAMES[s]

    // Act / Assert
    for (const name of names) {
      expect(typeof name).toBe('string')
      expect(name.trim().length).toBeGreaterThan(0)
    }
  })

  it.each(species)('all names for %s have 20 characters or fewer', (s) => {
    // Arrange
    const names = SUGGESTED_PLANT_NAMES[s]

    // Act / Assert
    for (const name of names) {
      expect(name.length).toBeLessThanOrEqual(20)
    }
  })

  it('no species has duplicate suggested names', () => {
    // Arrange
    const allSpecies: PlantSpecies[] = ['girasol', 'margarita', 'lirio', 'helecho']

    for (const s of allSpecies) {
      // Act
      const names = SUGGESTED_PLANT_NAMES[s]
      const unique = new Set(names)

      // Assert
      expect(unique.size).toBe(names.length)
    }
  })
})

// ── Structure integrity ───────────────────────────────────────────────────────

describe('SUGGESTED_PLANT_NAMES — structure integrity', () => {
  it('is a record (plain object) and not null/undefined', () => {
    // Arrange / Act / Assert
    expect(SUGGESTED_PLANT_NAMES).toBeDefined()
    expect(typeof SUGGESTED_PLANT_NAMES).toBe('object')
    expect(SUGGESTED_PLANT_NAMES).not.toBeNull()
  })

  it('each value is an array', () => {
    // Arrange
    const entries = Object.entries(SUGGESTED_PLANT_NAMES)

    // Act / Assert
    for (const [, names] of entries) {
      expect(Array.isArray(names)).toBe(true)
    }
  })
})
