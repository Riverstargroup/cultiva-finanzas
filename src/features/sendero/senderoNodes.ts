import type { GameId } from '@/features/minigames'

export type SenderoNodeStatus = 'completed' | 'next' | 'available' | 'locked' | 'boss'
export type SenderoNodeType = 'lesson' | 'review' | 'game' | 'chest' | 'home' | 'shop' | 'boss'
export type SenderoNodeAction = 'lesson' | 'course' | 'review' | 'game' | 'shop'
export type SenderoModuleStatus = 'active' | 'choice' | 'locked'

export interface SenderoNode {
  id: string
  moduleId: string
  title: string
  description: string
  reward: string
  status: SenderoNodeStatus
  type: SenderoNodeType
  actionLabel: string
  action: SenderoNodeAction
  courseSlug?: string
  scenarioOrder?: number
  learningDomain?: 'control' | 'credito' | 'proteccion' | 'crecimiento'
  gameId?: GameId
  requiredCompletedScenarios?: number
  position: { x: number; y: number }
}

export const SENDERO_PHASE_ONE_TITLE = 'Finanzas basicas'
export const SENDERO_PHASE_ONE_COURSE_SLUG = 'raices-control-sin-dolor'

export interface SenderoModulePreview {
  id: string
  title: string
  description: string
  status: SenderoModuleStatus
  reward: string
  tone: 'control' | 'credito' | 'proteccion' | 'crecimiento'
}

export const SENDERO_MODULE_PREVIEWS: readonly SenderoModulePreview[] = [
  {
    id: 'control-basico',
    title: 'Finanzas basicas',
    description: 'Controla fugas, arma tu presupuesto y derrota al Gasto Hormiga.',
    status: 'active',
    reward: 'Nopalito + monedas',
    tone: 'control',
  },
  {
    id: 'credito-sin-miedo',
    title: 'Credito sin miedo',
    description: 'Aprende a usar tu primera tarjeta sin caer en intereses.',
    status: 'choice',
    reward: 'Lirio Guardian',
    tone: 'credito',
  },
  {
    id: 'proteccion-adulta',
    title: 'Proteccion adulta',
    description: 'IMSS, GMM, seguro de vida y decisiones para cubrir riesgos reales.',
    status: 'choice',
    reward: 'Helecho Sabio',
    tone: 'proteccion',
  },
  {
    id: 'crecimiento-afore',
    title: 'Crecimiento y Afore',
    description: 'Interes compuesto, retiro y primeros pasos para invertir mejor.',
    status: 'locked',
    reward: 'Brotin Dorado',
    tone: 'crecimiento',
  },
] as const

export const SENDERO_PHASE_ONE_NODES: readonly SenderoNode[] = [
  {
    id: 'first-seed',
    moduleId: 'control-basico',
    title: 'Primera semilla',
    description: 'Empieza Finanzas Basicas y gana tu primer companero.',
    reward: '+40 monedas',
    status: 'next',
    type: 'lesson',
    actionLabel: 'Empezar leccion',
    action: 'lesson',
    courseSlug: SENDERO_PHASE_ONE_COURSE_SLUG,
    scenarioOrder: 1,
    learningDomain: 'control',
    position: { x: 51, y: 12.5 },
  },
  {
    id: 'presupuesto-rapido',
    moduleId: 'control-basico',
    title: 'Presupuesto rapido',
    description: 'Clasifica gastos como necesidad, deseo o ahorro antes de que se acabe el tiempo.',
    reward: 'entrenamiento',
    status: 'available',
    type: 'game',
    actionLabel: 'Jugar',
    action: 'game',
    learningDomain: 'control',
    gameId: 'presupuesto-rapido',
    requiredCompletedScenarios: 1,
    position: { x: 60, y: 25.5 },
  },
  {
    id: 'flash-review',
    moduleId: 'control-basico',
    title: 'Repaso express',
    description: 'Refuerza conceptos antes de que el camino se bloquee.',
    reward: 'racha y memoria',
    status: 'available',
    type: 'review',
    actionLabel: 'Repasar',
    action: 'review',
    learningDomain: 'control',
    requiredCompletedScenarios: 1,
    position: { x: 40, y: 36.5 },
  },
  {
    id: 'seed-chest',
    moduleId: 'control-basico',
    title: 'Cofre de semillas',
    description: 'Recompensas por mantener el ritmo del aprendizaje.',
    reward: 'monedas bonus',
    status: 'available',
    type: 'chest',
    actionLabel: 'Ver recompensa',
    action: 'course',
    courseSlug: SENDERO_PHASE_ONE_COURSE_SLUG,
    scenarioOrder: 2,
    learningDomain: 'control',
    requiredCompletedScenarios: 2,
    position: { x: 58, y: 47.8 },
  },
  {
    id: 'garden-home',
    moduleId: 'control-basico',
    title: 'Casita del jardin',
    description: 'Aqui viviran tus plantamigos, outfits y estadisticas.',
    reward: 'coleccion',
    status: 'locked',
    type: 'home',
    actionLabel: 'Pronto',
    action: 'course',
    courseSlug: SENDERO_PHASE_ONE_COURSE_SLUG,
    learningDomain: 'control',
    requiredCompletedScenarios: 3,
    position: { x: 47, y: 60.3 },
  },
  {
    id: 'shop-gate',
    moduleId: 'control-basico',
    title: 'Tienda botanica',
    description: 'Compra cosmeticos para tu viajero y plantamigos.',
    reward: 'desbloqueos',
    status: 'available',
    type: 'shop',
    actionLabel: 'Abrir tienda',
    action: 'shop',
    learningDomain: 'control',
    requiredCompletedScenarios: 2,
    position: { x: 58, y: 73.2 },
  },
  {
    id: 'boss-gasto',
    moduleId: 'control-basico',
    title: 'Gasto Hormiga',
    description: 'Un bloqueo que se debilita con lecciones, repasos y juegos.',
    reward: 'jefe de fase',
    status: 'boss',
    type: 'boss',
    actionLabel: 'Seguir entrenando',
    action: 'lesson',
    courseSlug: SENDERO_PHASE_ONE_COURSE_SLUG,
    scenarioOrder: 3,
    learningDomain: 'control',
    requiredCompletedScenarios: 3,
    position: { x: 49, y: 88 },
  },
] as const
