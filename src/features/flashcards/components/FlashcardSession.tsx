import { AnimatePresence, motion } from 'framer-motion'
import { FlipCard } from './FlipCard'
import { RatingButtons } from './RatingButtons'
import { useFlashcardSession } from '../hooks/useFlashcardSession'
import { RATING_LABELS } from '../types'
import type { Flashcard, FlashcardRating } from '../types'

function CardFace({ text, label }: { text: string; label?: string }) {
  return (
    <div className="organic-card min-h-[220px] flex flex-col items-center justify-center gap-3 p-6 text-center select-none">
      {label && (
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
      <p className="text-lg font-semibold leading-snug" style={{ color: 'var(--forest-deep)' }}>
        {text}
      </p>
    </div>
  )
}

function SessionSummary({ results, total }: { results: { cardId: string; rating: FlashcardRating }[]; total: number }) {
  const again = results.filter(r => r.rating === 0).length
  const good = results.filter(r => r.rating >= 2).length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="organic-card p-8 text-center space-y-4"
    >
      <span className="text-5xl">🎉</span>
      <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
        ¡Sesión completada!
      </h2>
      <p className="text-muted-foreground text-sm">
        Revisaste {total} tarjeta{total !== 1 ? 's' : ''}
      </p>
      <div className="flex justify-center gap-6 pt-2">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{good}</p>
          <p className="text-xs text-muted-foreground">Bien o mejor</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{again}</p>
          <p className="text-xs text-muted-foreground">Otra vez</p>
        </div>
      </div>
    </motion.div>
  )
}

export function FlashcardSession({ cards }: { cards: Flashcard[] }) {
  const session = useFlashcardSession(cards)

  if (session.isDone) {
    return <SessionSummary results={session.results} total={session.totalCards} />
  }

  const card = session.currentCard
  if (!card) return null

  const progress = session.totalCards > 0 ? (session.currentIndex / session.totalCards) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {session.currentIndex + 1} / {session.totalCards}
        </span>
      </div>

      {/* Flip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <FlipCard
            front={<CardFace text={card.front_text} label="Pregunta" />}
            back={<CardFace text={card.back_text} label="Respuesta" />}
            isFlipped={session.isFlipped}
            onClick={!session.isFlipped ? session.flip : undefined}
          />
        </motion.div>
      </AnimatePresence>

      {/* Tap hint */}
      {!session.isFlipped && (
        <p className="text-center text-xs text-muted-foreground animate-pulse">
          Toca la tarjeta para revelar la respuesta
        </p>
      )}

      {/* Rating buttons */}
      <RatingButtons
        visible={session.isFlipped}
        onRate={session.onRate}
        disabled={session.isPending}
      />
    </div>
  )
}
