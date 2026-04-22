import { describe, it, expect, test } from 'vitest'
import { masteryToStage, healthToState, masteryProgress } from './stage'
import type { GrowthStage } from '../types'

describe('masteryToStage', () => {
  test.each([
    [0.0,   'seed'],
    [0.1,   'seed'],
    [0.199, 'seed'],
    [0.2,   'sprout'],
    [0.3,   'sprout'],
    [0.4,   'growing'],
    [0.5,   'growing'],
    [0.6,   'blooming'],
    [0.75,  'blooming'],
    [0.8,   'mastered'],
    [1.1,   'mastered'], // beyond all thresholds → fallback
  ] as [number, GrowthStage][])(
    'mastery %s → %s',
    (mastery, expected) => {
      expect(masteryToStage(mastery)).toBe(expected)
    }
  )
})

describe('healthToState', () => {
  test.each([
    [100, 'thriving'],
    [75,  'thriving'],
    [74,  'healthy'],
    [50,  'healthy'],
    [49,  'wilting'],
    [25,  'wilting'],
    [24,  'dying'],
    [0,   'dying'],
  ] as [number, string][])(
    'health %s → %s',
    (health, expected) => {
      expect(healthToState(health)).toBe(expected)
    }
  )
})

describe('masteryProgress', () => {
  it('returns 0 at the start of a stage', () => {
    expect(masteryProgress(0.0, 'seed')).toBeCloseTo(0)
  })

  it('returns 0.5 at the midpoint of a stage', () => {
    expect(masteryProgress(0.5, 'growing')).toBeCloseTo(0.5)
  })

  it('returns 1 when mastery is at stage ceiling', () => {
    expect(masteryProgress(0.2, 'seed')).toBeCloseTo(1)
  })

  it('returns 1 when stage threshold is not found', () => {
    // Cast to bypass type safety — tests the defensive branch
    expect(masteryProgress(0.5, 'unknown' as GrowthStage)).toBe(1)
  })
})
