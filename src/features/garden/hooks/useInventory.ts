/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { gardenKeys } from './useGarden'
import type { InventoryItem, ShopItem, SpecialPower } from '../types'

async function fetchInventory(userId: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('user_plant_inventory' as any)
    .select('*, shop_item:shop_item_id(*)')
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  return (data as any[]).map((row): InventoryItem => {
    const s = row.shop_item as any
    const shopItem: ShopItem = {
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      price: s.price,
      species: s.species,
      emoji: s.emoji,
      specialPower: (s.special_power ?? null) as SpecialPower | null,
      powerDescription: s.power_description ?? null,
      isCosmetic: s.is_cosmetic,
      sortOrder: s.sort_order,
    }
    return {
      id: row.id,
      shopItem,
      isPlaced: row.is_placed,
      posX: row.pos_x ?? null,
      posY: row.pos_y ?? null,
      purchasedAt: row.purchased_at,
    }
  })
}

export function useInventory() {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  return useQuery({
    queryKey: gardenKeys.inventory(userId),
    queryFn: () => fetchInventory(userId),
    enabled: !!userId,
    staleTime: 30_000,
  })
}

export function usePurchaseItem() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (shopItemId: string) => {
      if (!user?.id) throw new Error('Not authenticated')
      const { data, error } = await supabase.rpc('buy_shop_item' as any, {
        p_user_id: user.id,
        p_shop_item_id: shopItemId,
      })
      if (error) throw error
      const result = data as any
      if (result?.error) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
      toast({ title: '¡Comprado! 🌱', description: 'Encuéntralo en tu inventario.' })
    },
    onError: (err: Error) => {
      const msg = err.message === 'insufficient_coins'
        ? 'No tienes suficientes monedas.'
        : 'No se pudo completar la compra.'
      toast({ variant: 'destructive', title: 'Error al comprar', description: msg })
    },
  })
}

export function usePlaceItem() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ inventoryId, posX, posY }: { inventoryId: string; posX: number; posY: number }) => {
      if (!user?.id) throw new Error('Not authenticated')
      const { data, error } = await supabase.rpc('place_inventory_item' as any, {
        p_user_id: user.id,
        p_inventory_id: inventoryId,
        p_pos_x: posX,
        p_pos_y: posY,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'No se pudo colocar la planta', description: 'Intenta de nuevo.' })
    },
  })
}

export function useActivatePower() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (inventoryId: string) => {
      if (!user?.id) throw new Error('Not authenticated')
      const { data, error } = await supabase.rpc('activate_special_power' as any, {
        p_user_id: user.id,
        p_inventory_id: inventoryId,
      })
      if (error) throw error
      const result = data as any
      if (result?.error) throw new Error(result.error)
      return result as { power: string; active_until: string }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all })
      const labels: Record<string, string> = {
        fire: '¡Racha protegida por 24h! 🔥',
        gold: '¡Árbol dorado activo! +10 monedas/día 🥇',
        ice: '¡Renta congelada por 24h! 🧊',
      }
      toast({ title: labels[data.power] ?? '¡Poder activado!' })
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'No se pudo activar el poder' })
    },
  })
}
