import { describe, it, expect } from 'vitest'
import { masteryToStage, healthToState, masteryProgress } from './stage'

describe('masteryToStage', () => {
  // Seed: [0.0, 0.2)
  it('returns seed at mastery 0.0 (lower boundary)', () => {
    // Arrange
    const mastery = 0.0
    // Act
    const stage = masteryToStage(mastery)
    // Assert
    expect(stage).toBe('seed')
  })

  it('returns seed at mastery 0.19 (just below sprout boundary)', () => {
    const stage = masteryToStage(0.19)
    expect(stage).toBe('seed')
  })

  // Sprout: [0.2, 0.4)
  it('returns sprout at mastery 0.2 (lower boundary)', () => {
    const stage = masteryToStage(0.2)
    expect(stage).toBe('sprout')
  })

  it('returns sprout at mastery 0.39 (just below growing boundary)', () => {
    const stage = masteryToStage(0.39)
    expect(stage).toBe('sprout')
  })

  // Growing: [0.4, 0.6)
  it('returns growing at mastery 0.4 (lower boundary)', () => {
    const stage = masteryToStage(0.4)
    expect(stage).toBe('growing')
  })

  it('returns growing at mastery 0.5 (midpoint)', () => {
    const stage = masteryToStage(0.5)
    expect(stage).toBe('growing')
  })

  // Blooming: [0.6, 0.8)
  it('returns blooming at mastery 0.6 (lower boundary)', () => {
    const stage = masteryToStage(0.6)
    expect(stage).toBe('blooming')
  })

  it('returns blooming at mastery 0.75 (midpoint)', () => {
    const stage = masteryToStage(0.75)
    expect(stage).toBe('blooming')
  })

  // Mastered: [0.8, 1.01)
  it('returns mastered at mastery 0.8 (lower boundary)', () => {
    const stage = masteryToStage(0.8)
    expect(stage).toBe('mastered')
  })

  it('returns mastered at mastery 1.0 (full mastery)', () => {
    const stage = masteryToStage(1.0)
    expect(stage).toBe('mastered')
  })
})

describe('healthToState', () => {
  // Thriving: health >= 75
  it('returns thriving at health 100', () => {
    // Arrange
    const health = 100
    // Act
    const state = healthToState(health)
    // Assert
    expect(state).toBe('thriving')
  })

  it('returns thriving at health 75 (lower boundary)', () => {
    const state = healthToState(75)
    expect(state).toBe('thriving')
  })

  // Healthy: [50, 75)
  it('returns healthy at health 74 (just below thriving boundary)', () => {
    const state = healthToState(74)
    expect(state).toBe('healthy')
  })

  it('returns healthy at health 50 (lower boundary)', () => {
    const state = healthToState(50)
    expect(state).toBe('healthy')
  })

  // Wilting: [25, 50)
  it('returns wilting at health 49 (just below healthy boundary)', () => {
    const state = healthToState(49)
    expect(state).toBe('wilting')
  })

  it('returns wilting at health 25 (lower boundary)', () => {
    const state = healthToState(25)
    expect(state).toBe('wilting')
  })

  // Dying: health < 25
  it('returns dying at health 24 (just below wilting boundary)', () => {
    const state = healthToState(24)
    expect(state).toBe('dying')
  })

  it('returns dying at health 0 (minimum health)', () => {
    const state = healthToState(0)
    expect(state).toBe('dying')
  })
})

describe('masteryProgress', () => {
  it('returns 0 at the start of a stage', () => {
    // Arrange — seed starts at 0.0, range is 0.2
    const mastery = 0.0
    // Act
    const progress = masteryProgress(mastery, 'seed')
    // Assert
    expect(progress).toBe(0)
  })

  it('returns 0.5 at the midpoint of a stage', () => {
    // Arrange — seed midpoint is 0.1 out of [0.0, 0.2)
    const progress = masteryProgress(0.1, 'seed')
    expect(progress).toBeCloseTo(0.5)
  })

  it('returns 1 when mastery reaches stage ceiling', () => {
    // Arrange — seed ceiling is 0.2 → progress capped at 1
    const progress = masteryProgress(0.2, 'seed')
    expect(progress).toBe(1)
  })

  it('returns 1 when mastery exceeds stage ceiling (capped)', () => {
    const progress = masteryProgress(0.5, 'seed')
    expect(progress).toBe(1)
  })

  it('returns progress capped at 1 when mastery exceeds stage ceiling for mastered', () => {
    // Arrange — mastered is [0.8, 1.01), range = 0.21
    // masteryProgress caps at 1 only when mastery >= maxMastery (1.01)
    const progress = masteryProgress(1.01, 'mastered')
    expect(progress).toBe(1)
  })

  it('correctly calculates progress midpoint for blooming stage', () => {
    // Arrange — blooming is [0.6, 0.8), midpoint is 0.7
    const progress = masteryProgress(0.7, 'blooming')
    expect(progress).toBeCloseTo(0.5)
  })
})
