import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

// Mock supabase before importing anything that uses it
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

// Mock AuthContext so useGarden can get a userId
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: { id: 'user-123' } })),
}))

import { supabase } from '@/integrations/supabase/client'
import { fetchGardenPlots, fetchCoinBalance, useGrowPlant, gardenKeys } from './useGarden'

const mockFrom = supabase.from as ReturnType<typeof vi.fn>
const mockRpc = supabase.rpc as ReturnType<typeof vi.fn>

function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'eq', 'order', 'single', 'maybeSingle', 'limit']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  chain.then = (resolve: (v: typeof result) => unknown) =>
    Promise.resolve(result).then(resolve)
  return chain
}

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ── fetchGardenPlots ───────────────────────────────────────────────────────────

describe('fetchGardenPlots', () => {
  it('returns mapped plots when data is present', async () => {
    const row = {
      id: 'plot-1',
      user_id: 'user-123',
      domain: 'control',
      mastery: 0.35,
      health: 80,
      last_watered_at: null,
      updated_at: '2024-01-01',
      plant_species: {},
    }
    mockFrom.mockReturnValue(makeChain({ data: [row], error: null }))

    const plots = await fetchGardenPlots('user-123')

    expect(plots).toHaveLength(1)
    expect(plots[0].domain).toBe('control')
    expect(plots[0].plant.species).toBe('margarita')
    expect(plots[0].plant.stage).toBe('sprout')
    expect(plots[0].plant.healthState).toBe('thriving')
  })

  it('returns empty array when no data', async () => {
    mockFrom.mockReturnValue(makeChain({ data: [], error: null }))
    const plots = await fetchGardenPlots('user-123')
    expect(plots).toEqual([])
  })

  it('throws when supabase returns an error', async () => {
    mockFrom.mockReturnValue(makeChain({ data: null, error: { message: 'db error' } }))
    await expect(fetchGardenPlots('user-123')).rejects.toMatchObject({ message: 'db error' })
  })
})

// ── fetchCoinBalance ───────────────────────────────────────────────────────────

describe('fetchCoinBalance', () => {
  it('returns 0 when coins is 0', async () => {
    mockFrom.mockReturnValue(makeChain({ data: { coins: 0 }, error: null }))
    expect(await fetchCoinBalance('user-123')).toBe(0)
  })

  it('returns coin count when coins exist', async () => {
    mockFrom.mockReturnValue(makeChain({ data: { coins: 150 }, error: null }))
    expect(await fetchCoinBalance('user-123')).toBe(150)
  })

  it('returns 0 on error (silent fallback)', async () => {
    mockFrom.mockReturnValue(makeChain({ data: null, error: { message: 'not found' } }))
    expect(await fetchCoinBalance('user-123')).toBe(0)
  })
})

// ── useGrowPlant ───────────────────────────────────────────────────────────────

describe('useGrowPlant', () => {
  it('calls RPC grow_plant with correct params and invalidates gardenKeys.all', async () => {
    mockRpc.mockResolvedValue({ data: null, error: null })

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

    const { result } = renderHook(() => useGrowPlant(), {
      wrapper: ({ children }) => createElement(QueryClientProvider, { client: qc }, children),
    })

    result.current.mutate({ domain: 'control', masteryDelta: 0.1 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockRpc).toHaveBeenCalledWith('grow_plant', {
      p_user_id: 'user-123',
      p_domain: 'control',
      p_mastery_delta: 0.1,
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: gardenKeys.all })
  })
})
