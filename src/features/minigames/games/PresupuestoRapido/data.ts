export const GASTOS = [
  { id: '1', label: 'Renta del departamento', emoji: '🏠', correct: 'necesidades' },
  { id: '2', label: 'Netflix', emoji: '📺', correct: 'deseos' },
  { id: '3', label: 'Fondo de emergencia', emoji: '💰', correct: 'ahorro' },
  { id: '4', label: 'Comida', emoji: '🛒', correct: 'necesidades' },
  { id: '5', label: 'Salida a restaurante', emoji: '🍽️', correct: 'deseos' },
  { id: '6', label: 'Seguro médico', emoji: '🏥', correct: 'necesidades' },
] as const

export const ZONES = ['necesidades', 'deseos', 'ahorro'] as const
export type Zone = (typeof ZONES)[number]
