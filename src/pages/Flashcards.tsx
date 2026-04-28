import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CreditCard,
  Flower2,
  ShieldCheck,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import BotanicalPage from '@/components/layout/BotanicalPage'
import { FlashcardSession } from '@/features/flashcards/components/FlashcardSession'
import { useDueCards } from '@/features/flashcards/hooks/useDueCards'
import { DOMAIN_LABELS } from '@/features/garden/types'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'
import pathNode from '@/assets/pixel/optimized/ui-path-node.webp'
import type { SkillDomain } from '@/features/garden/types'

const DOMAINS: SkillDomain[] = ['control', 'credito', 'proteccion', 'crecimiento']

const DOMAIN_ICON: Record<SkillDomain, LucideIcon> = {
  control: Flower2,
  credito: CreditCard,
  proteccion: ShieldCheck,
  crecimiento: TrendingUp,
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
    <BotanicalPage
      title="Vivero de Memoria"
      subtitle="Repasa conceptos clave con repeticion espaciada."
      eyebrow="Zona de repaso"
      zoneLabel="Recuerdos del Sendero"
      zoneHint="Cada repaso mantiene vivos los nodos que ya recorriste y ayuda a convertirlos en dominio."
      zoneItems={['Recuerda', 'Refuerza', 'Dora']}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <AnimatePresence mode="wait">
          {sessionActive ? (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="memory-session-surface p-5"
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
              <section className="memory-hero">
                <div className="memory-hero-token" aria-hidden="true">
                  <img src={pathNode} alt="" />
                  <BookOpen className="relative z-10 h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="memory-kicker">Repaso disponible</p>
                  <h2 className="font-heading text-xl font-bold leading-tight" style={{ color: 'var(--forest-deep)' }}>
                    Manten fresco lo que ya aprendiste
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
                    El Gasto Hormiga vuelve cuando olvidas. Un repaso corto conserva tu racha y tu memoria.
                  </p>
                </div>
              </section>

              <div
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
                role="tablist"
                aria-label="Filtrar por dominio"
              >
                <TabPill
                  active={activeTab === 'all'}
                  onClick={() => setActiveTab('all')}
                  label="Todos"
                  icon={Sprout}
                />
                {DOMAINS.map((d) => (
                  <TabPill
                    key={d}
                    active={activeTab === d}
                    onClick={() => setActiveTab(d)}
                    label={DOMAIN_LABELS[d]}
                    icon={DOMAIN_ICON[d]}
                  />
                ))}
              </div>

              {activeTab === 'all' && (
                <div className="grid grid-cols-2 gap-3">
                  {DOMAINS.map((d) => (
                    <DomainCard key={d} domain={d} />
                  ))}
                </div>
              )}

              <div className="memory-session-surface p-5 space-y-4">
                {isLoading ? (
                  <div className="h-20 animate-pulse rounded-2xl bg-muted" />
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
    </BotanicalPage>
  )
}

interface TabPillProps {
  active: boolean
  onClick: () => void
  label: string
  icon: LucideIcon
}

function TabPill({ active, onClick, label, icon: Icon }: TabPillProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold
        whitespace-nowrap transition-all duration-150 min-h-[40px]
        ${active
          ? 'text-white shadow-sm'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }
      `}
      style={active ? { backgroundColor: 'var(--leaf-bright)' } : undefined}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

function DomainCard({ domain }: { domain: SkillDomain }) {
  const { count, isLoading } = useDueCards(domain)
  const Icon = DOMAIN_ICON[domain]

  return (
    <div className="memory-domain-card">
      <div className="flex items-center gap-1.5">
        <Icon className="h-4 w-4" style={{ color: 'var(--leaf-bright)' }} />
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
      <div className="relative grid h-16 w-16 place-items-center">
        <img src={pathNode} alt="" className="absolute inset-0 h-full w-full" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
        <BookOpen className="relative z-10 h-7 w-7" style={{ color: 'var(--forest-deep)' }} />
      </div>
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
        className="vibrant-btn justify-center px-8 py-2.5 text-sm transition-transform active:scale-95"
      >
        Empezar sesion
      </button>
    </div>
  )
}

function EmptyState({ domain }: { domain: SkillDomain | 'all' }) {
  const label = domain === 'all' ? 'ningun dominio' : DOMAIN_LABELS[domain]

  return (
    <div className="flex flex-col items-center gap-3 text-center py-4">
      <img src={coinSprout} alt="" className="h-12 w-12" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
      <p className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
        Al dia
      </p>
      <p className="text-sm text-muted-foreground max-w-xs">
        No hay tarjetas pendientes en {label}. Vuelve manana para seguir creciendo.
      </p>
    </div>
  )
}
