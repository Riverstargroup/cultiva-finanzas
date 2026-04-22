import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import type { DragDropExercise, Placement, VerifyResult } from '../types'

export function useDragDropExercises() {
  return useQuery({
    queryKey: ['dragdrop', 'exercises'],
    queryFn: async (): Promise<DragDropExercise[]> => {
      const { data, error } = await supabase
        .from('dragdrop_exercises')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((row: any) => ({
        id: row.id,
        domain: row.domain,
        prompt: row.prompt,
        items: row.items,
        zones: row.zones,
        correctMapping: row.correct_mapping,
      }))
    },
    staleTime: 60_000,
  })
}

export function useDragDropSession(exercise: DragDropExercise | null) {
  const growPlant = useGrowPlant()
  const [placement, setPlacement] = useState<Placement>({})
  const [verifyResult, setVerifyResult] = useState<VerifyResult>(null)
  const [isDone, setIsDone] = useState(false)

  const allPlaced = exercise
    ? exercise.items.every(item => placement[item.id] !== undefined)
    : false

  const moveItem = (itemId: string, zoneId: string) => {
    setVerifyResult(null)
    setPlacement(prev => ({ ...prev, [itemId]: zoneId }))
  }

  const removeItem = (itemId: string) => {
    setVerifyResult(null)
    setPlacement(prev => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }

  const verify = () => {
    if (!exercise || !allPlaced) return
    const correct = exercise.items.every(
      item => placement[item.id] === exercise.correctMapping[item.id]
    )
    setVerifyResult(correct ? 'correct' : 'incorrect')
    if (correct) {
      growPlant.mutate({ domain: exercise.domain, masteryDelta: 0.05 })
      setIsDone(true)
    }
  }

  const reset = () => {
    setPlacement({})
    setVerifyResult(null)
    setIsDone(false)
  }

  return {
    placement,
    verifyResult,
    isDone,
    allPlaced,
    moveItem,
    removeItem,
    verify,
    reset,
    isGrowing: growPlant.isPending,
  }
}
