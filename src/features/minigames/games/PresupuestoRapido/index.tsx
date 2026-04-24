import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PresupuestoRapidoIllustration } from '@/features/minigames/assets'
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useGrowPlant } from '@/features/garden/hooks/useGarden'
import { useMinigameSession } from '../../hooks/useMinigameSession'
import { DraggableItem } from '@/features/dragdrop/components/DraggableItem'
import { ZONES, type Gasto, type Zone } from './data'
import { PASS_THRESHOLD, usePresupuestoGame } from './usePresupuestoGame'
import { Jar } from './Jar'
import { ResultsView } from './ResultsView'

const INITIAL_TIMER = 90

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString('es-MX')}`
}

export function PresupuestoRapido({ onBack }: { onBack: () => void }) {
  const {
    gameState,
    timer,
    placements,
    score,
    lastResult,
    currentItems,
    unplacedItems,
    startGame,
    dropChip,
    total,
  } = usePresupuestoGame()

  const growPlant = useGrowPlant()
  const { saveSession } = useMinigameSession()
  const triggeredRef = useRef(false)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const placedCount = Object.keys(placements).length
  const timerPct = (timer / INITIAL_TIMER) * 100
  const timerColor = timer > 30 ? 'bg-green-500' : timer > 15 ? 'bg-yellow-400' : 'bg-red-500'

  useEffect(() => {
    if (gameState === 'done' && !triggeredRef.current) {
      triggeredRef.current = true
      saveSession('presupuesto_rapido', score)
      if (score >= PASS_THRESHOLD) {
        growPlant.mutate({ domain: 'control', masteryDelta: 0.04 })
      }
    }
  }, [gameState]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const zone = over.id as Zone
    if (!ZONES.includes(zone)) return
    dropChip(String(active.id), zone)
  }

  const handleRestart = () => {
    triggeredRef.current = false
    startGame()
  }

  if (gameState === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="organic-card p-8 text-center space-y-4"
      >
        <div className="w-40 h-32 mx-auto rounded-2xl overflow-hidden" style={{ background: 'color-mix(in srgb, var(--clay-soft) 30%, transparent)' }}>
          <PresupuestoRapidoIllustration className="w-full h-full" />
        </div>
        <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
          Presupuesto Rápido
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Arrastra cada gasto al frasco correcto: Necesidades, Deseos, Ahorro o Deudas. Tienes 90
          segundos para 8 gastos.
        </p>
        <button
          onClick={startGame}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Jugar
        </button>
      </motion.div>
    )
  }

  if (gameState === 'done') {
    return (
      <ResultsView
        items={currentItems}
        placements={placements}
        score={score}
        total={total}
        won={score >= PASS_THRESHOLD}
        onBack={onBack}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tiempo</span>
            <span className={timer <= 15 ? 'text-red-500 font-bold' : ''}>{timer}s</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${timerColor}`}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span className="font-semibold" style={{ color: 'var(--forest-deep)' }}>
              {score} pts
            </span>
            <span className="text-muted-foreground">
              {placedCount}/{total} colocados
            </span>
          </div>
        </div>

        <div className="organic-card p-3" style={{ minHeight: '100px' }}>
          <p className="text-[10px] uppercase tracking-wider font-bold mb-2 text-muted-foreground">
            Arrastra al frasco correcto
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {unplacedItems.map((g: Gasto) => (
                <motion.div
                  key={g.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                >
                  <DraggableItem
                    item={{
                      id: g.id,
                      label: `${g.label} · ${formatAmount(g.amount)}`,
                      emoji: g.emoji,
                    }}
                    submitted={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {unplacedItems.length === 0 && (
              <span className="text-xs text-muted-foreground py-4">
                Todos los gastos colocados.
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {ZONES.map((zone) => (
            <Jar
              key={zone}
              zone={zone}
              flash={lastResult !== null && placements[lastResult.chipId] === zone}
            />
          ))}
        </div>

        <AnimatePresence>
          {lastResult && (
            <motion.p
              key={`${lastResult.chipId}-${lastResult.correct}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs font-semibold"
              style={{ color: lastResult.correct ? '#16a34a' : '#dc2626' }}
            >
              {lastResult.correct ? '¡Correcto! +10' : 'Ups, −2'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  )
}
