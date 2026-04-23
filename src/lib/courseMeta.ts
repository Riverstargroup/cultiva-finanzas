export const DOMAIN_COLOR: Record<string, string> = {
  control: 'var(--leaf-bright)',
  credito: '#e07b5e',
  proteccion: 'var(--forest-deep)',
  crecimiento: '#8bc4a0',
};

// Points earned per scenario
export function estimatedXp(
  scenarioIndex: number,
  level: 'basico' | 'intermedio' | 'avanzado'
): number {
  const levelBonus = level === 'basico' ? 0 : level === 'intermedio' ? 5 : 10;
  return 10 + scenarioIndex * 2 + levelBonus;
}
