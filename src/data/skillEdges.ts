export const SKILL_EDGES: [string, string][] = [
  // Control path
  ['control_basics', 'spending_leaks'],
  ['spending_leaks', 'budget_3_buckets'],
  ['budget_3_buckets', 'emergency_fund'],
  ['emergency_fund', 'auto_saving'],
  // Crédito path
  ['credit_basics', 'credit_score'],
  ['credit_score', 'min_payment_trap'],
  ['min_payment_trap', 'rate_compare'],
  ['rate_compare', 'snowball_avalanche'],
  ['snowball_avalanche', 'debt_plan_30d'],
  // Protección path
  ['fraud_basics', 'identity_protection'],
  // Crecimiento path
  ['inflation_basics', 'investing_basics'],
];
