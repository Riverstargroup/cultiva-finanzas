import { useCallback, useEffect, useMemo, useState } from 'react'
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
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'
import gastoHormigaIdle from '@/assets/pixel/optimized/enemy-gasto-hormiga-idle.webp'
import gastoHormigaWeakened from '@/assets/pixel/optimized/enemy-gasto-hormiga-weakened.webp'
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp'
import {
  SENDERO_MODULE_PREVIEWS,
  SENDERO_PHASE_ONE_TITLE,
  type SenderoNode,
  type SenderoModulePreview,
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
  const [demoEventNode, setDemoEventNode] = useState<AdventureNode | null>(null)
  const [claimedNodeIds, setClaimedNodeIds] = useState<string[]>([])
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('cf.demo.claimedSenderoNodes')
      setClaimedNodeIds(raw ? JSON.parse(raw) as string[] : [])
    } catch {
      setClaimedNodeIds([])
    }
  }, [])

  const bossPower = useMemo(() => {
    const masteryDamage = Math.min(28, Math.round(totalMastery * 16))
    const rewardDamage = recentReward?.bossDamage ?? 0
    return Math.max(18, 72 - masteryDamage - rewardDamage)
  }, [recentReward?.bossDamage, totalMastery])

  const activateNode = useCallback((node: AdventureNode) => {
    if (node.status === 'locked' || node.type === 'chest' || node.type === 'home' || node.type === 'boss') {
      setDemoEventNode(node)
      return
    }
    onOpenNode(node)
  }, [onOpenNode])

  const nodes = useMemo<AdventureNode[]>(
    () =>
      senderoProgress.nodes.map((node) => {
        const adventureNode: AdventureNode = {
          ...node,
          reward: claimedNodeIds.includes(node.id)
            ? 'reclamado'
            : node.status === 'boss'
              ? `poder ${bossPower}%`
              : node.reward,
          status: claimedNodeIds.includes(node.id) && node.type === 'chest' ? 'completed' : node.status,
          icon: getNodeIcon(node.type),
        }
        adventureNode.onAction = () => activateNode(adventureNode)
        return adventureNode
      }),
    [activateNode, bossPower, claimedNodeIds, senderoProgress.nodes],
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

  const claimNodeReward = (node: AdventureNode) => {
    const next = Array.from(new Set([...claimedNodeIds, node.id]))
    setClaimedNodeIds(next)
    try {
      window.localStorage.setItem('cf.demo.claimedSenderoNodes', JSON.stringify(next))
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
        <LivingPathMap
          nodes={nodes}
          selectedNode={selectedNode}
          selectedNodeIndex={selectedNodeIndex}
          bossPower={bossPower}
          completedScenarios={senderoProgress.completedScenarios}
          onSelectNode={setSelectedNodeId}
          onActivateNode={activateNode}
        />

        <NodeDetailPanel node={selectedNode} />
        <ModuleBranchPreview />
      </div>

      {demoEventNode && (
        <SenderoDemoEventModal
          node={demoEventNode}
          claimed={claimedNodeIds.includes(demoEventNode.id)}
          onClose={() => setDemoEventNode(null)}
          onClaim={() => claimNodeReward(demoEventNode)}
          onOpenPrimary={() => {
            setDemoEventNode(null)
            onOpenNode(demoEventNode)
          }}
          onOpenReview={() => {
            const reviewNode = nodes.find((node) => node.action === 'review') ?? demoEventNode
            setDemoEventNode(null)
            onOpenNode(reviewNode)
          }}
          onOpenGame={() => {
            const gameNode = nodes.find((node) => node.action === 'game') ?? demoEventNode
            setDemoEventNode(null)
            onOpenNode(gameNode)
          }}
        />
      )}
    </section>
  )
}

// ─── Pixel art path map ───────────────────────────────────────────────────────

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
  const totalNodes = nodes.length
  const progressPct = totalNodes > 1 ? Math.round((selectedNodeIndex / (totalNodes - 1)) * 100) : 0
  const activeNode = nodes.find((n) => n.status === 'next') ?? nodes[0]

  return (
    <div
      className="overflow-hidden"
      style={{
        background: '#F5E6C8',
        border: '3px solid #8B6914',
        borderRadius: 4,
        boxShadow: '4px 4px 0 #5a4010',
      }}
    >
      {/* ── HUD superior pixel art ── */}
      <div
        className="flex items-stretch gap-2 p-3"
        style={{ borderBottom: '2px solid #8B6914' }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-[9px] font-black uppercase"
            style={{ color: '#5a4010', letterSpacing: '0.18em' }}
          >
            SENDERO SEMILLA
          </p>
          <p
            className="font-heading text-base font-black leading-tight"
            style={{ color: '#1b2e1f' }}
          >
            {SENDERO_PHASE_ONE_TITLE}
          </p>
          <div
            className="mt-1.5 h-2 overflow-hidden rounded-sm"
            style={{ background: '#C8B89A' }}
            aria-label={`Progreso ${progressPct}%`}
          >
            <div
              className="h-full rounded-sm transition-all duration-500"
              style={{ background: '#4CAF50', width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 shrink-0 rounded-sm"
          style={{ background: '#E8D5A8', border: '2px solid #8B6914' }}
        >
          <img
            src={coinSprout}
            alt=""
            aria-hidden="true"
            className="w-5 h-5"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="font-black text-sm" style={{ color: '#5a4010' }}>
            {completedScenarios} semillas
          </span>
        </div>
      </div>

      {/* ── Path container: aspect-ratio fijo garantiza alineación ── */}
      <div
        className="relative mx-auto w-full overflow-hidden"
        style={{ maxWidth: 420, aspectRatio: '9/16' }}
      >
        {/* Fondo: cielo + césped */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* Cielo */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: '18%',
              background: 'linear-gradient(180deg, #87CEEB 0%, #b8e0f7 100%)',
            }}
          >
            <div
              className="absolute top-2 rounded-full opacity-95"
              style={{ left: '8%', width: 56, height: 18, background: 'white' }}
            />
            <div
              className="absolute rounded-full opacity-90"
              style={{ left: '14%', top: 4, width: 36, height: 14, background: 'white' }}
            />
            <div
              className="absolute top-3 rounded-full opacity-95"
              style={{ right: '18%', width: 72, height: 18, background: 'white' }}
            />
            <div
              className="absolute rounded-full opacity-80"
              style={{ right: '28%', top: 6, width: 44, height: 14, background: 'white' }}
            />
          </div>

          {/* Césped */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              top: '18%',
              background: 'linear-gradient(180deg, #4a9e3f 0%, #3d8a32 100%)',
            }}
          />

          {/* Textura de pasto — SVG ligero */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 420 747"
            preserveAspectRatio="none"
            focusable="false"
          >
            {Array.from({ length: 28 }).map((_, i) => {
              const x = i * 15 + 6
              const dir = i % 3 === 0 ? -3 : i % 3 === 1 ? 3 : 0
              return (
                <line
                  key={i}
                  x1={x}
                  y1={170}
                  x2={x + dir}
                  y2={148}
                  stroke="#2d6a1a"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
        </div>

        {/* ── Path SVG (adoquines) — viewBox 9×16 = same ratio as container ── */}
        {/*    preserveAspectRatio="none" + matching aspect ratios = no distortion */}
        {/*    SVG coordinate (x, y) maps to (x/9 * 100%, y/16 * 100%) of container */}
        {/*    Node position.x/100*9, position.y/100*16 gives the SVG coords */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 9 16"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Base gris del camino */}
          <path
            d="M4.59,0 C4.59,0.7 4.59,1.3 4.59,2.0 C4.59,2.8 5.8,3.3 5.4,4.08 C5.15,4.7 3.4,5.3 3.6,5.84 C3.72,6.4 5.4,7.1 5.22,7.65 C5.1,8.2 4.1,9.2 4.23,9.65 C4.35,10.1 5.5,11.0 5.22,11.71 C5.0,12.3 4.45,13.5 4.41,14.08 C4.41,14.8 4.41,15.5 4.41,16.5"
            fill="none"
            stroke="#A0A0A0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Borde oscuro para profundidad */}
          <path
            d="M4.59,0 C4.59,0.7 4.59,1.3 4.59,2.0 C4.59,2.8 5.8,3.3 5.4,4.08 C5.15,4.7 3.4,5.3 3.6,5.84 C3.72,6.4 5.4,7.1 5.22,7.65 C5.1,8.2 4.1,9.2 4.23,9.65 C4.35,10.1 5.5,11.0 5.22,11.71 C5.0,12.3 4.45,13.5 4.41,14.08 C4.41,14.8 4.41,15.5 4.41,16.5"
            fill="none"
            stroke="#787878"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="0.6 0.22"
            opacity="0.55"
          />
          {/* Adoquines: líneas transversales simuladas */}
          <path
            d="M4.59,0 C4.59,0.7 4.59,1.3 4.59,2.0 C4.59,2.8 5.8,3.3 5.4,4.08 C5.15,4.7 3.4,5.3 3.6,5.84 C3.72,6.4 5.4,7.1 5.22,7.65 C5.1,8.2 4.1,9.2 4.23,9.65 C4.35,10.1 5.5,11.0 5.22,11.71 C5.0,12.3 4.45,13.5 4.41,14.08 C4.41,14.8 4.41,15.5 4.41,16.5"
            fill="none"
            stroke="#CCCCCC"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeDasharray="1.1 0.35"
            opacity="0.7"
          />
        </svg>

        {/* ── Nodos posicionados con % que coinciden exactamente con el SVG ── */}
        {nodes.map((node) => (
          <PixelNode
            key={node.id}
            node={node}
            selected={selectedNode.id === node.id}
            bossPower={bossPower}
            onSelect={() => {
              onSelectNode(node.id)
              if (node.status !== 'locked') onActivateNode(node)
            }}
          />
        ))}

        {/* ── Nopalito posicionado sobre el nodo activo ── */}
        <motion.img
          src={nopalitoIdle}
          alt="Nopalito"
          className="absolute -translate-x-1/2 pointer-events-none"
          style={{
            left: `${activeNode.position.x}%`,
            top: `calc(${activeNode.position.y}% - 11%)`,
            width: 56,
            height: 56,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 4px 8px rgba(43,79,53,0.35))',
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Info card inferior pixel art retro ── */}
      <div
        className="p-4"
        style={{
          borderTop: '2px solid #8B6914',
          background: '#F5E6C8',
          backgroundImage: `
            radial-gradient(circle at 4px 4px, #8B6914 2px, transparent 2px),
            radial-gradient(circle at calc(100% - 4px) 4px, #8B6914 2px, transparent 2px),
            radial-gradient(circle at 4px calc(100% - 4px), #8B6914 2px, transparent 2px),
            radial-gradient(circle at calc(100% - 4px) calc(100% - 4px), #8B6914 2px, transparent 2px)
          `,
        }}
      >
        <p
          className="text-[9px] font-black uppercase text-center mb-1.5"
          style={{ color: '#8B6914', letterSpacing: '0.18em' }}
        >
          NODO SELECCIONADO
        </p>
        <h3
          className="font-heading text-xl font-black text-center leading-tight"
          style={{ color: '#1b2e1f' }}
        >
          {selectedNode.title}
        </h3>
        <p
          className="text-xs text-center mt-1 leading-relaxed"
          style={{ color: '#5a4010' }}
        >
          {selectedNode.description}
        </p>
        {selectedNode.status !== 'locked' && (
          <button
            type="button"
            onClick={selectedNode.onAction}
            className="mt-3 w-full py-2.5 font-black text-white text-sm rounded-sm transition-transform active:scale-95"
            style={{
              background: '#4CAF50',
              border: '2px solid #2d6a1a',
              boxShadow: '0 3px 0 #1a4010',
            }}
          >
            {selectedNode.actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Pixel node button ────────────────────────────────────────────────────────

function PixelNode({
  node,
  selected,
  bossPower,
  onSelect,
}: {
  node: AdventureNode
  selected: boolean
  bossPower: number
  onSelect: () => void
}) {
  const locked = node.status === 'locked'
  const isNext = node.status === 'next'
  const isBoss = node.type === 'boss'
  const isCompleted = node.status === 'completed'
  const isChest = node.type === 'chest'
  const Icon = node.icon
  const isWeakened = bossPower < 55

  const selectionRing = selected
    ? '0 0 0 3px #FFD700, 0 4px 0 #5a4010'
    : '0 4px 0 #5a4010'

  return (
    <button
      type="button"
      onClick={onSelect}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
      }}
      aria-label={locked ? `${node.title}: bloqueado. ${node.description}` : `Abrir ${node.title}: ${node.description}`}
      data-status={node.status}
      data-type={node.type}
    >
      {locked && !isBoss ? (
        /* Roca verde + candado dorado */
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #6aaa4a, #2d6a1a)',
            boxShadow: selected
              ? '0 0 0 3px #FFD700, 0 4px 0 #1a4010, inset 0 2px 4px rgba(255,255,255,0.2)'
              : '0 4px 0 #1a4010, inset 0 2px 4px rgba(255,255,255,0.2)',
          }}
        >
          <LockKeyhole
            className="w-5 h-5"
            style={{ color: '#FFD700', filter: 'drop-shadow(0 1px 0 #8B6914)' }}
          />
        </div>
      ) : isBoss ? (
        /* Gasto Hormiga — boss node */
        <div className="flex flex-col items-center gap-1">
          <img
            src={isWeakened ? gastoHormigaWeakened : gastoHormigaIdle}
            alt="Gasto Hormiga"
            style={{
              width: 56,
              height: 56,
              imageRendering: 'pixelated',
              filter: selected
                ? 'drop-shadow(0 0 6px #FFD700) drop-shadow(0 4px 8px rgba(82,41,24,0.3))'
                : 'drop-shadow(0 4px 8px rgba(82,41,24,0.3))',
            }}
            draggable={false}
          />
          <div
            className="h-1.5 overflow-hidden rounded-sm"
            style={{
              width: 48,
              border: '1px solid rgba(138,75,34,0.5)',
              background: '#F8D8CF',
            }}
            aria-label={`Poder ${bossPower}%`}
          >
            <div
              className="h-full rounded-sm"
              style={{
                width: `${bossPower}%`,
                background: 'linear-gradient(90deg, #EF4444, #F59E0B)',
              }}
            />
          </div>
        </div>
      ) : isChest ? (
        /* Cofre de semillas */
        <div
          className="relative w-12 h-12 flex items-center justify-center rounded-sm"
          style={{
            background: isCompleted ? '#A0C070' : '#E8B64A',
            border: selected ? '3px solid #FFD700' : '3px solid #8B6914',
            boxShadow: selectionRing,
          }}
        >
          <Sparkles className="w-6 h-6" style={{ color: '#5a3000' }} />
          {isCompleted && (
            <span
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black"
              style={{ background: '#2d6a1a', border: '2px solid #1a4010' }}
            >
              ✓
            </span>
          )}
        </div>
      ) : isCompleted ? (
        /* Nodo completado */
        <div
          className="relative w-12 h-12 flex items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #78C850, #4a8a2a)',
            border: selected ? '3px solid #FFD700' : '3px solid #2d6a1a',
            boxShadow: selected
              ? '0 0 0 2px #FFD700, 0 4px 0 #1a4010'
              : '0 4px 0 #1a4010',
          }}
        >
          <Star className="w-5 h-5 fill-yellow-300 text-yellow-400" />
        </div>
      ) : (
        /* Nodo disponible / siguiente — libro pixel art con bounce */
        <motion.div
          className="relative w-12 h-12 flex items-center justify-center rounded-sm"
          style={{
            background: '#F5DEB3',
            border: selected ? '3px solid #FFD700' : '3px solid #8B6914',
            boxShadow: selectionRing,
          }}
          animate={isNext ? { y: [0, -5, 0] } : undefined}
          transition={isNext ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : undefined}
        >
          <Icon className="w-6 h-6" style={{ color: '#4a2c10' }} />
          {isNext && (
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-black"
              style={{ background: '#E5B84B', border: '2px solid #8B6914' }}
            >
              !
            </span>
          )}
        </motion.div>
      )}
    </button>
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

// ─── Node detail panel (sin cambios) ─────────────────────────────────────────

function NodeDetailPanel({ node }: { node: AdventureNode }) {
  const Icon = node.icon
  const locked = node.status === 'locked'

  return (
    <div
      className="rounded-[22px] border bg-[#FEFBF6]/92 p-4 shadow-[0_14px_34px_rgba(43,79,53,0.12)]"
      style={{ borderColor: 'rgba(212,172,117,0.58)' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(112,181,91,0.16)', color: 'var(--forest-deep)' }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--leaf-muted)' }}
          >
            {node.status === 'boss' ? 'Bloqueo del camino' : 'Siguiente paso'}
          </p>
          <h2
            className="font-heading text-xl font-bold leading-tight"
            style={{ color: 'var(--forest-deep)' }}
          >
            {node.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            {node.description}
          </p>
        </div>
      </div>

      <div
        className="mt-4 flex items-center justify-between gap-3 rounded-2xl px-3 py-2"
        style={{ background: 'rgba(229,184,75,0.14)', color: '#6B4B12' }}
      >
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

// ─── Module branch preview (sin cambios) ─────────────────────────────────────

function ModuleBranchPreview() {
  return (
    <section className="sendero-branch-panel" aria-label="Siguientes rutas del Sendero">
      <div>
        <p className="sendero-branch-kicker">Mapa de crecimiento</p>
        <h2
          className="font-heading text-lg font-bold leading-tight"
          style={{ color: 'var(--forest-deep)' }}
        >
          Despues de Finanzas Basicas eliges tu siguiente ruta.
        </h2>
      </div>
      <div className="mt-3 grid gap-2">
        {SENDERO_MODULE_PREVIEWS.map((module) => (
          <ModuleBranchRow key={module.id} module={module} />
        ))}
      </div>
    </section>
  )
}

function ModuleBranchRow({ module }: { module: SenderoModulePreview }) {
  const label =
    module.status === 'active'
      ? 'Actual'
      : module.status === 'choice'
        ? 'Elegible despues'
        : 'Pronto'

  return (
    <div className="sendero-branch-row" data-tone={module.tone} data-status={module.status}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="sendero-branch-dot" aria-hidden="true" />
          <h3 className="truncate text-sm font-black" style={{ color: 'var(--forest-deep)' }}>
            {module.title}
          </h3>
        </div>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
          {module.description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide sm:inline-flex">
          {label}
        </span>
        <ChevronRight className="h-4 w-4" style={{ color: 'var(--leaf-muted)' }} />
      </div>
    </div>
  )
}

// ─── Demo event modal (sin cambios) ──────────────────────────────────────────

function SenderoDemoEventModal({
  node,
  claimed,
  onClose,
  onClaim,
  onOpenPrimary,
  onOpenReview,
  onOpenGame,
}: {
  node: AdventureNode
  claimed: boolean
  onClose: () => void
  onClaim: () => void
  onOpenPrimary: () => void
  onOpenReview: () => void
  onOpenGame: () => void
}) {
  const Icon = node.icon
  const copy = getDemoEventCopy(node, claimed)

  return (
    <div className="fixed inset-0 z-[230] flex items-end bg-black/42 px-3 pb-3 backdrop-blur-sm md:items-center md:justify-center md:p-6">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sendero-demo-event-title"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="sendero-event-modal w-full max-w-lg overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white/86 shadow-sm"
          style={{ borderColor: 'rgba(212,172,117,0.58)', color: 'var(--forest-deep)' }}
          aria-label="Cerrar evento del Sendero"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4 p-5">
          <div className="sendero-event-token">
            <Icon className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1 pr-8">
            <p className="sendero-branch-kicker">{copy.kicker}</p>
            <h2
              id="sendero-demo-event-title"
              className="font-heading text-2xl font-black leading-tight"
              style={{ color: 'var(--forest-deep)' }}
            >
              {copy.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
              {copy.body}
            </p>
          </div>
        </div>

        <div className="border-t p-4" style={{ borderColor: 'rgba(212,172,117,0.38)' }}>
          <div
            className="rounded-2xl px-3 py-2 text-sm font-bold"
            style={{ background: 'rgba(229,184,75,0.14)', color: '#6B4B12' }}
          >
            Recompensa demo: {copy.reward}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {node.type === 'chest' && (
              <button
                type="button"
                onClick={onClaim}
                disabled={claimed}
                className="sendero-event-primary disabled:opacity-60"
              >
                {claimed ? 'Cofre reclamado' : 'Reclamar cofre'}
              </button>
            )}
            {node.type === 'boss' && (
              <>
                <button type="button" onClick={onOpenGame} className="sendero-event-primary">
                  Entrenar con juego
                </button>
                <button type="button" onClick={onOpenReview} className="sendero-event-secondary">
                  Repasar antes
                </button>
              </>
            )}
            {node.type === 'home' && (
              <>
                <button type="button" onClick={onOpenReview} className="sendero-event-primary">
                  Subir dominio
                </button>
                <button type="button" onClick={onOpenPrimary} className="sendero-event-secondary">
                  Ver ruta
                </button>
              </>
            )}
            {node.status === 'locked' && node.type !== 'home' && (
              <>
                <button type="button" onClick={onOpenPrimary} className="sendero-event-primary">
                  Avanzar requisito
                </button>
                <button type="button" onClick={onOpenReview} className="sendero-event-secondary">
                  Repasar
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function getDemoEventCopy(node: AdventureNode, claimed: boolean) {
  if (node.type === 'chest') {
    return {
      kicker: claimed ? 'Cofre abierto' : 'Cofre de ruta',
      title: claimed ? 'Ya guardaste esta recompensa.' : 'Tu constancia deja semillas extra.',
      body: claimed
        ? 'Este cofre queda marcado para que el demo muestre que las recompensas pueden persistir entre visitas.'
        : 'Los cofres aparecen despues de hitos cortos. Sirven para reforzar el ciclo: aprender, recibir monedas y volver al camino.',
      reward: claimed ? 'monedas reclamadas' : '+25 monedas demo',
    }
  }

  if (node.type === 'boss') {
    return {
      kicker: 'Jefe de fase',
      title: 'El Gasto Hormiga bloquea la salida.',
      body: 'Para derrotarlo, el usuario practica decisiones: juega un reto, repasa conceptos o termina una leccion. El jefe baja poder con cada accion educativa.',
      reward: 'desbloquear siguiente ruta',
    }
  }

  if (node.type === 'home') {
    return {
      kicker: node.status === 'locked' ? 'Casita bloqueada' : 'Casita del jardin',
      title: 'Aqui viviran tus plantamigos.',
      body:
        node.status === 'locked'
          ? 'En el demo, la casita se desbloquea al completar mas semillas. Despues mostrara plantamigo principal, apoyo, nivel y cosmeticos.'
          : 'La casita sera el hogar de Nopalito y los plantamigos desbloqueados durante la aventura.',
      reward: 'coleccion y companeros',
    }
  }

  return {
    kicker: 'Nodo bloqueado',
    title: 'Este paso necesita una semilla previa.',
    body: 'El camino se mantiene lineal para que el usuario sepa que hacer despues, sin perder libertad para repasar y jugar.',
    reward: node.reward,
  }
}

// ─── Plantamigo unlock modal (sin cambios) ────────────────────────────────────

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
        <div
          className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(76,175,80,0.12)' }}
        >
          <img
            src={nopalitoIdle}
            alt={plantamigoName}
            className="h-full w-full object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <div className="mt-4">
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--leaf-muted)' }}
          >
            Nuevo plantamigo encontrado
          </div>
          <h2
            id="plantamigo-unlock-title"
            className="mt-1 font-heading text-2xl font-bold"
            style={{ color: 'var(--forest-deep)' }}
          >
            {plantamigoName} se une a tu jardin
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
            Ayuda a detectar fugas de gasto y hace mas fuerte tu ruta de Control. Sube su nivel
            completando semillas, repasos y retos.
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

// ─── Reward impact banner (sin cambios) ──────────────────────────────────────

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
        <img
          src={coinSprout}
          alt=""
          className="h-10 w-10 shrink-0"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--leaf-muted)' }}
          >
            Impacto en el jardin
          </div>
          <h2 className="font-heading text-lg font-bold" style={{ color: 'var(--forest-deep)' }}>
            {reward.scenarioTitle} debilito al Gasto Hormiga
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--leaf-muted)' }}>
            +{reward.coins} monedas, {reward.score}% de dominio y -{reward.bossDamage}% de poder
            enemigo.
            {reward.unlockedPlantamigo
              ? ` ${reward.unlockedPlantamigo} ya puede acompanarte.`
              : ''}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'rgba(127,29,29,0.12)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${bossPower}%`,
                background: 'linear-gradient(90deg, #EF4444, #F59E0B)',
              }}
            />
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
