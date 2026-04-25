import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedCoinCounter } from './AnimatedCoinCounter'

interface RewardToastProps {
  coins: number
  streak?: number
  visible?: boolean
  autoClose?: number
  onDismiss?: () => void
}

export function RewardToast({ coins, streak, visible = true, autoClose = 3000, onDismiss }: RewardToastProps) {
  const [open, setOpen] = useState(visible)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setOpen(visible)
  }, [visible])

  useEffect(() => {
    if (!open || autoClose <= 0) return
    timer.current = setTimeout(() => {
      setOpen(false)
      onDismiss?.()
    }, autoClose)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [open, autoClose, onDismiss])

  const dismiss = () => {
    setOpen(false)
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {open && coins > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={dismiss}
          className="space-y-2 cursor-pointer"
          role="status"
          aria-live="polite"
        >
          <div
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 shadow-lg font-bold text-lg"
            style={{ background: 'var(--leaf-fresh, #d4edda)', color: 'var(--forest-deep, #1a3c00)' }}
          >
            <span>+</span>
            <AnimatedCoinCounter value={coins} />
            <span className="text-sm font-medium opacity-70">monedas ganadas</span>
          </div>

          {streak !== undefined && streak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 shadow font-bold text-sm"
              style={{ background: 'color-mix(in srgb, var(--clay-soft) 60%, transparent)', color: 'var(--forest-deep)' }}
            >
              <span aria-hidden>🔥</span>
              <span>{streak} días de racha</span>
            </motion.div>
          )}
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
