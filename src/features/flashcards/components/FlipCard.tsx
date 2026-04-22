import { motion, useReducedMotion } from 'framer-motion'
import { DOMAIN_LABELS } from '@/features/garden/types'
import type { Flashcard } from '../types'

interface FlipCardProps {
  card: Flashcard
  flipped: boolean
  onFlip: () => void
  disabled?: boolean
}

export function FlipCard({ card, flipped, onFlip, disabled = false }: FlipCardProps) {
  const prefersReduced = useReducedMotion()

  const handleClick = () => {
    if (!disabled && !flipped) {
      onFlip()
    }
  }

  if (prefersReduced) {
    return (
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ minHeight: 240 }}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
        aria-label={flipped ? 'Tarjeta volteada — respuesta visible' : 'Toca para voltear'}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl shadow-md"
          style={{ backgroundColor: 'var(--garden-plot-surface)', border: '1.5px solid var(--garden-plot-border)' }}
          animate={{ opacity: flipped ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        >
          <CardFront card={card} />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-2xl shadow-md"
          style={{ backgroundColor: '#d1fae5' }}
          animate={{ opacity: flipped ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <CardBack card={card} />
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full select-none"
      style={{ minHeight: 240, perspective: '1000px' }}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
      aria-label={flipped ? 'Tarjeta volteada — respuesta visible' : 'Toca para voltear'}
    >
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 240,
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl shadow-md flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: 'var(--garden-plot-surface)',
            border: '1.5px solid var(--garden-plot-border)',
          }}
        >
          <CardFront card={card} />
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl shadow-md flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#d1fae5',
          }}
        >
          <CardBack card={card} />
        </div>
      </motion.div>
    </div>
  )
}

function DomainBadge({ domain }: { domain: Flashcard['domain'] }) {
  const domainColors: Record<Flashcard['domain'], string> = {
    control: 'bg-yellow-100 text-yellow-800',
    credito: 'bg-pink-100 text-pink-800',
    proteccion: 'bg-green-100 text-green-800',
    crecimiento: 'bg-amber-100 text-amber-800',
  }

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${domainColors[domain]}`}>
      {DOMAIN_LABELS[domain]}
    </span>
  )
}

function CardFront({ card }: { card: Flashcard }) {
  return (
    <div className="flex flex-col justify-between h-full p-6 min-h-[240px]">
      <div className="flex justify-between items-start">
        <DomainBadge domain={card.domain} />
        <span className="text-xs text-muted-foreground font-medium">Frente</span>
      </div>
      <div className="flex-1 flex items-center justify-center py-4">
        <p
          className="text-center font-semibold leading-relaxed"
          style={{ color: 'var(--forest-deep)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
        >
          {card.frontText}
        </p>
      </div>
      <p className="text-center text-xs text-muted-foreground">Toca para revelar la respuesta</p>
    </div>
  )
}

function CardBack({ card }: { card: Flashcard }) {
  return (
    <div className="flex flex-col justify-between h-full p-6 min-h-[240px]">
      <div className="flex justify-between items-start">
        <DomainBadge domain={card.domain} />
        <span className="text-xs font-medium" style={{ color: 'var(--leaf-bright)' }}>Respuesta</span>
      </div>
      <div className="flex-1 flex items-center justify-center py-4">
        <p
          className="text-center font-medium leading-relaxed"
          style={{ color: 'var(--forest-deep)', fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)' }}
        >
          {card.backText}
        </p>
      </div>
      <div className="h-5" />
    </div>
  )
}
