import { motion, AnimatePresence } from 'framer-motion'
import { RATING_LABELS, RATING_COLORS } from '../types'
import type { FlashcardRating } from '../types'

interface RatingButtonsProps {
  visible: boolean
  disabled: boolean
  onRate: (rating: FlashcardRating) => void
}

const RATINGS: FlashcardRating[] = [0, 1, 2, 3, 4]

export function RatingButtons({ visible, disabled, onRate }: RatingButtonsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex gap-2 flex-wrap justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          {RATINGS.map((rating) => (
            <button
              key={rating}
              disabled={disabled}
              onClick={() => onRate(rating)}
              className={`
                ${RATING_COLORS[rating]}
                text-white text-sm font-semibold
                px-4 py-2 rounded-xl
                transition-transform active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none
              `}
              aria-label={`Calificación: ${RATING_LABELS[rating]}`}
            >
              {RATING_LABELS[rating]}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
