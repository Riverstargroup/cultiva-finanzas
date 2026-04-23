import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useDueCards } from './useDueCards'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

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

type FlashcardRow = { id: string; front: string; back: string; domain: string }
type ReviewRow = { flashcard_id: string; ease_factor: number; interval_days: number; due_at: string }

/**
 * Mock the two-query pattern used by fetchDueCards:
 *  1. supabase.from('flashcards')   → chain that resolves with flashcardRows
 *  2. supabase.from('user_flashcard_reviews') → chain that resolves with reviewRows
 */
function mockTwoQueries(
  flashcardRows: FlashcardRow[] | null,
  reviewRows: ReviewRow[] | null = [],
) {
  const flashcardsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockResolvedValue({ data: flashcardRows, error: null }),
  }

  const reviewsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockResolvedValue({ data: reviewRows, error: null }),
  }

  // flashcardsChain resolves when .eq() is called last (is_published or domain)
  // We need await on the chain itself — override eq to resolve on last call
  // Simpler: override the whole chain so the last .eq() resolves the promise.
  // The flashcards query ends with `await query` where query = chain after optional .eq(domain).
  // We make the chain thenable so `await chain` resolves.
  const makeThenable = (data: FlashcardRow[] | null) => {
    const chain: Record<string, unknown> = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      then: (resolve: (v: { data: typeof data; error: null }) => void) =>
        resolve({ data, error: null }),
    }
    // Ensure eq returns the same thenable object
    ;(chain.eq as ReturnType<typeof vi.fn>).mockReturnValue(chain)
    ;(chain.select as ReturnType<typeof vi.fn>).mockReturnValue(chain)
    return chain
  }

  const flashcardsThen = makeThenable(flashcardRows)

  ;(supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
    if (table === 'flashcards') return flashcardsThen
    if (table === 'user_flashcard_reviews') return reviewsChain
    return reviewsChain
  })

  return { flashcardsChain: flashcardsThen, reviewsChain }
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

    // Assert — query is disabled when userId is empty
    expect(result.current.cards).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('loading is true initially when user is present', async () => {
    // Arrange
    mockAuthUser('user-123')
    // flashcards query never resolves
    const neverResolves = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      then: () => new Promise(() => {}),
    }
    ;(neverResolves.select as ReturnType<typeof vi.fn>).mockReturnValue(neverResolves)
    ;(neverResolves.eq as ReturnType<typeof vi.fn>).mockReturnValue(neverResolves)
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(neverResolves)

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    expect(result.current.isLoading).toBe(true)
  })

  it('returns cards that have never been reviewed (not in reviews set)', async () => {
    // Arrange
    mockAuthUser('user-123')
    mockTwoQueries(
      [{ id: 'card-1', domain: 'control', front: 'Front', back: 'Back' }],
      [], // no reviews → card is new → always due
    )

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toHaveLength(1)
    expect(result.current.cards[0].id).toBe('card-1')
    expect(result.current.count).toBe(1)
  })

  it('returns cards when due_at is in the past', async () => {
    // Arrange
    const pastDate = new Date(Date.now() - 86_400_000).toISOString() // yesterday
    mockAuthUser('user-123')
    mockTwoQueries(
      [{ id: 'card-1', domain: 'control', front: 'Front', back: 'Back' }],
      [{ flashcard_id: 'card-1', ease_factor: 2.5, interval_days: 1, due_at: pastDate }],
    )

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toHaveLength(1)
    expect(result.current.cards[0].id).toBe('card-1')
    expect(result.current.count).toBe(1)
  })

  it('excludes cards whose due_at is in the future', async () => {
    // Arrange
    const futureDate = new Date(Date.now() + 86_400_000).toISOString() // tomorrow
    mockAuthUser('user-123')
    mockTwoQueries(
      [{ id: 'card-1', domain: 'control', front: 'Front', back: 'Back' }],
      [{ flashcard_id: 'card-1', ease_factor: 2.5, interval_days: 1, due_at: futureDate }],
    )

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert — card is in reviews but not yet due
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('returns empty array when Supabase returns no flashcard rows', async () => {
    // Arrange
    mockAuthUser('user-456')
    mockTwoQueries([])

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('returns empty array when Supabase returns null flashcard data', async () => {
    // Arrange
    mockAuthUser('user-456')
    mockTwoQueries(null)

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cards).toEqual([])
  })

  it('maps DB columns to camelCase Flashcard fields', async () => {
    // Arrange
    const pastDate = new Date(Date.now() - 1000).toISOString()
    mockAuthUser('user-123')
    mockTwoQueries(
      [{ id: 'card-42', domain: 'credito', front: 'Pregunta', back: 'Respuesta' }],
      [{ flashcard_id: 'card-42', ease_factor: 2.8, interval_days: 7, due_at: pastDate }],
    )

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Assert
    const card = result.current.cards[0]
    expect(card.id).toBe('card-42')
    expect(card.domain).toBe('credito')
    expect(card.frontText).toBe('Pregunta')
    expect(card.backText).toBe('Respuesta')
    expect(card.easeFactor).toBe(2.8)
    expect(card.intervalDays).toBe(7)
    expect(card.nextReviewAt).toBe(pastDate)
  })

  it('uses default SM-2 values for never-reviewed cards', async () => {
    // Arrange
    mockAuthUser('user-123')
    mockTwoQueries(
      [{ id: 'card-1', domain: 'control', front: 'Front', back: 'Back' }],
      [], // no reviews
    )

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Assert — defaults: easeFactor=2.5, intervalDays=0
    const card = result.current.cards[0]
    expect(card.easeFactor).toBe(2.5)
    expect(card.intervalDays).toBe(0)
  })

  it('applies domain filter when domain argument is provided', async () => {
    // Arrange
    mockAuthUser('user-123')
    const { flashcardsChain } = mockTwoQueries([], [])

    // Act
    const { result } = renderHook(() => useDueCards('control'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Assert — eq called with 'domain' on flashcards chain
    const eqCalls = (flashcardsChain.eq as ReturnType<typeof vi.fn>).mock.calls
    const domainCall = eqCalls.find(([col]: string[]) => col === 'domain')
    expect(domainCall).toBeDefined()
    expect(domainCall?.[1]).toBe('control')
  })

  it('does not apply domain eq filter when no domain is provided', async () => {
    // Arrange
    mockAuthUser('user-123')
    const { flashcardsChain } = mockTwoQueries([], [])

    // Act
    const { result } = renderHook(() => useDueCards(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Assert — eq should only be called for 'is_published', not 'domain'
    const eqCalls = (flashcardsChain.eq as ReturnType<typeof vi.fn>).mock.calls
    const domainCall = eqCalls.find(([col]: string[]) => col === 'domain')
    expect(domainCall).toBeUndefined()
  })
})
