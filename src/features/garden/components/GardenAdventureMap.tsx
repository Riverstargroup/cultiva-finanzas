import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Gamepad2,
  Home,
  LockKeyhole,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  X,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import livingPathBase from '@/assets/world/living-path-base.webp'
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'
import gastoHormigaIdle from '@/assets/pixel/optimized/enemy-gasto-hormiga-idle.webp'
import gastoHormigaWeakened from '@/assets/pixel/optimized/enemy-gasto-hormiga-weakened.webp'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'

interface AdventureNode {
  id: string
  title: string
  description: string
  reward: string
  status: 'completed' | 'next' | 'available' | 'locked' | 'boss'
  type: 'lesson' | 'review' | 'game' | 'chest' | 'home' | 'shop' | 'boss'
  icon: LucideIcon
  actionLabel: string
  position: { x: number; y: number }
  onAction?: () => void
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

export function GardenAdventureMap({
  totalMastery,
  onOpenCourses,
  onOpenGames,
  onOpenFlashcards,
  onOpenShop,
}: GardenAdventureMapProps) {
  const [recentReward, setRecentReward] = useState<RecentSeedReward | null>(null)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState('first-seed')

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

  const nodes = useMemo<AdventureNode[]>(
    () => [
      {
        id: 'first-seed',
        title: 'Primera semilla',
        description: 'Empieza Finanzas Basicas y gana tu primer companero.',
        reward: '+40 monedas',
        status: 'next',
        type: 'lesson',
        icon: BookOpen,
        actionLabel: 'Empezar leccion',
        position: { x: 51, y: 12.5 },
        onAction: onOpenCourses,
      },
      {
        id: 'market-memory',
        title: 'Memoria de mercado',
        description: 'Un juego corto para reconocer decisiones de gasto.',
        reward: 'entrenamiento',
        status: 'available',
        type: 'game',
        icon: Gamepad2,
        actionLabel: 'Jugar',
        position: { x: 60, y: 25.5 },
        onAction: onOpenGames,
      },
      {
        id: 'flash-review',
        title: 'Repaso express',
        description: 'Refuerza conceptos antes de que el camino se bloquee.',
        reward: 'racha y memoria',
        status: 'available',
        type: 'review',
        icon: RotateCcw,
        actionLabel: 'Repasar',
        position: { x: 40, y: 36.5 },
        onAction: onOpenFlashcards,
      },
      {
        id: 'seed-chest',
        title: 'Cofre de semillas',
        description: 'Recompensas por mantener el ritmo del aprendizaje.',
        reward: 'monedas bonus',
        status: 'available',
        type: 'chest',
        icon: Sparkles,
        actionLabel: 'Ver recompensa',
        position: { x: 58, y: 47.8 },
        onAction: onOpenCourses,
      },
      {
        id: 'garden-home',
        title: 'Casita del jardin',
        description: 'Aqui viven tus plantamigos y sus estadisticas.',
        reward: 'coleccion',
        status: 'locked',
        type: 'home',
        icon: Home,
        actionLabel: 'Pronto',
        position: { x: 47, y: 60.3 },
      },
      {
        id: 'shop-gate',
        title: 'Tienda botanica',
        description: 'Compra cosmeticos para tu viajero y plantamigos.',
        reward: 'desbloqueos',
        status: 'available',
        type: 'shop',
        icon: ShoppingBag,
        actionLabel: 'Abrir tienda',
        position: { x: 58, y: 73.2 },
        onAction: onOpenShop,
      },
      {
        id: 'boss-gasto',
        title: 'Gasto Hormiga',
        description: 'Un bloqueo que se debilita con lecciones, repasos y juegos.',
        reward: `poder ${bossPower}%`,
        status: 'boss',
        type: 'boss',
        icon: Trophy,
        actionLabel: 'Prepararme',
        position: { x: 49, y: 88 },
        onAction: onOpenCourses,
      },
    ],
    [bossPower, onOpenCourses, onOpenFlashcards, onOpenGames, onOpenShop],
  )

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0]

  const dismissReward = () => {
    setRecentReward(null)
    try {
      window.localStorage.removeItem('cf.recentSeedReward')
    } catch {
      // ignore storage errors
    }
  }

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

      <div className="mx-auto w-full max-w-[560px] space-y-4">
        <div className="w-full">
          <LivingPathMap
            nodes={nodes}
            selectedNode={selectedNode}
            bossPower={bossPower}
            onSelectNode={setSelectedNodeId}
          />
        </div>

        <NodeDetailPanel node={selectedNode} />
      </div>
    </section>
  )
}

function LivingPathMap({
  nodes,
  selectedNode,
  bossPower,
  onSelectNode,
}: {
  nodes: AdventureNode[]
  selectedNode: AdventureNode
  bossPower: number
  onSelectNode: (nodeId: string) => void
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] border"
      style={{
        borderColor: 'rgba(212,172,117,0.58)',
        background: '#F8EBCB',
        boxShadow: '0 18px 48px rgba(43,79,53,0.16)',
      }}
    >
      <div className="relative aspect-[941/1672] w-full">
        <img
          src={livingPathBase}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
          draggable={false}
        />

        <WorldMapHeader />

        {nodes.map((node) => (
          <LivingNodeButton
            key={node.id}
            node={node}
            selected={selectedNode.id === node.id}
            onSelect={() => onSelectNode(node.id)}
          />
        ))}

        <motion.img
          src={nopalitoIdle}
          alt="Nopalito"
          className="absolute right-[7%] top-[33%] w-[22%] max-w-[128px] drop-shadow-[0_10px_18px_rgba(43,79,53,0.24)]"
          style={{ imageRendering: 'pixelated' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        />

        <div className="absolute left-[5%] top-[68%] flex items-center gap-2 rounded-full border bg-white/78 px-3 py-2 shadow-sm backdrop-blur-sm" style={{ borderColor: 'rgba(212,172,117,0.55)' }}>
          <img
            src={bossPower < 55 ? gastoHormigaWeakened : gastoHormigaIdle}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
            style={{ imageRendering: 'pixelated' }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#8A4B22' }}>
              Gasto Hormiga
            </p>
            <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-red-100">
              <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400" style={{ width: `${bossPower}%` }} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border bg-[#FEFBF6]/88 p-3 shadow-[0_10px_30px_rgba(43,79,53,0.14)] backdrop-blur-sm" style={{ borderColor: 'rgba(212,172,117,0.55)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            Nodo seleccionado
          </p>
          <h2 className="font-heading text-lg font-bold leading-tight" style={{ color: 'var(--forest-deep)' }}>
            {selectedNode.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            {selectedNode.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function WorldMapHeader() {
  return (
    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2">
      <div className="rounded-full border bg-[#FEFBF6]/86 px-3 py-2 shadow-sm backdrop-blur-sm" style={{ borderColor: 'rgba(212,172,117,0.5)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
          Sendero Semilla
        </p>
        <p className="font-heading text-sm font-bold" style={{ color: 'var(--forest-deep)' }}>
          Finanzas basicas
        </p>
      </div>
      <div className="flex items-center gap-1 rounded-full border bg-[#FEFBF6]/86 px-2 py-1.5 shadow-sm backdrop-blur-sm" style={{ borderColor: 'rgba(212,172,117,0.5)' }}>
        <img src={coinSprout} alt="" className="h-6 w-6" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
        <span className="text-xs font-bold" style={{ color: 'var(--forest-deep)' }}>
          +40
        </span>
      </div>
    </div>
  )
}

function LivingNodeButton({
  node,
  selected,
  onSelect,
}: {
  node: AdventureNode
  selected: boolean
  onSelect: () => void
}) {
  const Icon = node.icon
  const locked = node.status === 'locked'
  const palette = getNodePalette(node)

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="absolute flex aspect-square w-[17.5%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center transition active:scale-95"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        borderColor: selected ? palette.border : 'rgba(255,255,255,0.9)',
        background: palette.background,
        color: palette.color,
        boxShadow: selected
          ? `0 0 0 4px ${palette.ring}, 0 10px 20px rgba(43,79,53,0.22)`
          : '0 8px 16px rgba(43,79,53,0.16)',
      }}
      aria-label={`${node.title}: ${node.description}`}
      animate={node.status === 'next' ? { y: [0, -4, 0] } : undefined}
      transition={node.status === 'next' ? { repeat: Infinity, duration: 2.2, ease: 'easeInOut' } : undefined}
    >
      {locked ? <LockKeyhole className="h-[34%] w-[34%]" /> : <Icon className="h-[36%] w-[36%]" />}
      {node.status === 'completed' && (
        <span className="absolute -bottom-2 flex gap-0.5">
          {[0, 1, 2].map((star) => (
            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-500" />
          ))}
        </span>
      )}
      {node.status === 'boss' && (
        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white">
          !
        </span>
      )}
    </motion.button>
  )
}

function getNodePalette(node: AdventureNode) {
  if (node.status === 'locked') {
    return {
      background: 'linear-gradient(180deg, #D8D0BE, #B9AD97)',
      border: '#9B907E',
      ring: 'rgba(155,144,126,0.2)',
      color: '#6F6658',
    }
  }

  if (node.status === 'boss') {
    return {
      background: 'linear-gradient(180deg, #F6C6B8, #D87057)',
      border: '#BF4E39',
      ring: 'rgba(216,112,87,0.26)',
      color: '#7F1D1D',
    }
  }

  if (node.type === 'game') {
    return {
      background: 'linear-gradient(180deg, #CBEFBB, #7FC25D)',
      border: '#5B9E3D',
      ring: 'rgba(91,158,61,0.22)',
      color: '#1B3B26',
    }
  }

  if (node.type === 'review') {
    return {
      background: 'linear-gradient(180deg, #D3F0E8, #8BC7BA)',
      border: '#5FA99A',
      ring: 'rgba(95,169,154,0.22)',
      color: '#17413B',
    }
  }

  if (node.type === 'chest' || node.status === 'completed') {
    return {
      background: 'linear-gradient(180deg, #FFE4A3, #E8B64A)',
      border: '#CB922E',
      ring: 'rgba(203,146,46,0.24)',
      color: '#6B4B12',
    }
  }

  return {
    background: 'linear-gradient(180deg, #FDF7E8, #A9D98F)',
    border: '#7DB95B',
    ring: 'rgba(125,185,91,0.22)',
    color: '#1B3B26',
  }
}

function NodeDetailPanel({ node }: { node: AdventureNode }) {
  const Icon = node.icon
  const locked = node.status === 'locked'

  return (
    <div className="rounded-[22px] border bg-[#FEFBF6]/92 p-4 shadow-[0_14px_34px_rgba(43,79,53,0.12)]" style={{ borderColor: 'rgba(212,172,117,0.58)' }}>
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'rgba(112,181,91,0.16)', color: 'var(--forest-deep)' }}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            {node.status === 'boss' ? 'Bloqueo del camino' : 'Siguiente paso'}
          </p>
          <h2 className="font-heading text-xl font-bold leading-tight" style={{ color: 'var(--forest-deep)' }}>
            {node.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            {node.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl px-3 py-2" style={{ background: 'rgba(229,184,75,0.14)', color: '#6B4B12' }}>
        <span className="text-xs font-bold uppercase tracking-wide">Recompensa</span>
        <span className="text-sm font-bold">{node.reward}</span>
      </div>

      <button
        type="button"
        disabled={locked || !node.onAction}
        onClick={node.onAction}
        className="mt-4 min-h-[46px] w-full rounded-2xl px-4 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
        style={{
          background: locked ? 'rgba(91,122,58,0.12)' : 'var(--forest-deep)',
          color: locked ? 'var(--leaf-muted)' : '#fff',
        }}
      >
        {node.actionLabel}
      </button>
    </div>
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
        className="w-full max-w-md rounded-[24px] border p-5 text-center"
        style={{
          borderColor: 'color-mix(in srgb, var(--leaf-bright) 45%, var(--clay-soft))',
          background: 'linear-gradient(145deg, #FEFBF6, rgba(229,184,75,0.2))',
          boxShadow: '0 24px 80px rgba(27,59,38,0.28)',
        }}
      >
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl" style={{ background: 'rgba(76,175,80,0.12)' }}>
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
            className="min-h-[44px] rounded-2xl px-4 text-sm font-bold"
            style={{ background: 'var(--forest-deep)', color: '#fff' }}
          >
            Seguir entrenando
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-2xl px-4 text-sm font-bold"
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
      className="rounded-[22px] border p-4"
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

