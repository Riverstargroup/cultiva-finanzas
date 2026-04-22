import { BookOpen } from 'lucide-react'
import { useDueCards } from '@/features/flashcards/hooks/useDueCards'
import { FlashcardSession } from '@/features/flashcards/components/FlashcardSession'

function EmptyState() {
  return (
    <div className="organic-card flex flex-col items-center gap-4 py-12 text-center">
      <span className="text-5xl">✅</span>
      <p className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
        ¡Al día con tus tarjetas!
      </p>
      <p className="text-sm text-muted-foreground max-w-xs">
        No tienes tarjetas pendientes por ahora. Vuelve más tarde.
      </p>
    </div>
  )
}

export default function Flashcards() {
  const { data: cards = [], isLoading } = useDueCards()

  return (
    <div className="dashboard-skin botanical-bg min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--forest-deep)' }}>
              Flashcards 🃏
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Repaso espaciado para retener más
            </p>
          </div>
          <BookOpen className="text-leaf-bright" size={28} />
        </div>

        {isLoading ? (
          <div className="organic-card h-[220px] animate-pulse opacity-50" />
        ) : cards.length === 0 ? (
          <EmptyState />
        ) : (
          <FlashcardSession cards={cards} />
        )}
      </div>
    </div>
  )
}
