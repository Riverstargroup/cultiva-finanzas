import type { GameId } from './types';

/**
 * Maps a scenario's tags to the most relevant bonus mini-game.
 * Tags are matched in priority order — first match wins.
 */
export function getBonusGameForTags(tags: string[] | undefined): GameId {
  if (!tags || tags.length === 0) return 'presupuesto-rapido';

  const normalized = tags.map((t) => t.toLowerCase());

  if (normalized.some((t) => t.includes('credito') || t.includes('crédito'))) {
    return 'semillas-credito';
  }

  if (normalized.some((t) => t.includes('presupuesto') || t.includes('gastos'))) {
    return 'presupuesto-rapido';
  }

  if (normalized.some((t) => t.includes('inflacion') || t.includes('inflación'))) {
    return 'inflacion-challenge';
  }

  if (normalized.some((t) => t.includes('inversion') || t.includes('inversión') || t.includes('mercado'))) {
    return 'memoria-mercado';
  }

  if (
    normalized.some(
      (t) =>
        t.includes('ahorro') ||
        t.includes('proteccion') ||
        t.includes('protección') ||
        t.includes('emergencia'),
    )
  ) {
    return 'ahorra-cosecha';
  }

  return 'presupuesto-rapido';
}
