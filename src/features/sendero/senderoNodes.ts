import type { GameId } from '@/features/minigames'

export type SenderoNodeStatus = 'completed' | 'next' | 'available' | 'locked' | 'boss'
export type SenderoNodeType = 'lesson' | 'review' | 'game' | 'chest' | 'home' | 'shop' | 'boss'
export type SenderoNodeAction = 'lesson' | 'course' | 'review' | 'game' | 'shop'

export interface SenderoNode {
  id: string
  title: string
  description: string
  reward: string
  status: SenderoNodeStatus
  type: SenderoNodeType
  actionLabel: string
  action: SenderoNodeAction
  gameId?: GameId
  requiredCompletedScenarios?: number
  position: { x: number; y: number }
}

export const SENDERO_PHASE_ONE_TITLE = 'Finanzas basicas'

export const SENDERO_PHASE_ONE_NODES: readonly SenderoNode[] = [
  {
    id: 'first-seed',
    title: 'Primera semilla',
    description: 'Empieza Finanzas Basicas y gana tu primer companero.',
    reward: '+40 monedas',
    status: 'next',
    type: 'lesson',
    actionLabel: 'Empezar leccion',
    action: 'lesson',
    position: { x: 51, y: 12.5 },
  },
  {
    id: 'presupuesto-rapido',
    title: 'Presupuesto rapido',
    description: 'Clasifica gastos como necesidad, deseo o ahorro antes de que se acabe el tiempo.',
    reward: 'entrenamiento',
    status: 'available',
    type: 'game',
    actionLabel: 'Jugar',
    action: 'game',
    gameId: 'presupuesto-rapido',
    requiredCompletedScenarios: 1,
    position: { x: 60, y: 25.5 },
  },
  {
    id: 'flash-review',
    title: 'Repaso express',
    description: 'Refuerza conceptos antes de que el camino se bloquee.',
    reward: 'racha y memoria',
    status: 'available',
    type: 'review',
    actionLabel: 'Repasar',
    action: 'review',
    requiredCompletedScenarios: 1,
    position: { x: 40, y: 36.5 },
  },
  {
    id: 'seed-chest',
    title: 'Cofre de semillas',
    description: 'Recompensas por mantener el ritmo del aprendizaje.',
    reward: 'monedas bonus',
    status: 'available',
    type: 'chest',
    actionLabel: 'Ver recompensa',
    action: 'course',
    requiredCompletedScenarios: 2,
    position: { x: 58, y: 47.8 },
  },
  {
    id: 'garden-home',
    title: 'Casita del jardin',
    description: 'Aqui viviran tus plantamigos, outfits y estadisticas.',
    reward: 'coleccion',
    status: 'locked',
    type: 'home',
    actionLabel: 'Pronto',
    action: 'course',
    requiredCompletedScenarios: 3,
    position: { x: 47, y: 60.3 },
  },
  {
    id: 'shop-gate',
    title: 'Tienda botanica',
    description: 'Compra cosmeticos para tu viajero y plantamigos.',
    reward: 'desbloqueos',
    status: 'available',
    type: 'shop',
    actionLabel: 'Abrir tienda',
    action: 'shop',
    requiredCompletedScenarios: 2,
    position: { x: 58, y: 73.2 },
  },
  {
    id: 'boss-gasto',
    title: 'Gasto Hormiga',
    description: 'Un bloqueo que se debilita con lecciones, repasos y juegos.',
    reward: 'jefe de fase',
    status: 'boss',
    type: 'boss',
    actionLabel: 'Seguir entrenando',
    action: 'lesson',
    requiredCompletedScenarios: 3,
    position: { x: 49, y: 88 },
  },
] as const
