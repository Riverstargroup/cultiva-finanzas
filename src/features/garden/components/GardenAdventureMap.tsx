import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Gamepad2, Home, LockKeyhole, Route, RotateCcw, ShoppingBag, X } from 'lucide-react'
import { motion } from 'framer-motion'
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'
import helechoIdle from '@/assets/pixel/optimized/plantamigo-helecho-sabio-idle.webp'
import lirioIdle from '@/assets/pixel/optimized/plantamigo-lirio-guardian-idle.webp'
import giraIdle from '@/assets/pixel/optimized/plantamigo-gira-compas-idle.webp'
import doradoIdle from '@/assets/pixel/optimized/plantamigo-brotin-dorado-idle.webp'
import gastoHormigaIdle from '@/assets/pixel/optimized/enemy-gasto-hormiga-idle.webp'
import gastoHormigaWeakened from '@/assets/pixel/optimized/enemy-gasto-hormiga-weakened.webp'
import greenhousePoi from '@/assets/pixel/optimized/poi-course-greenhouse.webp'
import shopGatePoi from '@/assets/pixel/optimized/poi-shop-gate.webp'
import gardenHomePoi from '@/assets/pixel/optimized/poi-garden-home.webp'
import pathNode from '@/assets/pixel/optimized/ui-path-node.webp'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'

interface AdventureNode {
  id: string
  title: string
  description: string
  reward: string
  status: 'available' | 'next' | 'locked' | 'boss'
  icon: typeof BookOpen
  image?: string
  actionLabel: string
  onAction?: () => void
}

interface PlantBuddy {
  id: string
  name: string
  role: string
  unlock: string
  image: string
}

interface GardenAdventureMapProps {
  totalMastery: number
  onOpenCourses: () => void
  onOpenGames: () => void
  onOpenFlashcards: () => void
  onOpenShop: () => void
}

interface RecentSeedReward {
  scenarioTitle: string
  coins: number
  score: number
  bossDamage: number
  unlockedPlantamigo: string | null
  completedAt: string
}

const PLANT_BUDDIES: readonly PlantBuddy[] = [
  {
    id: 'nopalito',
    name: 'Nopalito',
    role: 'Detecta fugas de gasto y mantiene tu presupuesto vivo.',
    unlock: 'Completa tu primera semilla de Control.',
    image: nopalitoIdle,
  },
  {
    id: 'helecho-sabio',
    name: 'Helecho Sabio',
    role: 'Lee intereses, fechas de corte y deuda antes de que crezcan.',
    unlock: 'Supera 2 nodos de credito.',
    image: helechoIdle,
  },
  {
    id: 'lirio-guardian',
    name: 'Lirio Guardian',
    role: 'Protege tu racha, tu fondo de emergencia y tus decisiones riesgosas.',
    unlock: 'Activa una mision de proteccion.',
    image: lirioIdle,
  },
  {
    id: 'gira-compas',
    name: 'Gira Compas',
    role: 'Convierte ahorro constante en crecimiento visible.',
    unlock: 'Gana una partida de ahorro o inversion.',
    image: giraIdle,
  },
  {
    id: 'brotin-dorado',
    name: 'Brotin Dorado',
    role: 'Genera monedas pasivas cuando vuelves al jardin.',
    unlock: 'Compralo en la tienda con monedas.',
    image: doradoIdle,
  },
] as const

export function GardenAdventureMap({
  totalMastery,
  onOpenCourses,
  onOpenGames,
  onOpenFlashcards,
  onOpenShop,
}: GardenAdventureMapProps) {
  const [recentReward, setRecentReward] = useState<RecentSeedReward | null>(null)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('cf.recentSeedReward')
      if (!raw) return
      const parsed = JSON.parse(raw) as RecentSeedReward
      const ageMs = Date.now() - new Date(parsed.completedAt).getTime()
      if (Number.isFinite(ageMs) && ageMs < 1000 * 60 * 60 * 24) {
        setRecentReward(parsed)
        setUnlockModalOpen(Boolean(parsed.unlockedPlantamigo))
      }
    } catch {
      // ignore malformed reward payloads
    }
  }, [])

  const bossPower = useMemo(() => {
    const masteryDamage = Math.min(28, Math.round(totalMastery * 16))
    const rewardDamage = recentReward?.bossDamage ?? 0
    return Math.max(18, 72 - masteryDamage - rewardDamage)
  }, [recentReward?.bossDamage, totalMastery])

  const dismissReward = () => {
    setRecentReward(null)
    try {
      window.localStorage.removeItem('cf.recentSeedReward')
    } catch {
      // ignore storage errors
    }
  }

  const nodes: AdventureNode[] = [
    {
      id: 'first-seed',
      title: 'Primera semilla',
      description: 'Empieza Raices y gana tu primer companero.',
      reward: '+40 monedas, planta reacciona',
      status: 'next',
      icon: BookOpen,
      image: greenhousePoi,
      actionLabel: 'Empezar curso',
      onAction: onOpenCourses,
    },
    {
      id: 'review-spring',
      title: 'Fuente de repaso',
      description: 'Refuerza conceptos antes del siguiente bloqueo.',
      reward: 'racha y memoria',
      status: 'available',
      icon: RotateCcw,
      actionLabel: 'Repasar',
      onAction: onOpenFlashcards,
    },
    {
      id: 'mini-game',
      title: 'Prueba express',
      description: 'Juega 60 segundos para debilitar malos habitos.',
      reward: 'bonus de ataque',
      status: 'available',
      icon: Gamepad2,
      actionLabel: 'Jugar',
      onAction: onOpenGames,
    },
    {
      id: 'home-base',
      title: 'Casita del jardin',
      description: 'Aqui viven tus plantamigos y sus estadisticas.',
      reward: 'coleccion',
      status: 'locked',
      icon: Home,
      image: gardenHomePoi,
      actionLabel: 'Pronto',
    },
    {
      id: 'shop-gate',
      title: 'Puerta de tienda',
      description: 'Compra plantamigos especiales y cosmeticos.',
      reward: 'desbloqueos',
      status: 'available',
      icon: ShoppingBag,
      image: shopGatePoi,
      actionLabel: 'Abrir tienda',
      onAction: onOpenShop,
    },
  ]

  return (
    <section className="space-y-4">
      {unlockModalOpen && recentReward?.unlockedPlantamigo && (
        <PlantamigoUnlockModal
          plantamigoName={recentReward.unlockedPlantamigo}
          onClose={() => setUnlockModalOpen(false)}
          onStartCourse={() => {
            setUnlockModalOpen(false)
            onOpenCourses()
          }}
        />
      )}
      {recentReward && (
        <RewardImpactBanner reward={recentReward} bossPower={bossPower} onDismiss={dismissReward} />
      )}
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
        <div
          className="overflow-hidden rounded-lg border"
          style={{
            borderColor: 'color-mix(in srgb, var(--clay-soft) 70%, transparent)',
            background:
              'linear-gradient(145deg, rgba(254,251,246,0.95), rgba(232,220,196,0.72))',
            boxShadow: '0 14px 38px rgba(93,49,54,0.12)',
          }}
        >
          <div className="flex items-start justify-between gap-3 border-b p-4" style={{ borderColor: 'var(--clay-soft)' }}>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
                <Route className="h-4 w-4" />
                Ruta viva
              </div>
              <h2 className="mt-1 font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
                Derrota los malos habitos avanzando por nodos
              </h2>
            </div>
            <div className="hidden rounded-full px-3 py-1 text-xs font-bold md:block" style={{ background: 'var(--forest-deep)', color: '#fff' }}>
              Vertical slice
            </div>
          </div>

          <div className="relative min-h-[340px] p-4 md:p-5">
            <div
              className="absolute left-[8%] right-[8%] top-[50%] h-2 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, var(--leaf-bright), var(--coin-gold, #E5B84B), rgba(91,122,58,0.38))',
              }}
              aria-hidden="true"
            />
            <div className="relative grid min-h-[300px] grid-cols-2 gap-3 md:grid-cols-5 md:items-center">
              {nodes.map((node, index) => (
                <AdventureNodeCard key={node.id} node={node} index={index} />
              ))}
            </div>
          </div>
        </div>

        <BossCard power={bossPower} />
      </div>

      <PlantBuddyRoster />
    </section>
  )
}

function PlantamigoUnlockModal({
  plantamigoName,
  onClose,
  onStartCourse,
}: {
  plantamigoName: string
  onClose: () => void
  onStartCourse: () => void
}) {
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plantamigo-unlock-title"
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-lg border p-5 text-center"
        style={{
          borderColor: 'color-mix(in srgb, var(--leaf-bright) 45%, var(--clay-soft))',
          background: 'linear-gradient(145deg, #FEFBF6, rgba(229,184,75,0.2))',
          boxShadow: '0 24px 80px rgba(27,59,38,0.28)',
        }}
      >
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-lg" style={{ background: 'rgba(76,175,80,0.12)' }}>
          <img
            src={nopalitoIdle}
            alt={plantamigoName}
            className="h-full w-full object-cover"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Nuevo plantamigo encontrado
          </div>
          <h2 id="plantamigo-unlock-title" className="mt-1 font-heading text-2xl font-bold" style={{ color: 'var(--forest-deep)' }}>
            {plantamigoName} se une a tu jardin
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            Ayuda a detectar fugas de gasto y hace mas fuerte tu ruta de Control. Sube su nivel completando semillas, repasos y retos.
          </p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onStartCourse}
            className="min-h-[44px] rounded-md px-4 text-sm font-bold"
            style={{ background: 'var(--forest-deep)', color: '#fff' }}
          >
            Seguir entrenando
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-md px-4 text-sm font-bold"
            style={{
              background: 'color-mix(in srgb, var(--forest-deep) 10%, transparent)',
              color: 'var(--forest-deep)',
            }}
          >
            Ver mi jardin
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function RewardImpactBanner({
  reward,
  bossPower,
  onDismiss,
}: {
  reward: RecentSeedReward
  bossPower: number
  onDismiss: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border p-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--leaf-bright) 45%, var(--clay-soft))',
        background: 'linear-gradient(135deg, rgba(254,251,246,0.98), rgba(229,184,75,0.18))',
        boxShadow: '0 14px 34px rgba(93,49,54,0.12)',
      }}
    >
      <div className="flex items-start gap-3">
        <img src={coinSprout} alt="" className="h-10 w-10 shrink-0" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Impacto en el jardin
          </div>
          <h2 className="font-heading text-lg font-bold" style={{ color: 'var(--forest-deep)' }}>
            {reward.scenarioTitle} debilito al Gasto Hormiga
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--leaf-muted)' }}>
            +{reward.coins} monedas, {reward.score}% de dominio y -{reward.bossDamage}% de poder enemigo.
            {reward.unlockedPlantamigo ? ` ${reward.unlockedPlantamigo} ya puede acompanarte.` : ''}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'rgba(127,29,29,0.12)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${bossPower}%`, background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{ color: 'var(--leaf-muted)', background: 'rgba(255,255,255,0.64)' }}
          aria-label="Ocultar recompensa"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

function AdventureNodeCard({ node, index }: { node: AdventureNode; index: number }) {
  const Icon = node.icon
  const isLocked = node.status === 'locked'
  const isNext = node.status === 'next'

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.22 }}
      className="relative flex min-h-[196px] flex-col justify-between rounded-lg border p-3"
      style={{
        borderColor: isNext ? 'var(--leaf-bright)' : 'color-mix(in srgb, var(--clay-soft) 70%, transparent)',
        background: isNext ? '#FEFBF6' : 'rgba(255,255,255,0.72)',
        boxShadow: isNext ? '0 0 0 3px color-mix(in srgb, var(--leaf-bright) 18%, transparent)' : 'none',
        transform: `translateY(${index % 2 === 0 ? -18 : 22}px)`,
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg"
            style={{
              background: isLocked ? 'rgba(91,122,58,0.1)' : 'color-mix(in srgb, var(--leaf-bright) 16%, white)',
              color: isLocked ? 'var(--leaf-muted)' : 'var(--forest-deep)',
            }}
          >
            {node.image ? (
              <img
                src={node.image}
                alt=""
                className="h-full w-full object-cover"
                style={{ imageRendering: 'pixelated' }}
                aria-hidden="true"
              />
            ) : isLocked ? (
              <LockKeyhole className="h-5 w-5" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </span>
          {isNext ? (
            <img src={coinSprout} alt="" className="h-7 w-7" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
          ) : (
            <img src={pathNode} alt="" className="h-7 w-7 opacity-75" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
          )}
        </div>
        <div>
          <h3 className="font-heading text-base font-bold leading-tight" style={{ color: 'var(--forest-deep)' }}>
            {node.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            {node.description}
          </p>
        </div>
        <p className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: 'rgba(229,184,75,0.18)', color: '#6B4B12' }}>
          <img src={coinSprout} alt="" className="h-4 w-4" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
          {node.reward}
        </p>
      </div>
      <button
        type="button"
        disabled={isLocked || !node.onAction}
        onClick={node.onAction}
        className="mt-3 min-h-[38px] rounded-md px-3 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
        style={{
          background: isNext ? 'var(--forest-deep)' : 'color-mix(in srgb, var(--forest-deep) 10%, transparent)',
          color: isNext ? '#fff' : 'var(--forest-deep)',
        }}
      >
        {node.actionLabel}
      </button>
    </motion.article>
  )
}

function BossCard({ power }: { power: number }) {
  const isWeakened = power < 55

  return (
    <aside
      className="rounded-lg border p-4"
      style={{
        borderColor: 'rgba(127,29,29,0.22)',
        background: 'linear-gradient(160deg, #FEFBF6, rgba(255,237,213,0.86))',
        boxShadow: '0 14px 38px rgba(127,29,29,0.12)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', color: '#991B1B' }}>
          <img
            src={isWeakened ? gastoHormigaWeakened : gastoHormigaIdle}
            alt="Gasto Hormiga"
            className="h-full w-full object-cover"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#991B1B' }}>
            Bloqueo del camino
          </div>
          <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
            Gasto Hormiga
          </h2>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            Se alimenta de compras pequenas, suscripciones olvidadas y decisiones automaticas.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs font-bold" style={{ color: 'var(--forest-deep)' }}>
            <span>Poder actual</span>
            <span>{power}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full" style={{ background: 'rgba(127,29,29,0.12)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${power}%`, background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
          </div>
        </div>

        <div className="grid gap-2 text-xs">
          {[
            'Completa una semilla de Control: -25%',
            'Repasa 5 tarjetas vencidas: -15%',
            'Gana Presupuesto Rapido: -20%',
          ].map((item) => (
            <div key={item} className="rounded-md px-3 py-2 font-semibold" style={{ background: 'rgba(255,255,255,0.72)', color: 'var(--forest-deep)' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function PlantBuddyRoster() {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--clay-soft) 70%, transparent)',
        background: 'rgba(254,251,246,0.88)',
      }}
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Plantamigos
          </div>
          <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
            Companeros desbloqueables
          </h2>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'rgba(76,175,80,0.14)', color: 'var(--forest-deep)' }}>
          5 MVP
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PLANT_BUDDIES.map((buddy) => (
          <article key={buddy.id} className="rounded-lg border bg-white/70 p-3" style={{ borderColor: 'var(--clay-soft)' }}>
            <div className="flex justify-center">
              <PixelSprite src={buddy.image} alt={buddy.name} />
            </div>
            <div className="mt-3 space-y-2">
              <h3 className="font-heading text-sm font-bold" style={{ color: 'var(--forest-deep)' }}>
                {buddy.name}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
                {buddy.role}
              </p>
              <p className="rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: 'rgba(91,122,58,0.1)', color: 'var(--forest-deep)' }}>
                {buddy.unlock}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function PixelSprite({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative h-28 w-28 overflow-hidden rounded-lg"
      style={{
        imageRendering: 'pixelated',
        background: 'linear-gradient(145deg, rgba(91,122,58,0.16), rgba(229,184,75,0.12))',
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full select-none object-cover"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}
