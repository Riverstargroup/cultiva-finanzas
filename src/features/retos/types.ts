export interface ChallengeTemplate {
  id: string
  title: string
  description: string | null
  targetMasteryDelta: number
  targetDomain: string | null
  rewardCoins: number
  difficulty: number
  emoji: string
  isActive: boolean
}

export interface WeeklyChallenge {
  id: string
  userId: string
  templateId: string
  weekStart: string
  progress: number
  completed: boolean
  harvested: boolean
  completedAt: string | null
  createdAt: string
  template: ChallengeTemplate | null
}
