export type CreditAction = 'builds' | 'hurts' | 'neutral'

export interface CreditCard {
  readonly id: number
  readonly action: string
  readonly context?: string
  readonly impact: CreditAction
  readonly scoreDelta: number
  readonly explanation: string
}

export const CARD_POOL: readonly CreditCard[] = [
  // ── Builds credit (10) ──
  {
    id: 1,
    action: 'Pagar la tarjeta al corriente 6 meses seguidos',
    context: 'Tarjeta con límite de $15,000',
    impact: 'builds',
    scoreDelta: 75,
    explanation:
      'El historial de pagos puntuales es el factor más importante de tu Score de Buró.',
  },
  {
    id: 2,
    action: 'Mantener el uso de tu tarjeta por debajo del 30% del límite',
    context: 'Usaste $3,000 de un límite de $15,000',
    impact: 'builds',
    scoreDelta: 65,
    explanation:
      'La utilización baja (menos del 30%) le indica al buró que no dependes del crédito.',
  },
  {
    id: 3,
    action: 'Conservar tu tarjeta más antigua abierta y activa',
    context: 'La abriste hace 5 años',
    impact: 'builds',
    scoreDelta: 55,
    explanation:
      'La antigüedad crediticia promedio sube tu score; no cierres cuentas viejas sin comisión.',
  },
  {
    id: 4,
    action: 'Pagar más del mínimo cada mes',
    context: 'Mínimo: $450 · pagaste $1,500',
    impact: 'builds',
    scoreDelta: 60,
    explanation:
      'Pagar más del mínimo reduce intereses y demuestra capacidad de pago.',
  },
  {
    id: 5,
    action: 'Revisar tu reporte de Buró de Crédito una vez al año',
    context: 'Gratis en buro.com.mx',
    impact: 'builds',
    scoreDelta: 40,
    explanation:
      'Revisar tu propio reporte NO baja tu score y te ayuda a detectar errores o fraude.',
  },
  {
    id: 6,
    action: 'Diversificar con un crédito automotriz pagado puntualmente',
    context: 'Ya tenías tarjeta de crédito',
    impact: 'builds',
    scoreDelta: 50,
    explanation:
      'Mezclar tipos de crédito (revolvente + a plazos) fortalece tu perfil si pagas a tiempo.',
  },
  {
    id: 7,
    action: 'Domiciliar el pago mínimo para nunca olvidarlo',
    context: 'Débito automático desde tu cuenta',
    impact: 'builds',
    scoreDelta: 45,
    explanation:
      'Automatizar el pago evita retrasos, que son lo que más daña tu score.',
  },
  {
    id: 8,
    action: 'Liquidar completamente la tarjeta antes de la fecha de corte',
    context: 'Saldo a $0 antes del corte',
    impact: 'builds',
    scoreDelta: 70,
    explanation:
      'Reporta 0% de utilización al buró y evita intereses moratorios.',
  },
  {
    id: 9,
    action: 'Aumentar tu límite sin gastar más',
    context: 'Banco te ofreció subir de $15k a $25k',
    impact: 'builds',
    scoreDelta: 40,
    explanation:
      'Si no aumentas tu gasto, tu utilización porcentual baja automáticamente.',
  },
  {
    id: 10,
    action: 'Pagar un crédito Infonavit puntualmente por 2 años',
    context: 'Descuento directo de nómina',
    impact: 'builds',
    scoreDelta: 80,
    explanation:
      'Los créditos hipotecarios bien pagados son una señal muy fuerte de solvencia.',
  },

  // ── Hurts credit (8) ──
  {
    id: 11,
    action: 'Pagar la tarjeta con 15 días de retraso',
    context: 'Olvidaste la fecha límite',
    impact: 'hurts',
    scoreDelta: 55,
    explanation:
      'Un atraso de 30+ días queda registrado en Buró hasta por 6 años.',
  },
  {
    id: 12,
    action: 'Usar el 90% del límite de tu tarjeta cada mes',
    context: 'Saldo de $13,500 con límite de $15,000',
    impact: 'hurts',
    scoreDelta: 50,
    explanation:
      'Utilización alta indica dependencia del crédito y reduce tu score.',
  },
  {
    id: 13,
    action: 'Solicitar 3 tarjetas nuevas en la misma semana',
    context: 'Tres consultas duras seguidas',
    impact: 'hurts',
    scoreDelta: 40,
    explanation:
      'Cada solicitud genera una consulta dura; muchas juntas dan señal de urgencia financiera.',
  },
  {
    id: 14,
    action: 'Dejar de pagar la tarjeta por 3 meses',
    context: 'Sin comunicarte con el banco',
    impact: 'hurts',
    scoreDelta: 60,
    explanation:
      'Un saldo con 90+ días de mora baja tu score drásticamente y puede llegar a cobranza.',
  },
  {
    id: 15,
    action: 'Ignorar avisos del Buró de Crédito',
    context: 'Llegó una aclaración pendiente',
    impact: 'hurts',
    scoreDelta: 35,
    explanation:
      'No aclarar errores deja cuentas negativas en tu reporte que podrías haber corregido.',
  },
  {
    id: 16,
    action: 'Sacar dinero en efectivo con tu tarjeta de crédito',
    context: 'Comisión del 10% + interés desde día 1',
    impact: 'hurts',
    scoreDelta: 30,
    explanation:
      'Los retiros en efectivo acumulan intereses al instante y elevan tu utilización rápido.',
  },
  {
    id: 17,
    action: 'Cerrar tu tarjeta más antigua porque "ya no la usas"',
    context: 'Era la única sin anualidad',
    impact: 'hurts',
    scoreDelta: 45,
    explanation:
      'Cerrarla baja tu antigüedad promedio y tu límite disponible total.',
  },
  {
    id: 18,
    action: 'Ser aval de un amigo que deja de pagar',
    context: 'Firmaste sin leer',
    impact: 'hurts',
    scoreDelta: 55,
    explanation:
      'Como aval, la deuda impaga aparece en TU reporte del buró como si fuera tuya.',
  },

  // ── Neutral (2) ──
  {
    id: 19,
    action: 'Cancelar una tarjeta recién aprobada que no activaste',
    context: 'Nunca la usaste',
    impact: 'neutral',
    scoreDelta: 0,
    explanation:
      'Si nunca la activaste, el impacto en tu score es mínimo; lo importante es no acumular consultas duras.',
  },
  {
    id: 20,
    action: 'Comparar tasas de interés entre bancos sin solicitar crédito',
    context: 'Usando simuladores de Condusef',
    impact: 'neutral',
    scoreDelta: 0,
    explanation:
      'Comparar no genera consulta al buró; solo solicitar formalmente lo hace.',
  },
]
