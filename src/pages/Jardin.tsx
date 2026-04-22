import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { GardenGrid } from '@/features/garden/components/GardenGrid'
import { GardenStats } from '@/features/garden/components/GardenStats'
import { useGarden, useInitGarden } from '@/features/garden/hooks/useGarden'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import PageTransition from '@/components/PageTransition'
import { Leaf, Loader2 } from 'lucide-react'

export default function Jardin() {
  const garden = useGarden()
  const initGarden = useInitGarden()
  const reduced = useReducedMotion()

  // Auto-init only after loading confirmed no plots and initGarden hasn't been called
  useEffect(() => {
    if (!garden.isLoading && garden.plots.length === 0 && initGarden.isIdle) {
      // Do NOT auto-init — let user trigger via welcome screen
    }
  }, [garden.isLoading, garden.plots.length, initGarden.isIdle])

  const plantsMastered = garden.plots.filter((p) => p.plant.stage === 'mastered').length
  const isNewUser = !garden.isLoading && garden.plots.length === 0

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  }
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }

  return (
    <PageTransition>
      <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl" style={{ color: 'var(--forest-deep)' }}>
                Mi Jardín 🌱
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--leaf-muted)' }}>
                Tu progreso financiero, hecho visible
              </p>
            </div>
            <Leaf className="h-7 w-7 flex-shrink-0" style={{ color: 'var(--leaf-bright)' }} />
          </div>

          {/* Stats — only when there are plots */}
          {!isNewUser && (
            <GardenStats
              coins={garden.coins}
              totalMastery={garden.totalMastery}
              streakDays={garden.streakDays}
              plantsMastered={plantsMastered}
            />
          )}

          {/* Garden grid / skeleton / welcome */}
          {garden.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="garden-plot-surface min-h-[160px] sm:min-h-[180px] animate-pulse opacity-50"
                />
              ))}
            </div>
          ) : isNewUser ? (
            /* ── Onboarding welcome screen ── */
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="organic-card p-6 md:p-8 space-y-6"
            >
              <motion.div variants={reduced ? undefined : item} className="text-center space-y-2">
                <span className="text-6xl block" role="img" aria-label="Planta">🌱</span>
                <h2 className="font-heading text-xl font-bold md:text-2xl" style={{ color: 'var(--forest-deep)' }}>
                  ¡Bienvenido a tu jardín financiero!
                </h2>
                <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-warm)' }}>
                  Cada hábito financiero que practicas hace crecer una planta. Así funciona:
                </p>
              </motion.div>

              <motion.ul
                variants={reduced ? undefined : item}
                className="space-y-3"
              >
                {[
                  { emoji: '🌿', label: 'Planta = dominio', desc: 'Cada área (ahorro, crédito…) tiene su propia planta' },
                  { emoji: '📈', label: 'Maestría = prácticas', desc: 'Completa escenarios para que tu planta crezca' },
                  { emoji: '🪙', label: 'Monedas = recompensas', desc: 'Gana monedas por cada logro alcanzado' },
                ].map(({ emoji, label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">{emoji}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--forest-deep)' }}>{label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-warm)' }}>{desc}</p>
                    </div>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={reduced ? undefined : item} className="flex justify-center">
                <button
                  onClick={() => initGarden.mutate()}
                  disabled={initGarden.isPending}
                  className="vibrant-btn min-h-[48px] px-8 font-bold text-base disabled:opacity-60"
                >
                  {initGarden.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Plantando semillas...
                    </>
                  ) : (
                    <>🌱 Plantar mis semillas</>
                  )}
                </button>
              </motion.div>

              {initGarden.isError && (
                <motion.p
                  variants={reduced ? undefined : item}
                  className="text-xs text-center"
                  style={{ color: 'var(--terracotta-vivid)' }}
                >
                  🌧️ Algo salió mal. Por favor intenta de nuevo.
                </motion.p>
              )}
            </motion.div>
          ) : (
            <GardenGrid plots={garden.plots} />
          )}

          {/* Coming soon */}
          {!isNewUser && (
            <div className="organic-card p-4 space-y-2 opacity-60">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
                Próximamente
              </p>
              <div className="flex flex-wrap gap-2">
                {['Flashcards', 'Drag & Drop', 'Simuladores', 'Mini-Juegos', 'Cosecha Semanal', 'Pronósticos', 'Polinización'].map((item) => (
                  <span key={item} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
