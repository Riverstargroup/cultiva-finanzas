import type { SkillDomain } from '@/features/garden/types'

export interface DragItem {
  id: string
  label: string
  emoji?: string
}

export interface DropZone {
  id: string
  label: string
}

export interface DragDropExercise {
  id: string
  domain: SkillDomain
  prompt: string
  items: DragItem[]
  zones: DropZone[]
  correctMapping: Record<string, string>
}

export type Placement = Record<string, string>

export type VerifyResult = 'correct' | 'incorrect' | null
