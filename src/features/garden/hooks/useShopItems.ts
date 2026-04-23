import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { gardenKeys } from './useGarden'
import type { ShopItem, SpecialPower } from '../types'

async function fetchShopItems(): Promise<ShopItem[]> {
  const { data, error } = await supabase
    .from('plant_shop_items' as any)
    .select('*')
    .eq('is_available', true)
    .order('sort_order')

  if (error) throw error
  if (!data) return []

  return (data as any[]).map((row): ShopItem => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    species: row.species,
    emoji: row.emoji,
    specialPower: (row.special_power ?? null) as SpecialPower | null,
    powerDescription: row.power_description ?? null,
    isCosmetic: row.is_cosmetic,
    sortOrder: row.sort_order,
  }))
}

export function useShopItems() {
  return useQuery({
    queryKey: gardenKeys.shop,
    queryFn: fetchShopItems,
    staleTime: 5 * 60_000,
  })
}
