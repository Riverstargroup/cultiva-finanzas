export type Zone = 'necesidades' | 'deseos' | 'ahorro' | 'deudas'

export const ZONES: readonly Zone[] = ['necesidades', 'deseos', 'ahorro', 'deudas'] as const

export interface Gasto {
  readonly id: string
  readonly label: string
  readonly emoji: string
  readonly amount: number
  readonly correct: Zone
  readonly explanation: string
}

export const GASTOS: readonly Gasto[] = [
  {
    id: '1',
    label: 'Renta del departamento',
    emoji: '🏠',
    amount: 4500,
    correct: 'necesidades',
    explanation: 'La vivienda es necesaria para vivir',
  },
  {
    id: '2',
    label: 'Netflix',
    emoji: '📺',
    amount: 219,
    correct: 'deseos',
    explanation: 'Entretenimiento, no esencial',
  },
  {
    id: '3',
    label: 'Fondo de emergencia',
    emoji: '💰',
    amount: 500,
    correct: 'ahorro',
    explanation: 'Colchón financiero para imprevistos',
  },
  {
    id: '4',
    label: 'Comida del mercado',
    emoji: '🛒',
    amount: 800,
    correct: 'necesidades',
    explanation: 'Alimentos básicos son necesidad',
  },
  {
    id: '5',
    label: 'Salida a restaurante',
    emoji: '🍽️',
    amount: 350,
    correct: 'deseos',
    explanation: 'Comer fuera es un lujo',
  },
  {
    id: '6',
    label: 'Seguro médico IMSS voluntario',
    emoji: '🏥',
    amount: 700,
    correct: 'necesidades',
    explanation: 'Protección de salud es necesidad',
  },
  {
    id: '7',
    label: 'Café de Starbucks',
    emoji: '☕',
    amount: 120,
    correct: 'deseos',
    explanation: 'Capricho que puede reducirse',
  },
  {
    id: '8',
    label: 'Pago mínimo tarjeta de crédito',
    emoji: '💳',
    amount: 500,
    correct: 'deudas',
    explanation: 'Obligación crediticia a saldar',
  },
  {
    id: '9',
    label: 'Metro / transporte',
    emoji: '🚇',
    amount: 300,
    correct: 'necesidades',
    explanation: 'Transporte al trabajo es necesidad',
  },
  {
    id: '10',
    label: 'Spotify Premium',
    emoji: '🎧',
    amount: 109,
    correct: 'deseos',
    explanation: 'Música en streaming es entretenimiento',
  },
  {
    id: '11',
    label: 'Aportación voluntaria Afore',
    emoji: '🏦',
    amount: 300,
    correct: 'ahorro',
    explanation: 'Inversión para tu retiro',
  },
  {
    id: '12',
    label: 'Préstamo personal pendiente',
    emoji: '📉',
    amount: 1000,
    correct: 'deudas',
    explanation: 'Deuda que genera intereses',
  },
  {
    id: '13',
    label: 'Útiles escolares',
    emoji: '📚',
    amount: 450,
    correct: 'necesidades',
    explanation: 'Educación es inversión necesaria',
  },
  {
    id: '14',
    label: 'Ropa nueva',
    emoji: '👕',
    amount: 600,
    correct: 'deseos',
    explanation: 'Vestuario extra es deseo',
  },
  {
    id: '15',
    label: 'CETES Directo',
    emoji: '📈',
    amount: 500,
    correct: 'ahorro',
    explanation: 'Inversión de bajo riesgo',
  },
]
