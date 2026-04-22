import { motion, AnimatePresence } from 'framer-motion'
import { RATING_LABELS, RATING_COLORS } from '../types'
import type { FlashcardRating } from '../types'

interface RatingButtonsProps {
  visible: boolean
  onRate: (rating: FlashcardRating) => void
  disabled?: boolean
}

const RATINGS: FlashcardRating[] = [0, 1, 2, 3, 4]

export function RatingButtons({ visible, onRate, disabled }: RatingButtonsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="flex gap-2 flex-wrap justify-center mt-4"
        >
          {RATINGS.map((rating) => (
            <button
              key={rating}
              onClick={() => onRate(rating)}
              disabled={disabled}
              className={`px-3 py-2 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${RATING_COLORS[rating]}`}
            >
              {RATING_LABELS[rating]}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
