import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useDueCards } from './useDueCards'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock Supabase client before imports resolve
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

// Mock AuthContext so we control the user
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

function mockAuthUser(id: string) {
  ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
    user: { id },
    session: null,
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
  })
}

function mockNoAuthUser() {
  ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
    user: null,
    session: null,
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
  })
}

// Helper to mock the full Supabase query builder chain
function mockSupabaseQuery(resolvedData: unknown[] | null, error: unknown = null) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: resolvedData, error }),
  }
  ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)
  return chain
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useDueCards', () => {
  it('returns empty cards array when no user is logged in', async () => {
    // Arrange
    mockNoAuthUser()

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert — query is disabled when there is no userId, so cards stay empty
    expect(result.current.cards).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('loading is true initially when user is present', async () => {
    // Arrange
    mockAuthUser('user-123')
    // Do not resolve the query immediately
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnValue(new Promise(() => {})), // never resolves
    }
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    expect(result.current.isLoading).toBe(true)
  })

  it('returns cards when due date is in the past', async () => {
    // Arrange
    const pastDate = new Date(Date.now() - 86_400_000).toISOString() // yesterday
    mockAuthUser('user-123')
    mockSupabaseQuery([
      {
        id: 'card-1',
        domain: 'control',
        front_text: 'Front',
        back_text: 'Back',
        ease_factor: 2.5,
        interval_days: 1,
        next_review_at: pastDate,
        user_id: 'user-123',
      },
    ])

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toHaveLength(1)
    expect(result.current.cards[0].id).toBe('card-1')
    expect(result.current.count).toBe(1)
  })

  it('returns empty array when Supabase returns no rows', async () => {
    // Arrange
    mockAuthUser('user-456')
    mockSupabaseQuery([])

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('returns empty array when Supabase returns null data', async () => {
    // Arrange
    mockAuthUser('user-456')
    mockSupabaseQuery(null)

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toEqual([])
  })

  it('maps snake_case DB columns to camelCase Flashcard fields', async () => {
    // Arrange
    const nextReview = new Date(Date.now() - 1000).toISOString()
    mockAuthUser('user-123')
    mockSupabaseQuery([
      {
        id: 'card-42',
        domain: 'credito',
        front_text: 'Pregunta',
        back_text: 'Respuesta',
        ease_factor: 2.8,
        interval_days: 7,
        next_review_at: nextReview,
        user_id: 'user-123',
      },
    ])

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Assert
    const card = result.current.cards[0]
    expect(card.frontText).toBe('Pregunta')
    expect(card.backText).toBe('Respuesta')
    expect(card.easeFactor).toBe(2.8)
    expect(card.intervalDays).toBe(7)
    expect(card.nextReviewAt).toBe(nextReview)
  })

  it('does not apply a domain eq filter when no domain is provided', async () => {
    // Arrange — no domain argument means domain eq is never called
    mockAuthUser('user-123')
    const chain = mockSupabaseQuery([])

    // Act
    const { result } = renderHook(() => useDueCards(), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Assert — eq was called only once (for user_id, not for domain)
    const eqCalls = (chain.eq as ReturnType<typeof vi.fn>).mock.calls
    const domainCall = eqCalls.find(([col]: string[]) => col === 'domain')
    expect(domainCall).toBeUndefined()
  })
})
