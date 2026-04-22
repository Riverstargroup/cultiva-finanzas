export interface Prediction {
  id: string
  userId: string
  scenarioId: string
  predictedValue: number
  actualValue: number | null
  wasCorrect: boolean | null
  coinsEarned: number
  createdAt: string
}

export interface PredictionState {
  prediction: Prediction | null
  isLoading: boolean
  isSaving: boolean
}
