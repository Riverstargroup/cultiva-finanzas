import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Mock supabase client (pulled in transitively)
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}))

import { usePlantReactions } from './usePlantReactions'
import type { PlantAnimationKey } from '../types'

// ── Initial state ─────────────────────────────────────────────────────────────

describe('usePlantReactions — initial state', () => {
  it('getPlantCue returns null initially for a given plotId', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act
    const cue = result.current.getPlantCue('plot-1')

    // Assert
    expect(cue).toBeNull()
  })

  it('getPlantCue returns null for any unknown plotId', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act
    const cue1 = result.current.getPlantCue('plot-abc')
    const cue2 = result.current.getPlantCue('plot-xyz')

    // Assert
    expect(cue1).toBeNull()
    expect(cue2).toBeNull()
  })

  it('getPlantCue returns null for an empty string plotId', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act
    const cue = result.current.getPlantCue('')

    // Assert
    expect(cue).toBeNull()
  })
})

// ── Triggering cues ───────────────────────────────────────────────────────────

describe('usePlantReactions — triggering cues', () => {
  const cueTypes: PlantAnimationKey[] = ['watered', 'growth', 'glow', 'hover', 'idle']

  it.each(cueTypes)('getPlantCue returns "%s" after that cue is triggered for the plotId', (cueType) => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act
    act(() => {
      result.current.triggerCue('plot-1', cueType)
    })

    // Assert
    expect(result.current.getPlantCue('plot-1')).toBe(cueType)
  })

  it('only affects the targeted plotId, leaving others null', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act
    act(() => {
      result.current.triggerCue('plot-1', 'watered')
    })

    // Assert
    expect(result.current.getPlantCue('plot-1')).toBe('watered')
    expect(result.current.getPlantCue('plot-2')).toBeNull()
    expect(result.current.getPlantCue('plot-3')).toBeNull()
  })

  it('can hold different cues for different plotIds simultaneously', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act
    act(() => {
      result.current.triggerCue('plot-1', 'watered')
      result.current.triggerCue('plot-2', 'growth')
      result.current.triggerCue('plot-3', 'glow')
    })

    // Assert
    expect(result.current.getPlantCue('plot-1')).toBe('watered')
    expect(result.current.getPlantCue('plot-2')).toBe('growth')
    expect(result.current.getPlantCue('plot-3')).toBe('glow')
  })

  it('overwrites an existing cue when a new one is triggered for the same plotId', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act
    act(() => {
      result.current.triggerCue('plot-1', 'watered')
    })
    act(() => {
      result.current.triggerCue('plot-1', 'growth')
    })

    // Assert
    expect(result.current.getPlantCue('plot-1')).toBe('growth')
  })
})

// ── clearCue ──────────────────────────────────────────────────────────────────

describe('usePlantReactions — clearCue', () => {
  it('resets a triggered cue back to null', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())
    act(() => {
      result.current.triggerCue('plot-1', 'watered')
    })

    // Act
    act(() => {
      result.current.clearCue('plot-1')
    })

    // Assert
    expect(result.current.getPlantCue('plot-1')).toBeNull()
  })

  it('does not affect other plotIds when clearing one', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())
    act(() => {
      result.current.triggerCue('plot-1', 'watered')
      result.current.triggerCue('plot-2', 'growth')
    })

    // Act
    act(() => {
      result.current.clearCue('plot-1')
    })

    // Assert
    expect(result.current.getPlantCue('plot-1')).toBeNull()
    expect(result.current.getPlantCue('plot-2')).toBe('growth')
  })

  it('calling clearCue on a plotId that has no cue does not throw', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())

    // Act / Assert
    expect(() => {
      act(() => {
        result.current.clearCue('plot-never-set')
      })
    }).not.toThrow()
  })

  it('after clearing, a new cue can be triggered on the same plotId', () => {
    // Arrange
    const { result } = renderHook(() => usePlantReactions())
    act(() => {
      result.current.triggerCue('plot-1', 'watered')
    })
    act(() => {
      result.current.clearCue('plot-1')
    })

    // Act
    act(() => {
      result.current.triggerCue('plot-1', 'glow')
    })

    // Assert
    expect(result.current.getPlantCue('plot-1')).toBe('glow')
  })
})

// ── Referential stability ─────────────────────────────────────────────────────

describe('usePlantReactions — referential stability', () => {
  it('getPlantCue is a stable reference across re-renders', () => {
    // Arrange
    const { result, rerender } = renderHook(() => usePlantReactions())
    const firstRef = result.current.getPlantCue

    // Act
    rerender()

    // Assert
    expect(result.current.getPlantCue).toBe(firstRef)
  })

  it('clearCue is a stable reference across re-renders', () => {
    // Arrange
    const { result, rerender } = renderHook(() => usePlantReactions())
    const firstRef = result.current.clearCue

    // Act
    rerender()

    // Assert
    expect(result.current.clearCue).toBe(firstRef)
  })

  it('triggerCue is a stable reference across re-renders', () => {
    // Arrange
    const { result, rerender } = renderHook(() => usePlantReactions())
    const firstRef = result.current.triggerCue

    // Act — trigger a state update then re-render
    act(() => {
      result.current.triggerCue('plot-1', 'watered')
    })
    rerender()

    // Assert
    expect(result.current.triggerCue).toBe(firstRef)
  })
})
