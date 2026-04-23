export interface SavingsRound {
  id: number
  monthlyIncomeMXN: number
  situation: string
  targetPct: number
  bandTolerance: number
  explanation: string
}

export const ROUNDS: SavingsRound[] = [
  {
    id: 1,
    monthlyIncomeMXN: 8000,
    situation: 'Vives con tus papás, sin gastos fijos',
    targetPct: 30,
    bandTolerance: 5,
    explanation: 'Sin renta ni deudas, puedes ahorrar el 30% fácilmente',
  },
  {
    id: 2,
    monthlyIncomeMXN: 12000,
    situation: 'Rentas solo, sin deudas, zona económica',
    targetPct: 20,
    bandTolerance: 4,
    explanation: 'Con renta ~40% de ingresos, la meta recomendada es 20%',
  },
  {
    id: 3,
    monthlyIncomeMXN: 18000,
    situation: 'Rentas solo, tienes deuda de tarjeta',
    targetPct: 15,
    bandTolerance: 4,
    explanation: 'Con deuda activa, prioriza pagar; ahorra al menos 15%',
  },
  {
    id: 4,
    monthlyIncomeMXN: 25000,
    situation: 'Casado/a, 1 hijo, renta y coche',
    targetPct: 10,
    bandTolerance: 3,
    explanation: 'Con más responsabilidades, mantener 10% es un gran logro',
  },
  {
    id: 5,
    monthlyIncomeMXN: 35000,
    situation: 'Ingresos altos, sin deudas, con inversiones',
    targetPct: 25,
    bandTolerance: 4,
    explanation: 'Con buenos ingresos y sin deudas, apunta al 25% o más',
  },
]
