import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { FlashcardSession } from '@/features/flashcards/components/FlashcardSession'
import { useDueCards } from '@/features/flashcards/hooks/useDueCards'
import { DOMAIN_LABELS } from '@/features/garden/types'
import type { SkillDomain } from '@/features/garden/types'

const DOMAINS: SkillDomain[] = ['control', 'credito', 'proteccion', 'crecimiento']

const DOMAIN_EMOJI: Record<SkillDomain, string> = {
  control: '🌼',
  credito: '🌺',
  proteccion: '🌿',
  crecimiento: '🌻',
}

export default function Flashcards() {
  const [activeTab, setActiveTab] = useState<SkillDomain | 'all'>('all')
  const [sessionActive, setSessionActive] = useState(false)

  const domain = activeTab === 'all' ? undefined : activeTab
  const { cards, isLoading, count } = useDueCards(domain)

  const handleStart = () => {
    if (count > 0) setSessionActive(true)
  }

  const handleClose = () => {
    setSessionActive(false)
  }

  return (
    <div className="dashboard-skin botanical-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-heading text-2xl font-bold"
              style={{ color: 'var(--forest-deep)' }}
            >
              Flashcards
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Repasa conceptos clave con repetición espaciada
            </p>
          </div>
          <BookOpen className="text-leaf-bright" size={28} />
        </div>

        <AnimatePresence mode="wait">
          {sessionActive ? (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="organic-card p-5"
            >
              <FlashcardSession cards={cards} onClose={handleClose} />
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Domain tabs */}
              <div
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
                role="tablist"
                aria-label="Filtrar por dominio"
              >
                <TabPill
                  active={activeTab === 'all'}
                  onClick={() => setActiveTab('all')}
                  label="Todos"
                  emoji="🗂️"
                />
                {DOMAINS.map((d) => (
                  <TabPill
                    key={d}
                    active={activeTab === d}
                    onClick={() => setActiveTab(d)}
                    label={DOMAIN_LABELS[d]}
                    emoji={DOMAIN_EMOJI[d]}
                  />
                ))}
              </div>

              {/* Domain summary cards */}
              {activeTab === 'all' && (
                <div className="grid grid-cols-2 gap-3">
                  {DOMAINS.map((d) => (
                    <DomainCard key={d} domain={d} />
                  ))}
                </div>
              )}

              {/* Main CTA */}
              <div className="organic-card p-5 space-y-4">
                {isLoading ? (
                  <div className="h-20 animate-pulse rounded-xl bg-muted" />
                ) : count === 0 ? (
                  <EmptyState domain={activeTab} />
                ) : (
                  <ReadyToReview count={count} onStart={handleStart} domain={activeTab} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---- Sub-components ----

interface TabPillProps {
  active: boolean
  onClick: () => void
  label: string
  emoji: string
}

function TabPill({ active, onClick, label, emoji }: TabPillProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold
        whitespace-nowrap transition-all duration-150
        ${active
          ? 'text-white shadow-sm'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }
      `}
      style={active ? { backgroundColor: 'var(--leaf-bright)' } : undefined}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

function DomainCard({ domain }: { domain: SkillDomain }) {
  const { count, isLoading } = useDueCards(domain)

  return (
    <div
      className="rounded-xl p-4 space-y-1"
      style={{
        backgroundColor: 'var(--garden-plot-surface)',
        border: '1px solid var(--garden-plot-border)',
      }}
    >
      <div className="flex items-center gap-1.5">
        <span>{DOMAIN_EMOJI[domain]}</span>
        <span className="text-xs font-bold" style={{ color: 'var(--forest-deep)' }}>
          {DOMAIN_LABELS[domain]}
        </span>
      </div>
      {isLoading ? (
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
      ) : (
        <p className="text-lg font-bold" style={{ color: 'var(--leaf-bright)' }}>
          {count}
          <span className="text-xs font-normal text-muted-foreground ml-1">para revisar</span>
        </p>
      )}
    </div>
  )
}

function ReadyToReview({
  count,
  onStart,
  domain,
}: {
  count: number
  onStart: () => void
  domain: SkillDomain | 'all'
}) {
  const label = domain === 'all' ? 'todos los dominios' : DOMAIN_LABELS[domain]

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="text-4xl">🃏</span>
      <div>
        <p className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
          {count} {count === 1 ? 'tarjeta lista' : 'tarjetas listas'}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Para revisar hoy en {label}
        </p>
      </div>
      <button
        onClick={onStart}
        className="px-8 py-2.5 rounded-xl font-semibold text-sm text-white transition-transform active:scale-95 hover:brightness-110"
        style={{ backgroundColor: 'var(--leaf-bright)' }}
      >
        Empezar sesión
      </button>
    </div>
  )
}

function EmptyState({ domain }: { domain: SkillDomain | 'all' }) {
  const label = domain === 'all' ? 'ningún dominio' : DOMAIN_LABELS[domain]

  return (
    <div className="flex flex-col items-center gap-3 text-center py-4">
      <span className="text-4xl">🌱</span>
      <p className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
        ¡Al día!
      </p>
      <p className="text-sm text-muted-foreground max-w-xs">
        No hay tarjetas pendientes en {label}. Vuelve mañana para seguir creciendo.
      </p>
    </div>
  )
}
