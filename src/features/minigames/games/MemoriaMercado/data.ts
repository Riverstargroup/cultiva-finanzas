export type InstrumentId = 'cetes' | 'plazo' | 'acciones' | 'fibras' | 'cripto' | 'afore'

export interface InstrumentPair {
  instrumentId: InstrumentId
  name: string
  descriptor: string
  iconName: string
}

export interface MemoryCard {
  id: string
  pairKey: InstrumentId
  face: 'name' | 'desc'
  content: string
}

export const PAIRS: readonly InstrumentPair[] = [
  {
    instrumentId: 'cetes',
    name: 'CETES',
    descriptor: 'Deuda del gobierno, bajo riesgo, ~10.5% anual',
    iconName: 'Landmark',
  },
  {
    instrumentId: 'plazo',
    name: 'Depósito a plazo',
    descriptor: 'Ahorro fijo en banco, tasa garantizada',
    iconName: 'PiggyBank',
  },
  {
    instrumentId: 'acciones',
    name: 'Acciones BMV',
    descriptor: 'Participación en empresas, alto riesgo/retorno',
    iconName: 'TrendingUp',
  },
  {
    instrumentId: 'fibras',
    name: 'FIBRA',
    descriptor: 'Bienes raíces cotizados en bolsa, dividendos mensuales',
    iconName: 'Building2',
  },
  {
    instrumentId: 'cripto',
    name: 'Criptomonedas',
    descriptor: 'Activo digital descentralizado, muy alta volatilidad',
    iconName: 'Bitcoin',
  },
  {
    instrumentId: 'afore',
    name: 'AFORE',
    descriptor: 'Fondo de retiro obligatorio, rendimiento compuesto',
    iconName: 'Clock',
  },
]

function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

export function buildDeck(pairs: readonly InstrumentPair[]): MemoryCard[] {
  const cards: MemoryCard[] = []
  for (const pair of pairs) {
    cards.push({
      id: `${pair.instrumentId}-name`,
      pairKey: pair.instrumentId,
      face: 'name',
      content: pair.name,
    })
    cards.push({
      id: `${pair.instrumentId}-desc`,
      pairKey: pair.instrumentId,
      face: 'desc',
      content: pair.descriptor,
    })
  }
  return shuffle(cards)
}
