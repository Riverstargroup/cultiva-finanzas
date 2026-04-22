export interface Prediction {
  id: string
  userId: string
  scenarioId: string
  /** 0–100: user's predicted score as a percentage */
  predictedValue: number
  /** 0–100: actual score after completing scenario */
  actualValue: number | null
  wasCorrect: boolean | null
  coinsEarned: number
  createdAt: string
}

/** Prediction is "correct" if |predicted - actual| <= this threshold */
export const PREDICTION_CORRECT_THRESHOLD = 20

/** Coins awarded when prediction is correct */
export const PREDICTION_CORRECT_COINS = 50

/** Confidence level labels shown to user */
export const CONFIDENCE_OPTIONS = [
  { value: 20, label: 'Será difícil', emoji: '😰', description: 'Creo que voy a cometer errores' },
  { value: 40, label: 'Algo incierto', emoji: '🤔', description: 'No estoy del todo seguro' },
  { value: 60, label: 'Me defiendo', emoji: '🙂', description: 'Creo que voy a salir bien' },
  { value: 80, label: 'Lo tengo claro', emoji: '😎', description: 'Conozco el tema, voy a hacerlo bien' },
  { value: 100, label: 'Sin duda', emoji: '🏆', description: 'Voy a tomar las mejores decisiones' },
] as const

export type ConfidenceOption = (typeof CONFIDENCE_OPTIONS)[number]
