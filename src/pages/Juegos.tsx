import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameCard } from '@/features/minigames/components/GameCard'
import { PresupuestoRapido } from '@/features/minigames/games/PresupuestoRapido'
import { InflacionChallenge } from '@/features/minigames/games/InflacionChallenge'

type ActiveGame = 'presupuesto' | 'inflacion' | null

export default function Juegos() {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null)

  return (
    <div className="dashboard-skin botanical-bg min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveGame(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  ← Volver
                </button>
                <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
                  {activeGame === 'presupuesto' ? 'Presupuesto Rápido 💸' : 'Inflación Challenge 📈'}
                </h2>
              </div>

              {activeGame === 'presupuesto' && (
                <PresupuestoRapido onBack={() => setActiveGame(null)} />
              )}
              {activeGame === 'inflacion' && (
                <InflacionChallenge onBack={() => setActiveGame(null)} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--forest-deep)' }}>
                    Mini-Juegos 🎮
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Aprende finanzas jugando
                  </p>
                </div>
                <Gamepad2 className="text-leaf-bright" size={28} />
              </div>

              {/* Game cards */}
              <div className="space-y-4">
                <GameCard
                  title="Presupuesto Rápido"
                  description="Clasifica 6 gastos en Necesidades, Deseos y Ahorro antes de que el tiempo se acabe."
                  emoji="💸"
                  difficulty={1}
                  onPlay={() => setActiveGame('presupuesto')}
                />
                <GameCard
                  title="Inflación Challenge"
                  description="Adivina el precio actual de 5 productos usando un slider. ¡Gana monedas si aciertas!"
                  emoji="📈"
                  difficulty={2}
                  onPlay={() => setActiveGame('inflacion')}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
