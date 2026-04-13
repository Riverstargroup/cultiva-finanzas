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
    id: 'preset_card',
    name: 'Tarjeta de crédito (ejemplo)',
    currency: '$',
    extra_payment: 20,
    debts: [
      { name: 'Tarjeta A', balance: 800, annual_rate: 48, min_payment: 35 },
      { name: 'Tarjeta B', balance: 350, annual_rate: 60, min_payment: 20 }
    ]
  },
  {
    id: 'preset_loan',
    name: 'Préstamo personal (ejemplo)',
    currency: '$',
    extra_payment: 30,
    debts: [
      { name: 'Préstamo personal', balance: 1200, annual_rate: 28, min_payment: 70 }
    ]
  },
  {
    id: 'preset_micro',
    name: 'Microcrédito (ejemplo)',
    currency: '$',
    extra_payment: 10,
    debts: [
      { name: 'Microcrédito', balance: 250, annual_rate: 90, min_payment: 25 }
    ]
  }
];
