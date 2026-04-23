interface DifficultyDotsProps {
  level: string;
}

function dotsForLevel(level: string): number {
  const normalized = level.toLowerCase();
  if (normalized === 'basico' || normalized === 'básico' || normalized === 'facil' || normalized === 'fácil') return 1;
  if (normalized === 'intermedio' || normalized === 'medio') return 2;
  if (normalized === 'avanzado' || normalized === 'dificil' || normalized === 'difícil') return 3;
  return 1;
}

export default function DifficultyDots({ level }: DifficultyDotsProps) {
  const filled = dotsForLevel(level);
  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`Dificultad: ${level}`}
      role="img"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            display: 'inline-block',
            background: i < filled ? 'var(--leaf-bright)' : 'var(--clay-soft)',
          }}
        />
      ))}
    </span>
  );
}
