import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { gardenKeys } from '@/features/garden/hooks/useGarden'
import { useAuth } from '@/contexts/AuthContext'

interface Product {
  id: string
  name: string
  emoji: string
  price2020: number
  price2025: number
}

const PRODUCTS: Product[] = [
  { id: 'tortillas', name: 'Tortillas (1 kg)', emoji: '🫓', price2020: 16, price2025: 26 },
  { id: 'gasolina', name: 'Gasolina (litro)', emoji: '⛽', price2020: 18, price2025: 24 },
  { id: 'aguacate', name: 'Aguacate (kg)', emoji: '🥑', price2020: 45, price2025: 80 },
]

const ERROR_THRESHOLD = 0.15

function awardCoins(userId: string) {
  return supabase.rpc('award_coins', {
    p_user_id: userId,
    p_delta: 30,
    p_reason: 'inflation_guess',
  })
}

interface ProductGuessProps {
  product: Product
  onGuess: (guess: number, correct: boolean) => void
}

function ProductGuess({ product, onGuess }: ProductGuessProps) {
  const min = Math.round(product.price2020 * 0.5)
  const max = Math.round(product.price2020 * 3)
  const [value, setValue] = useState(Math.round((min + max) / 2))
  const [revealed, setRevealed] = useState(false)

  const errorPct = Math.abs(value - product.price2025) / product.price2025
  const isClose = errorPct < ERROR_THRESHOLD

  const handleReveal = () => {
    setRevealed(true)
    onGuess(value, isClose)
  }

  return (
    <div className="organic-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-3xl">{product.emoji}</span>
        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            Precio en 2020: <span className="font-bold">${product.price2020}</span>
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">${min}</span>
          <span className="font-bold text-primary text-sm">${value}</span>
          <span className="text-muted-foreground">${max}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          disabled={revealed}
          className="w-full accent-primary disabled:opacity-50"
        />
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              isClose ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}
          >
            <p>Precio real 2025: <span className="font-bold">${product.price2025}</span></p>
            <p className="text-xs mt-0.5">
              {isClose
                ? `¡Muy cerca! Error: ${(errorPct * 100).toFixed(1)}%`
                : `Tu estimado: $${value} — Error: ${(errorPct * 100).toFixed(1)}%`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed && (
        <button
          onClick={handleReveal}
          className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Revelar precio real
        </button>
      )}
    </div>
  )
}

export function InflationGame({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [awardedCoins, setAwardedCoins] = useState(false)

  const handleGuess = async (productId: string, guess: number, correct: boolean) => {
    setResults(prev => {
      const updated = { ...prev, [productId]: correct }
      const allDone = PRODUCTS.every(p => updated[p.id] !== undefined)
      if (allDone && !awardedCoins) {
        const correctCount = Object.values(updated).filter(Boolean).length
        if (correctCount >= 1 && user?.id) {
          awardCoins(user.id).then(() => {
            queryClient.invalidateQueries({ queryKey: gardenKeys.all })
          })
          setAwardedCoins(true)
        }
      }
      return updated
    })
  }

  const answered = Object.keys(results).length
  const allDone = answered === PRODUCTS.length
  const correctCount = Object.values(results).filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground text-center">
        Adivina el precio 2025 con menos del {Math.round(ERROR_THRESHOLD * 100)}% de error
      </div>

      {PRODUCTS.map(product => (
        <ProductGuess
          key={product.id}
          product={product}
          onGuess={(guess, correct) => handleGuess(product.id, guess, correct)}
        />
      ))}

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="organic-card p-5 text-center space-y-2"
          >
            <span className="text-3xl">{awardedCoins ? '🪙' : '📊'}</span>
            <p className="font-bold" style={{ color: 'var(--forest-deep)' }}>
              {correctCount} de {PRODUCTS.length} estimados correctos
            </p>
            {awardedCoins && (
              <p className="text-xs text-yellow-600 font-medium">+30 monedas ganadas</p>
            )}
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted w-full"
            >
              Volver
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
