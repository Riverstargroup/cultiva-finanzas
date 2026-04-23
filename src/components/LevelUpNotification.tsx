import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LevelBadge } from './LevelBadge'
import type { UserLevel } from '@/hooks/useUserLevel'

const STORAGE_KEY = 'cultiva_last_level'

interface LevelUpNotificationProps {
  level: UserLevel
  isLoading: boolean
}

export function LevelUpNotification({ level, isLoading }: LevelUpNotificationProps) {
  const [visible, setVisible] = useState(false)
  const initialised = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isLoading) return
    if (initialised.current) return
    initialised.current = true

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null && stored !== level) {
      setVisible(true)
      timer.current = setTimeout(() => setVisible(false), 4000)
    }
    localStorage.setItem(STORAGE_KEY, level)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [level, isLoading])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
          onClick={() => setVisible(false)}
        >
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-6 py-4 shadow-xl ring-1 ring-black/5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              ¡Subiste de nivel!
            </p>
            <LevelBadge level={level} size="lg" animated />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
