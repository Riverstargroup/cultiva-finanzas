import { Clock, Gamepad2, Trophy, Sparkles } from 'lucide-react';
import type { GameStat } from '../hooks/useGameStats';

interface GameStatRowProps {
  stat?: GameStat;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function formatRelativeDate(iso: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;

  const now = Date.now();
  const diffMs = now - then;
  if (diffMs < 0) return 'hoy';

  const days = Math.floor(diffMs / MS_PER_DAY);
  if (days <= 0) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
}

export function GameStatRow({ stat }: GameStatRowProps) {
  const highScore = stat?.highScore ?? 0;
  const timesPlayed = stat?.timesPlayed ?? 0;
  const lastPlayedLabel = formatRelativeDate(stat?.lastPlayedAt ?? null);

  const pillStyle: React.CSSProperties = {
    color: 'var(--leaf-muted)',
    background: 'color-mix(in srgb, var(--clay-soft) 18%, transparent)',
  };

  if (timesPlayed === 0) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium"
          style={{ ...pillStyle, opacity: 0.6 }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Juega primero
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium"
        style={pillStyle}
      >
        <Trophy className="h-3.5 w-3.5" aria-hidden="true" style={{ color: 'var(--leaf-muted)' }} />
        <span style={{ color: highScore > 0 ? 'var(--leaf-bright)' : 'var(--leaf-muted)' }}>
          {highScore > 0 ? `${highScore} pts` : '— pts'}
        </span>
      </span>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium"
        style={pillStyle}
      >
        <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
        {`${timesPlayed}x`}
      </span>
      {lastPlayedLabel && (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium"
          style={pillStyle}
        >
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {lastPlayedLabel}
        </span>
      )}
    </div>
  );
}
