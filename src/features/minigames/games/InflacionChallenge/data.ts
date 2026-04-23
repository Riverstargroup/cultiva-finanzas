/*
 * CONTENT_REVIEW — datos de precios 2020 → 2025
 * Fuentes:
 *   Tortillas:       INEGI / SNIIM (Sistema Nacional de Información e Integración de Mercados)
 *   Gasolina:        CRE (Comisión Reguladora de Energía) / PROFECO precios
 *   Salario mínimo:  CONASAMI decreto enero 2020 ($123.22) y enero 2025 ($278.80)
 *   Aguacate:        SNIIM / ASERCA (precio al consumidor promedio)
 *   Metro CDMX:      STC Metro — ALERTA: tarifa $5 vigente desde 2012;
 *                    verificar si hubo aumento antes de publicar el dato de 2025
 * valid_until: verificar anualmente (enero, con los nuevos decretos)
 */

export const PRODUCTOS = [
  /* CONTENT_REVIEW — figura: $19→$28 (47%) — fuente: INEGI INPC / SNIIM — valid_until: verificar anualmente */
  { id: '1', product: 'Tortillas 1kg', emoji: '🫓', price2020: 19, price2025: 28 },
  /* CONTENT_REVIEW — figura: $18.50→$24 (30%) — fuente: CRE / PROFECO precios gasolina Magna — valid_until: verificar trimestralmente */
  { id: '2', product: 'Gasolina 1L', emoji: '⛽', price2020: 18.5, price2025: 24 },
  /* CONTENT_REVIEW — figura: $123→$278 (126%) — fuente: CONASAMI decretos 2020 y 2025 ✓ verificado — valid_until: enero 2026 */
  { id: '3', product: 'Salario mínimo/día', emoji: '💵', price2020: 123, price2025: 278 },
  /* CONTENT_REVIEW — figura: $35→$58 (66%) — fuente: SNIIM precio promedio consumidor — valid_until: verificar trimestralmente (precio estacional) */
  { id: '4', product: 'Aguacate 1kg', emoji: '🥑', price2020: 35, price2025: 58 },
  /* CONTENT_REVIEW — figura: $5→$7 (40%) — ⚠️ VERIFICAR: tarifa STC Metro CDMX ha sido $5 desde 2012;
     confirmar si hubo aumento antes de publicar. Si sigue en $5, corregir price2025 a 5 — valid_until: inmediato */
  { id: '5', product: 'Metro CDMX boleto', emoji: '🚇', price2020: 5, price2025: 7 },
] as const
