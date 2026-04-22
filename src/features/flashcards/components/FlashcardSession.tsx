import { FlipCard } from './FlipCard'
import { RatingButtons } from './RatingButtons'
import { SessionSummary } from './SessionSummary'
import { useFlashcardSession } from '../hooks/useFlashcardSession'
import type { Flashcard } from '../types'

interface FlashcardSessionProps {
  cards: Flashcard[]
  onClose: () => void
}

export function FlashcardSession({ cards, onClose }: FlashcardSessionProps) {
  const session = useFlashcardSession(cards)

  if (session.completed) {
    return <SessionSummary stats={session.stats} onBack={onClose} />
  }

  const currentCard = session.cards[session.currentIndex]
  const total = session.cards.length
  const progress = total > 0 ? (session.currentIndex / total) * 100 : 0

  if (!currentCard) return null

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
          <span>{session.currentIndex + 1} de {total} tarjetas</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--garden-plot-border)' }}
          role="progressbar"
          aria-valuenow={session.currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((session.currentIndex + 1) / total) * 100}%`,
              backgroundColor: 'var(--leaf-bright)',
            }}
          />
        </div>
      </div>

      {/* Card */}
      <FlipCard
        card={currentCard}
        flipped={session.flipped}
        onFlip={session.onFlip}
        disabled={session.isRating}
      />

      {/* Rating buttons — shown only when card is flipped */}
      <RatingButtons
        visible={session.flipped}
        disabled={session.isRating}
        onRate={session.onRate}
      />
    </div>
  )
}
