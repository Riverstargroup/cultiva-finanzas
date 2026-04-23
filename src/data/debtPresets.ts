/*
 * CONTENT_REVIEW — tasas de interés en presets de deuda
 * Fuente: CNBV comparativo de crédito al consumo / Banxico CAT promedio
 * Los valores representan escenarios realistas del mercado mexicano 2025-2026.
 * valid_until: verificar semestralmente contra el reporte de CAT promedio de Banxico
 *
 * Rangos de referencia (bancos principales, abril 2026):
 *   Tarjeta de crédito clásica:  CAT 50–90 %  (tasa nominal 36–72 % anual)
 *   Préstamo personal:           18–36 % anual
 *   Microcrédito / préstamo rápido: 60–120 % CAT
 */

export interface DebtItem {
  name: string;
  balance: number;
  annual_rate: number;
  min_payment: number;
}

export interface DebtPreset {
  id: string;
  name: string;
  currency: string;
  extra_payment: number;
  debts: DebtItem[];
}

export const DEBT_PRESETS: DebtPreset[] = [
  {
    /* CONTENT_REVIEW — tasas: 48 % y 60 % anual (tasa nominal, CAT real ~60–80 %) — fuente: CNBV — valid_until: verificar semestralmente */
    id: 'preset_card',
    name: 'Tarjeta de crédito (ejemplo)',
    currency: '$',
    extra_payment: 20,
    debts: [
      { name: 'Tarjeta A', balance: 800, annual_rate: 48, min_payment: 35 },
      { name: 'Tarjeta B', balance: 350, annual_rate: 60, min_payment: 20 },
    ],
  },
  {
    /* CONTENT_REVIEW — tasa: 28 % anual para préstamo personal — fuente: CNBV / bancos grandes — valid_until: verificar semestralmente */
    id: 'preset_loan',
    name: 'Préstamo personal (ejemplo)',
    currency: '$',
    extra_payment: 30,
    debts: [
      { name: 'Préstamo personal', balance: 1200, annual_rate: 28, min_payment: 70 },
    ],
  },
  {
    /* CONTENT_REVIEW — tasa: 90 % anual para microcrédito — fuente: CONDUSEF, empresas tipo Kueski/Credijusto — valid_until: verificar semestralmente */
    id: 'preset_micro',
    name: 'Microcrédito (ejemplo)',
    currency: '$',
    extra_payment: 10,
    debts: [
      { name: 'Microcrédito', balance: 250, annual_rate: 90, min_payment: 25 },
    ],
  },
];
