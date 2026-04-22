import type { SkillDomain } from '@/features/garden/types'

export type DropZoneId = string

export interface DragItem {
  id: string
  label: string
  emoji?: string
}

export interface DragDropExercise {
  id: string
  domain: SkillDomain
  prompt: string
  items: DragItem[]
  zones: { id: DropZoneId; label: string }[]
  correctMapping: Record<string, DropZoneId>
}

export interface DragDropSession {
  exercise: DragDropExercise
  currentMapping: Record<string, DropZoneId>
  submitted: boolean
  correct: boolean | null
  masteryEarned: number
}
