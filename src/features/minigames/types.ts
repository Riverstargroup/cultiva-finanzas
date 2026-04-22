export type GameId = 'presupuesto_rapido' | 'inflacion_challenge'
export type GameState = 'idle' | 'playing' | 'done'
export interface GameResult {
  score: number
  won: boolean
  masteryEarned?: number
  coinsEarned?: number
}
