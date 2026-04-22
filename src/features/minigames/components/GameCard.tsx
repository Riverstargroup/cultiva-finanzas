interface GameCardProps {
  title: string
  description: string
  emoji: string
  difficulty: 1 | 2 | 3
  highScore?: number
  onPlay: () => void
}

const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: 'Fácil',
  2: 'Medio',
  3: 'Difícil',
}

const DIFFICULTY_COLOR: Record<1 | 2 | 3, string> = {
  1: 'text-green-600 bg-green-100',
  2: 'text-yellow-600 bg-yellow-100',
  3: 'text-red-600 bg-red-100',
}

export function GameCard({ title, description, emoji, difficulty, highScore, onPlay }: GameCardProps) {
  return (
    <div className="organic-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-4xl">{emoji}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[difficulty]}`}>
          {DIFFICULTY_LABEL[difficulty]}
        </span>
      </div>
      <div>
        <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      {highScore !== undefined && (
        <p className="text-xs text-muted-foreground">
          Mejor puntaje: <span className="font-bold text-primary">{highScore} pts</span>
        </p>
      )}
      <button
        onClick={onPlay}
        className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95"
      >
        Jugar
      </button>
    </div>
  )
}
