/*
 * CONTENT_REVIEW — tasas de interés en ejercicio "Prioriza tus deudas"
 * Las tasas deben ser ≥40% CAT para tarjetas de crédito (requisito de precisión
 * del contenido). Fuente rangos: CNBV comparativo de CAT — verificar semestralmente.
 *   Tarjeta banco:       ~60 % CAT  (rango real: 50–90 %)
 *   Tarjeta tienda/dept: ~55 % CAT  (rango real: 50–90 %)
 *   Crédito personal:    ~25 % anual (rango real: 18–36 %)
 *   Crédito auto:        ~10 % anual (rango real: 8–14 %)
 *   Hipoteca:            ~10 % anual (rango real: 8–12 % TIIE+spread)
 * valid_until: verificar semestralmente (enero y julio)
 */
import type { DragDropExercise } from '../types'

export const EXERCISES: readonly DragDropExercise[] = [
  {
    id: 'presupuesto-50-30-20',
    domain: 'control',
    prompt: 'Ordena tu presupuesto: clasifica cada gasto en la categoría correcta según la regla 50/30/20.',
    items: [
      { id: 'renta', label: 'Renta / hipoteca', emoji: '🏠' },
      { id: 'comida', label: 'Comida del hogar', emoji: '🛒' },
      { id: 'streaming', label: 'Streaming', emoji: '📺' },
      { id: 'cena-fuera', label: 'Cena en restaurante', emoji: '🍽️' },
      { id: 'ahorro-retiro', label: 'Ahorro para retiro', emoji: '🏦' },
      { id: 'fondo-emergencia', label: 'Fondo de emergencia', emoji: '🛡️' },
    ],
    zones: [
      { id: 'necesidades', label: '🏠 Necesidades (50%)' },
      { id: 'deseos', label: '🎯 Deseos (30%)' },
      { id: 'ahorro', label: '💰 Ahorro (20%)' },
    ],
    correctMapping: {
      renta: 'necesidades',
      comida: 'necesidades',
      streaming: 'deseos',
      'cena-fuera': 'deseos',
      'ahorro-retiro': 'ahorro',
      'fondo-emergencia': 'ahorro',
    },
  },
  {
    id: 'prioriza-deudas',
    domain: 'credito',
    prompt: 'Prioriza tus deudas: arrastra cada deuda a la columna según la urgencia de pagarla.',
    items: [
      /* CONTENT_REVIEW — figura: 60% CAT tarjeta banco — fuente: CNBV CAT promedio — valid_until: verificar semestralmente */
      { id: 'tarjeta-banco-60', label: 'Tarjeta de crédito banco ~60% CAT', emoji: '💳' },
      /* CONTENT_REVIEW — figura: 10% crédito auto — fuente: CNBV / bancos grandes — valid_until: verificar semestralmente */
      { id: 'credito-auto', label: 'Crédito auto ~10% interés anual', emoji: '🚗' },
      { id: 'prestamo-amigo', label: 'Préstamo a un amigo sin interés', emoji: '🤝' },
      /* CONTENT_REVIEW — figura: 10% hipoteca — fuente: Banxico / CNBV TIIE + spread — valid_until: verificar semestralmente */
      { id: 'hipoteca', label: 'Hipoteca ~10% interés anual', emoji: '🏡' },
      /* CONTENT_REVIEW — figura: 25% crédito personal — fuente: CNBV — valid_until: verificar semestralmente */
      { id: 'credito-personal-25', label: 'Crédito personal ~25% interés anual', emoji: '📄' },
      /* CONTENT_REVIEW — figura: 55% CAT tarjeta tienda — fuente: CNBV CAT promedio — valid_until: verificar semestralmente */
      { id: 'tarjeta-tienda-55', label: 'Tarjeta tienda departamental ~55% CAT', emoji: '🏪' },
    ],
    zones: [
      { id: 'alta', label: '🔴 Alta prioridad' },
      { id: 'media', label: '🟡 Media prioridad' },
      { id: 'baja', label: '🟢 Baja prioridad' },
    ],
    correctMapping: {
      'tarjeta-banco-60': 'alta',
      'tarjeta-tienda-55': 'alta',
      'credito-personal-25': 'alta',
      'credito-auto': 'media',
      hipoteca: 'baja',
      'prestamo-amigo': 'baja',
    },
  },
  {
    id: 'fondo-emergencia',
    domain: 'control',
    prompt: '¿Qué cabe en tu fondo de emergencia? Clasifica cada gasto como emergencia real o no.',
    items: [
      { id: 'medico-urgente', label: 'Gasto médico urgente', emoji: '🏥' },
      { id: 'reparacion-carro', label: 'Reparación del carro (sin el que no trabajas)', emoji: '🔧' },
      { id: 'concierto', label: 'Boletos para un concierto', emoji: '🎶' },
      { id: 'desempleo', label: 'Mes sin ingresos por desempleo', emoji: '📉' },
      { id: 'vacaciones', label: 'Vacaciones de verano', emoji: '🌴' },
      { id: 'fuga-agua', label: 'Fuga de agua en el hogar', emoji: '💧' },
    ],
    zones: [
      { id: 'emergencia', label: '🚨 Sí es emergencia' },
      { id: 'no-emergencia', label: '✋ No es emergencia' },
    ],
    correctMapping: {
      'medico-urgente': 'emergencia',
      'reparacion-carro': 'emergencia',
      desempleo: 'emergencia',
      'fuga-agua': 'emergencia',
      concierto: 'no-emergencia',
      vacaciones: 'no-emergencia',
    },
  },
  {
    id: 'tipos-interes',
    domain: 'credito',
    prompt: 'Tipos de interés: conecta cada concepto con su definición correcta.',
    items: [
      { id: 'tasa-anual', label: 'Tasa Anual (CAT)', emoji: '📊' },
      { id: 'interes-compuesto', label: 'Interés compuesto', emoji: '📈' },
      { id: 'tasa-fija', label: 'Tasa fija', emoji: '🔒' },
      { id: 'tasa-variable', label: 'Tasa variable', emoji: '🌊' },
    ],
    zones: [
      { id: 'def-cat', label: 'Costo total anual del crédito incluyendo comisiones' },
      { id: 'def-compuesto', label: 'Interés que se cobra sobre el capital + intereses previos' },
      { id: 'def-fija', label: 'Tasa que no cambia durante la vida del crédito' },
      { id: 'def-variable', label: 'Tasa que fluctúa según el mercado o índice de referencia' },
    ],
    correctMapping: {
      'tasa-anual': 'def-cat',
      'interes-compuesto': 'def-compuesto',
      'tasa-fija': 'def-fija',
      'tasa-variable': 'def-variable',
    },
  },
] as const
