import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedCoinCounter } from './AnimatedCoinCounter'

interface RewardToastProps {
  coins: number
  visible?: boolean
  onDismiss?: () => void
}

export function RewardToast({ coins, visible = true, onDismiss }: RewardToastProps) {
  return (
    <AnimatePresence>
      {visible && coins > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={onDismiss}
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 shadow-lg font-bold text-lg cursor-pointer"
          style={{ background: 'var(--leaf-fresh, #d4edda)', color: 'var(--forest-deep, #1a3c00)' }}
        >
          <span>+</span>
          <AnimatedCoinCounter value={coins} />
          <span className="text-sm font-medium opacity-70">monedas ganadas</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function RewardToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <div className="pointer-events-auto">{children}</div>
    </div>
  )
}
