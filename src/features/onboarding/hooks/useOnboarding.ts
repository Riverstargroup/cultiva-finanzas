import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cf.onboarding.v1'
const TOTAL_STEPS = 4

interface UseOnboardingResult {
  isOpen: boolean
  step: number
  total: number
  next: () => void
  skip: () => void
}

function hasCompleted(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return true
  }
}

function markCompleted(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  } catch {
    // ignore storage errors
  }
}

export function useOnboarding(): UseOnboardingResult {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!hasCompleted()) {
      setIsOpen(true)
      setStep(0)
    }
  }, [])

  const next = useCallback(() => {
    setStep((prev) => {
      const nextStep = prev + 1
      if (nextStep >= TOTAL_STEPS) {
        markCompleted()
        setIsOpen(false)
        return prev
      }
      return nextStep
    })
  }, [])

  const skip = useCallback(() => {
    markCompleted()
    setIsOpen(false)
  }, [])

  return { isOpen, step, total: TOTAL_STEPS, next, skip }
}
