import { vi } from 'vitest'

// Fluent chain builder – each call returns an object whose methods continue the chain
// and ultimately resolve to { data, error } via .then()
export function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'eq', 'order', 'single', 'limit'] as const
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  // Make the chain thenable so `await chain` resolves to result
  chain.then = (resolve: (v: typeof result) => unknown) => Promise.resolve(result).then(resolve)
  return chain
}

export const mockSupabaseFrom = vi.fn()
export const mockSupabaseRpc = vi.fn()

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockSupabaseFrom,
    rpc: mockSupabaseRpc,
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}))
