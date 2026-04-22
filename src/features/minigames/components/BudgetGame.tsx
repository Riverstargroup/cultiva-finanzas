import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import { useAuth } from '@/contexts/AuthContext'

interface Expense {
  id: string
  label: string
  emoji: string
  amount: number
  correctCategory: 'necesidades' | 'deseos' | 'ahorro'
}

const EXPENSES: Expense[] = [
  { id: 'renta', label: 'Renta', emoji: '🏠', amount: 8000, correctCategory: 'necesidades' },
  { id: 'netflix', label: 'Netflix', emoji: '📺', amount: 250, correctCategory: 'deseos' },
  { id: 'fondo', label: 'Fondo de emergencia', emoji: '💰', amount: 1500, correctCategory: 'ahorro' },
  { id: 'comida', label: 'Despensa', emoji: '🛒', amount: 3000, correctCategory: 'necesidades' },
  { id: 'restaurante', label: 'Restaurante', emoji: '🍽️', amount: 600, correctCategory: 'deseos' },
  { id: 'seguro', label: 'Seguro médico', emoji: '🏥', amount: 900, correctCategory: 'necesidades' },
]

type Category = 'necesidades' | 'deseos' | 'ahorro'

const CATEGORY_LABEL: Record<Category, string> = {
  necesidades: 'Necesidades',
  deseos: 'Deseos',
  ahorro: 'Ahorro',
}

const CATEGORY_COLOR: Record<Category, string> = {
  necesidades: 'bg-blue-100 border-blue-300 text-blue-800',
  deseos: 'bg-purple-100 border-purple-300 text-purple-800',
  ahorro: 'bg-green-100 border-green-300 text-green-800',
}

const TOTAL_SECONDS = 60
const PASS_THRESHOLD = 40

interface GameResult {
  score: number
  correct: number
  total: number
}

function saveAttempt(userId: string, score: number) {
  return supabase.from('user_activity_attempts').insert({
    user_id: userId,
    activity_type: 'presupuesto_rapido',
    score,
    completed_at: new Date().toISOString(),
  })
}

export function BudgetGame({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const growPlant = useGrowPlant()

  const [placements, setPlacements] = useState<Record<string, Category>>({})
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const [phase, setPhase] = useState<'playing' | 'done'>('playing')
  const [result, setResult] = useState<GameResult | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!)
          finishGame()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [])

  const finishGame = () => {
    setPhase('done')
  }

  useEffect(() => {
    if (phase !== 'done') return
    const correct = EXPENSES.filter(e => placements[e.id] === e.correctCategory).length
    const score = correct * 10
    setResult({ score, correct, total: EXPENSES.length })

    if (user?.id) {
      saveAttempt(user.id, score)
    }

    if (score >= PASS_THRESHOLD) {
      growPlant.mutate({ domain: 'control', masteryDelta: 0.04 })
    }
  }, [phase])

  const classify = (expenseId: string, category: Category) => {
    if (phase !== 'playing') return
    setPlacements(prev => ({ ...prev, [expenseId]: category }))

    const allDone = EXPENSES.every(e => e.id === expenseId || prev[e.id] !== undefined)
    if (allDone) {
      clearInterval(intervalRef.current!)
      finishGame()
    }
  }

  const timerPct = (timeLeft / TOTAL_SECONDS) * 100
  const timerColor = timeLeft > 20 ? 'bg-green-500' : timeLeft > 10 ? 'bg-yellow-400' : 'bg-red-500'

  if (phase === 'done' && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <span className="text-5xl">{result.score >= PASS_THRESHOLD ? '🎉' : '😅'}</span>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          {result.score >= PASS_THRESHOLD ? '¡Bien hecho!' : '¡Casi!'}
        </h3>
        <p className="text-3xl font-bold text-primary">{result.score} pts</p>
        <p className="text-muted-foreground text-sm">
          {result.correct} de {result.total} gastos clasificados correctamente
        </p>
        {result.score >= PASS_THRESHOLD && (
          <p className="text-xs text-green-600 font-medium">🌱 Tu planta de control ha crecido</p>
        )}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
          >
            Volver
          </button>
        </div>
      </motion.div>
    )
  }

  const unclassified = EXPENSES.filter(e => placements[e.id] === undefined)
  const classified = EXPENSES.filter(e => placements[e.id] !== undefined)

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tiempo restante</span>
          <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${timerColor} transition-colors`}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Pending expenses */}
      {unclassified.length > 0 && (
        <div className="space-y-2">
          {unclassified.map(expense => (
            <div key={expense.id} className="organic-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{expense.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{expense.label}</p>
                  <p className="text-xs text-muted-foreground">
                    ${expense.amount.toLocaleString('es-MX')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {(['necesidades', 'deseos', 'ahorro'] as Category[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => classify(expense.id, cat)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors hover:opacity-80 ${CATEGORY_COLOR[cat]}`}
                  >
                    {CATEGORY_LABEL[cat]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classified count */}
      {classified.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {classified.length} / {EXPENSES.length} clasificados
        </p>
      )}
    </div>
  )
}
