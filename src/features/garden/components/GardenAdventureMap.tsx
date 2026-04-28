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
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'
import gastoHormigaIdle from '@/assets/pixel/optimized/enemy-gasto-hormiga-idle.webp'
import gastoHormigaWeakened from '@/assets/pixel/optimized/enemy-gasto-hormiga-weakened.webp'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'
import pathNodeBase from '@/assets/pixel/optimized/ui-path-node.webp'
import {
  SENDERO_PHASE_ONE_TITLE,
  type SenderoNode,
} from '@/features/sendero/senderoNodes'
import { useSenderoProgress } from '@/features/sendero/useSenderoProgress'

type AdventureNode = SenderoNode & {
  icon: LucideIcon
  onAction?: () => void
}

interface GardenAdventureMapProps {
  totalMastery: number
  onOpenNode: (node: SenderoNode) => void
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
  onOpenNode,
}: GardenAdventureMapProps) {
  const [recentReward, setRecentReward] = useState<RecentSeedReward | null>(null)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState('first-seed')
  const senderoProgress = useSenderoProgress()

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
    () =>
      senderoProgress.nodes.map((node) => ({
        ...node,
        reward: node.status === 'boss' ? `poder ${bossPower}%` : node.reward,
        icon: getNodeIcon(node.type),
        onAction: () => onOpenNode(node),
      })),
    [bossPower, onOpenNode, senderoProgress.nodes],
  )

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0]
  const selectedNodeIndex = Math.max(0, nodes.findIndex((node) => node.id === selectedNode.id))

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
            selectedNode.onAction?.()
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
            selectedNodeIndex={selectedNodeIndex}
            bossPower={bossPower}
            completedScenarios={senderoProgress.completedScenarios}
            onSelectNode={setSelectedNodeId}
            onActivateNode={onOpenNode}
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
  selectedNodeIndex,
  bossPower,
  completedScenarios,
  onSelectNode,
  onActivateNode,
}: {
  nodes: AdventureNode[]
  selectedNode: AdventureNode
  selectedNodeIndex: number
  bossPower: number
  completedScenarios: number
  onSelectNode: (nodeId: string) => void
  onActivateNode: (node: SenderoNode) => void
}) {
  return (
    <div
      className="sendero-map-shell relative overflow-hidden rounded-[28px] border"
      style={{
        borderColor: 'rgba(212,172,117,0.58)',
        background: '#F8EBCB',
        boxShadow: '0 18px 48px rgba(43,79,53,0.16)',
      }}
    >
      <div className="relative aspect-[941/1672] w-full">
        <SenderoBackdrop />

        <WorldMapHeader
          completedScenarios={completedScenarios}
          selectedNodeIndex={selectedNodeIndex}
          totalNodes={nodes.length}
        />

        {nodes.map((node) => (
          <LivingNodeButton
            key={node.id}
            node={node}
            selected={selectedNode.id === node.id}
            onSelect={() => {
              onSelectNode(node.id)
              if (node.status !== 'locked') onActivateNode(node)
            }}
          />
        ))}

        <motion.img
          src={nopalitoIdle}
          alt="Nopalito"
          className="sprite-clean absolute right-[7%] top-[33%] w-[22%] max-w-[128px] drop-shadow-[0_10px_18px_rgba(43,79,53,0.24)]"
          style={{ imageRendering: 'pixelated' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        />

        <GastoHormigaMarker bossPower={bossPower} />

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

function SenderoBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#EAF4C7]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(120,169,75,0.24),transparent_8rem),radial-gradient(circle_at_82%_20%,rgba(120,169,75,0.22),transparent_7rem),radial-gradient(circle_at_16%_72%,rgba(91,122,58,0.18),transparent_8rem),linear-gradient(180deg,#FFF2C7_0%,#EAF4C7_34%,#DDEEB9_100%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 178"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          d="M50 0 C72 18 34 30 49 45 C65 60 34 72 48 88 C66 108 36 121 49 139 C62 155 42 165 50 178"
          fill="none"
          stroke="#D8B47A"
          strokeWidth="17"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d="M50 0 C72 18 34 30 49 45 C65 60 34 72 48 88 C66 108 36 121 49 139 C62 155 42 165 50 178"
          fill="none"
          stroke="#FFF0CA"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M50 0 C72 18 34 30 49 45 C65 60 34 72 48 88 C66 108 36 121 49 139 C62 155 42 165 50 178"
          fill="none"
          stroke="#FFE5B5"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.72"
        />
      </svg>

      <div className="absolute left-[5%] top-[18%] h-24 w-24 rounded-full bg-[#86B85F]/30 blur-sm" />
      <div className="absolute right-[4%] top-[26%] h-28 w-24 rounded-full bg-[#6FA14D]/22 blur-sm" />
      <div className="absolute left-[8%] top-[54%] h-28 w-28 rounded-full bg-[#7CB557]/26 blur-sm" />
      <div className="absolute right-[8%] bottom-[12%] h-24 w-28 rounded-full bg-[#6C9D49]/24 blur-sm" />

      <GardenPot className="left-[8%] top-[8%]" />
      <GardenPot className="right-[7%] top-[42%]" />
      <GardenPot className="left-[10%] bottom-[12%]" />
      <CoinCluster className="right-[10%] bottom-[22%]" />
      <CoinCluster className="left-[7%] top-[70%]" />
    </div>
  )
}

function GardenPot({ className }: { className: string }) {
  return (
    <div className={`absolute ${className} h-16 w-16`}>
      <div className="absolute left-[35%] top-1 h-8 w-3 rounded-full bg-[#5B8E45]" />
      <div className="absolute left-[18%] top-2 h-7 w-5 rounded-full bg-[#7CB557]" style={{ transform: 'rotate(-35deg)' }} />
      <div className="absolute right-[20%] top-0 h-7 w-5 rounded-full bg-[#8FC665]" style={{ transform: 'rotate(35deg)' }} />
      <div className="absolute bottom-0 left-[18%] h-9 w-10 rounded-b-xl rounded-t-md bg-[#C77A3B] shadow-[inset_0_-5px_0_rgba(106,75,36,0.18)]" />
      <div className="absolute bottom-8 left-[14%] h-3 w-12 rounded-full bg-[#D8914C]" />
    </div>
  )
}

function CoinCluster({ className }: { className: string }) {
  return (
    <div className={`absolute ${className} h-12 w-16`}>
      {[0, 1, 2].map((coin) => (
        <img
          key={coin}
          src={coinSprout}
          alt=""
          className="absolute h-7 w-7"
          style={{
            left: `${coin * 17}px`,
            top: `${coin % 2 === 0 ? 8 : 0}px`,
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  )
}

function WorldMapHeader({
  completedScenarios,
  selectedNodeIndex,
  totalNodes,
}: {
  completedScenarios: number
  selectedNodeIndex: number
  totalNodes: number
}) {
  const progress = totalNodes > 1 ? Math.round((selectedNodeIndex / (totalNodes - 1)) * 100) : 0

  return (
    <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1 rounded-[18px] border bg-[#FEFBF6]/90 px-3 py-2 shadow-sm backdrop-blur-sm" style={{ borderColor: 'rgba(212,172,117,0.5)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
          Sendero Semilla
        </p>
        <p className="font-heading text-sm font-bold" style={{ color: 'var(--forest-deep)' }}>
          {SENDERO_PHASE_ONE_TITLE}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8D2A9]" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#78A94B] to-[#E5B84B]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 rounded-full border bg-[#FEFBF6]/90 px-2 py-1.5 shadow-sm backdrop-blur-sm" style={{ borderColor: 'rgba(212,172,117,0.5)' }}>
        <img src={coinSprout} alt="" className="h-6 w-6" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
        <span className="text-xs font-bold" style={{ color: 'var(--forest-deep)' }}>
          {completedScenarios} semillas
        </span>
      </div>
    </div>
  )
}

function getNodeIcon(type: SenderoNode['type']) {
  const icons: Record<SenderoNode['type'], LucideIcon> = {
    lesson: BookOpen,
    review: RotateCcw,
    game: Gamepad2,
    chest: Sparkles,
    home: Home,
    shop: ShoppingBag,
    boss: Trophy,
  }

  return icons[type]
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
      className="sendero-node-button absolute flex aspect-square w-[18.8%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center transition active:scale-95"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        borderColor: selected ? palette.border : 'rgba(255,255,255,0.9)',
        background: palette.surface,
        color: palette.color,
        boxShadow: selected
          ? `0 0 0 4px ${palette.ring}, 0 16px 24px rgba(43,79,53,0.25), inset 0 4px 0 rgba(255,255,255,0.68)`
          : '0 12px 18px rgba(43,79,53,0.18), inset 0 4px 0 rgba(255,255,255,0.58)',
      }}
      aria-label={locked ? `${node.title}: bloqueado. ${node.description}` : `Abrir ${node.title}: ${node.description}`}
      data-status={node.status}
      data-type={node.type}
      whileHover={locked ? undefined : { y: -3 }}
      whileTap={locked ? undefined : { scale: 0.94 }}
      animate={node.status === 'next' ? { y: [0, -4, 0] } : undefined}
      transition={node.status === 'next' ? { repeat: Infinity, duration: 2.2, ease: 'easeInOut' } : undefined}
    >
      <span
        className="absolute inset-x-[9%] bottom-[-8%] h-[24%] rounded-full"
        style={{ background: palette.depth, filter: 'blur(0.2px)' }}
        aria-hidden="true"
      />
      <img
        src={pathNodeBase}
        alt=""
        className="absolute inset-[-4%] h-[108%] w-[108%] object-contain opacity-45"
        style={{ imageRendering: 'pixelated' }}
        aria-hidden="true"
        draggable={false}
      />
      <span
        className="absolute inset-[14%] rounded-full"
        style={{ background: palette.inner, boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.72)' }}
        aria-hidden="true"
      />
      {locked ? (
        <LockKeyhole className="relative z-10 h-[34%] w-[34%]" />
      ) : (
        <Icon className="relative z-10 h-[36%] w-[36%]" />
      )}
      {node.status === 'completed' && (
        <span className="absolute -bottom-3 z-20 flex gap-0.5">
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
      surface: 'linear-gradient(180deg, #D8D0BE, #B9AD97)',
      inner: 'linear-gradient(180deg, #EDE7DB, #C2B6A1)',
      depth: '#8E816D',
      border: '#9B907E',
      ring: 'rgba(155,144,126,0.2)',
      color: '#6F6658',
    }
  }

  if (node.status === 'boss') {
    return {
      surface: 'linear-gradient(180deg, #F6C6B8, #D87057)',
      inner: 'linear-gradient(180deg, #FAD9CF, #E78A74)',
      depth: '#A8412F',
      border: '#BF4E39',
      ring: 'rgba(216,112,87,0.26)',
      color: '#7F1D1D',
    }
  }

  if (node.type === 'game') {
    return {
      surface: 'linear-gradient(180deg, #CBEFBB, #7FC25D)',
      inner: 'linear-gradient(180deg, #E9F7DA, #93D071)',
      depth: '#4F8A34',
      border: '#5B9E3D',
      ring: 'rgba(91,158,61,0.22)',
      color: '#1B3B26',
    }
  }

  if (node.type === 'review') {
    return {
      surface: 'linear-gradient(180deg, #D3F0E8, #8BC7BA)',
      inner: 'linear-gradient(180deg, #F1FBF6, #A8D9CE)',
      depth: '#4E9487',
      border: '#5FA99A',
      ring: 'rgba(95,169,154,0.22)',
      color: '#17413B',
    }
  }

  if (node.type === 'chest' || node.status === 'completed') {
    return {
      surface: 'linear-gradient(180deg, #FFE4A3, #E8B64A)',
      inner: 'linear-gradient(180deg, #FFF4CA, #F0C760)',
      depth: '#B67C22',
      border: '#CB922E',
      ring: 'rgba(203,146,46,0.24)',
      color: '#6B4B12',
    }
  }

  return {
    surface: 'linear-gradient(180deg, #FDF7E8, #A9D98F)',
    inner: 'linear-gradient(180deg, #FFF9E8, #BEE5A4)',
    depth: '#73A951',
    border: '#7DB95B',
    ring: 'rgba(125,185,91,0.22)',
    color: '#1B3B26',
  }
}

function GastoHormigaMarker({ bossPower }: { bossPower: number }) {
  const isWeakened = bossPower < 55

  return (
    <div className="absolute left-[5%] top-[67%] w-[20%] max-w-[112px]">
      <img
        src={isWeakened ? gastoHormigaWeakened : gastoHormigaIdle}
        alt="Gasto Hormiga"
        className="mx-auto w-full drop-shadow-[0_10px_16px_rgba(82,41,24,0.24)]"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
      />
      <div
        className="mx-auto -mt-2 h-2 w-[72%] overflow-hidden rounded-full border bg-[#F8D8CF]"
        style={{ borderColor: 'rgba(138,75,34,0.35)' }}
        aria-label={`Poder del Gasto Hormiga ${bossPower}%`}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400" style={{ width: `${bossPower}%` }} />
      </div>
    </div>
  )
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
            className="h-full w-full object-contain"
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

