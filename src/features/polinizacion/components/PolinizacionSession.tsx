import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer } from 'lucide-react'
import { usePolinizacion } from '../hooks/usePolinizacion'
import { SimpleFlipCard } from './SimpleFlipCard'
import { RatingButtons } from './RatingButtons'
import { BeeProgress } from './BeeProgress'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SESSION_SECONDS = 180

export default function PolinizacionSession() {
  const reduced = useReducedMotion()
  const { cards, currentIndex, cardsLoading, sessionComplete, sessionCoins, rateCard, completeSession } =
    usePolinizacion()

  const [isFlipped, setIsFlipped] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS)
  const [timerStarted, setTimerStarted] = useState(false)

  const currentCard = cards[currentIndex] ?? null
  const isTimerRed = secondsLeft <= 30

  // Start timer when cards load
  useEffect(() => {
    if (!cardsLoading && cards.length > 0 && !timerStarted) {
      setTimerStarted(true)
    }
  }, [cardsLoading, cards.length, timerStarted])

  // Countdown
  useEffect(() => {
    if (!timerStarted || sessionComplete) return
    if (secondsLeft <= 0) {
      handleComplete()
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  })

  const handleComplete = useCallback(() => {
    if (!completeSession.isPending && !sessionComplete) {
      completeSession.mutate()
    }
  }, [completeSession, sessionComplete])

  // Auto-complete when all cards rated
  useEffect(() => {
    if (timerStarted && cards.length > 0 && currentIndex >= cards.length && !sessionComplete) {
      handleComplete()
    }
  }, [currentIndex, cards.length, timerStarted, sessionComplete, handleComplete])

  const handleFlip = () => setIsFlipped(true)

  const handleRate = (quality: number) => {
    if (!currentCard || rateCard.isPending) return
    setIsFlipped(false)
    rateCard.mutate({ cardId: currentCard.id, quality })
  }

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timerLabel = `${mins}:${secs.toString().padStart(2, '0')}`

  if (cardsLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 rounded-xl bg-muted opacity-50" />
        <div className="h-40 rounded-xl bg-muted opacity-50" />
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="organic-card p-8 text-center">
        <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
          No hay tarjetas disponibles aún. Completa algunos cursos primero.
        </p>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <span className="text-5xl block">🌸</span>
        <h3 className="font-heading font-bold text-xl" style={{ color: 'var(--forest-deep)' }}>
          ¡Polinización completa!
        </h3>
        {sessionCoins > 0 && (
          <p className="font-bold text-2xl" style={{ color: 'var(--leaf-bright)' }}>
            +{sessionCoins} 🪙
          </p>
        )}
        <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
          Tus plantas han crecido 🌱
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Timer + progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Timer
            className="h-4 w-4"
            style={{ color: isTimerRed ? '#dc2626' : 'var(--leaf-muted)' }}
          />
          <span
            className="font-mono font-bold text-sm tabular-nums"
            style={{ color: isTimerRed ? '#dc2626' : 'var(--forest-deep)' }}
          >
            {timerLabel}
          </span>
        </div>
        <span className="text-xs font-semibold" style={{ color: 'var(--leaf-muted)' }}>
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Bee progress */}
      <BeeProgress currentDomain={currentCard?.domain ?? null} />

      {/* Card */}
      <AnimatePresence mode="wait">
        {currentCard && (
          <motion.div
            key={currentCard.id}
            initial={reduced ? undefined : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SimpleFlipCard
              front={currentCard.front}
              back={currentCard.back}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isFlipped ? (
        <button
          onClick={handleFlip}
          className="vibrant-btn w-full justify-center text-sm"
        >
          Ver respuesta
        </button>
      ) : (
        <RatingButtons onRate={handleRate} disabled={rateCard.isPending} />
      )}

      <button
        onClick={handleComplete}
        disabled={completeSession.isPending}
        className="w-full text-xs py-2 rounded-xl font-semibold transition-opacity hover:opacity-70 disabled:opacity-40"
        style={{ color: 'var(--leaf-muted)', background: 'transparent' }}
      >
        Terminar sesión
      </button>
    </div>
  )
}
