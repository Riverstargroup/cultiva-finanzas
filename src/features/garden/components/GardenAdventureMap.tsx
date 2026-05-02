import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Gamepad2,
  Home,
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
import { Sheet, SheetContent } from '@/components/ui/sheet'
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
import { useStreak } from '@/hooks/useStreak'
import { useUserLevel } from '@/hooks/useUserLevel'

// ─── S-curve path through all node positions (viewBox 420×747) ───────────────
// Node positions (x%, y%) → SVG coords: x/100*420, y/100*747
// first-seed(51,12.5)→(214,93)  presupuesto-rapido(60,25.5)→(252,190)
// flash-review(40,36.5)→(168,273)  seed-chest(58,47.8)→(244,357)
// garden-home(47,60.3)→(197,450)  shop-gate(58,73.2)→(244,547)
// boss-gasto(49,88)→(206,657)
const PATH_D =
  'M214,10 C214,50 214,75 214,93 C214,130 252,155 252,190 C252,228 168,252 168,273 C168,308 244,335 244,357 C244,395 197,428 197,450 C197,488 244,522 244,547 C244,595 206,635 206,657 C206,695 206,735 206,747'

// ─── Pixel panel box-shadow (design file: inset double-border) ───────────────
const PIXEL_PANEL_SHADOW =
  'inset 0 0 0 2px #e4d4a0, inset 0 0 0 4px #f4ecc8, inset 0 0 0 5px #5a3420, 3px 3px 0 rgba(0,0,0,0.28)'

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

// ─── Main component ───────────────────────────────────────────────────────────

export function GardenAdventureMap({
  totalMastery,
  onOpenNode,
}: GardenAdventureMapProps) {
  const { data: streakDays = 0 } = useStreak()
  const { level } = useUserLevel()
  const [recentReward, setRecentReward] = useState<RecentSeedReward | null>(null)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState('first-seed')
  const [demoEventNode, setDemoEventNode] = useState<AdventureNode | null>(null)
  const [claimedNodeIds, setClaimedNodeIds] = useState<string[]>([])
  const [nodeSheetOpen, setNodeSheetOpen] = useState(false)
  const [mapDrawerOpen, setMapDrawerOpen] = useState(false)
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
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('cf.demo.claimedSenderoNodes')
      setClaimedNodeIds(raw ? (JSON.parse(raw) as string[]) : [])
    } catch {
      setClaimedNodeIds([])
    }
  }, [])

  const bossPower = useMemo(() => {
    const masteryDamage = Math.min(28, Math.round(totalMastery * 16))
    const rewardDamage = recentReward?.bossDamage ?? 0
    return Math.max(18, 72 - masteryDamage - rewardDamage)
  }, [recentReward?.bossDamage, totalMastery])

  const activateNode = useCallback(
    (node: AdventureNode) => {
      if (
        node.status === 'locked' ||
        node.type === 'chest' ||
        node.type === 'home' ||
        node.type === 'boss'
      ) {
        setDemoEventNode(node)
        return
      }
      onOpenNode(node)
    },
    [onOpenNode],
  )

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
          status:
            claimedNodeIds.includes(node.id) && node.type === 'chest'
              ? 'completed'
              : node.status,
          icon: getNodeIcon(node.type),
        }
        adventureNode.onAction = () => activateNode(adventureNode)
        return adventureNode
      }),
    [activateNode, bossPower, claimedNodeIds, senderoProgress.nodes],
  )

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? nodes[0]
  const selectedNodeIndex = Math.max(
    0,
    nodes.findIndex((n) => n.id === selectedNode.id),
  )
  const totalNodes = nodes.length
  const progressPct =
    totalNodes > 1
      ? Math.round((selectedNodeIndex / (totalNodes - 1)) * 100)
      : 0
  const activeNode = nodes.find((n) => n.status === 'next') ?? nodes[0]

  const dismissReward = () => {
    setRecentReward(null)
    try {
      window.localStorage.removeItem('cf.recentSeedReward')
    } catch {
      /* ignore */
    }
  }

  const claimNodeReward = (node: AdventureNode) => {
    const next = Array.from(new Set([...claimedNodeIds, node.id]))
    setClaimedNodeIds(next)
    try {
      window.localStorage.setItem(
        'cf.demo.claimedSenderoNodes',
        JSON.stringify(next),
      )
    } catch {
      /* ignore */
    }
  }

  const handleNodeTap = (node: AdventureNode) => {
    setSelectedNodeId(node.id)
    if (
      node.status === 'locked' ||
      node.type === 'chest' ||
      node.type === 'home' ||
      node.type === 'boss'
    ) {
      setDemoEventNode(node)
    } else {
      setNodeSheetOpen(true)
    }
  }

  return (
    <section className="relative w-full" style={{ background: '#0d1f0a' }}>
      {/* ── Modals / banners fuera del canvas ── */}
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

      {/* ── Game map container — aspect ratio fijo garantiza alineación ── */}
      <div
        className="relative mx-auto w-full overflow-hidden"
        style={{ maxWidth: 420, aspectRatio: '9/16' }}
      >
        {/* Sky gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, #7ab8d8 0%, #8ec6e8 10%, #a4d4ec 20%, #c4e2f2 30%, #eef5fa 40%)',
            height: '40%',
          }}
        />

        {/* Sun */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 20,
            right: 28,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 40% 40%, #fff8c8 0%, #f6d058 40%, #e8b038 70%, #c08428 100%)',
            boxShadow: '0 0 14px 4px rgba(248,208,88,0.55)',
          }}
        />

        {/* Clouds */}
        <div aria-hidden="true">
          {[
            { left: '7%', top: 8, w: 58, h: 18 },
            { left: '14%', top: 14, w: 38, h: 13 },
            { right: '16%', top: 7, w: 68, h: 18 },
            { right: '28%', top: 16, w: 42, h: 13 },
          ].map((cloud, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                background: 'white',
                borderRadius: 999,
                opacity: 0.92,
                ...cloud,
              }}
            />
          ))}
        </div>

        {/* Mountain silhouette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '28%',
            left: 0,
            right: 0,
            height: 60,
            background:
              'linear-gradient(180deg, transparent 0%, #2c4a3c 0%)',
            clipPath:
              'polygon(0% 100%, 0% 55%, 5% 30%, 10% 45%, 16% 15%, 22% 42%, 30% 20%, 38% 48%, 45% 10%, 52% 38%, 60% 18%, 68% 40%, 76% 8%, 84% 35%, 92% 20%, 100% 42%, 100% 100%)',
            opacity: 0.72,
          }}
        />

        {/* Grass field */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '38%',
            bottom: 0,
            background:
              'linear-gradient(180deg, #5d8742 0%, #4c7a2a 25%, #3a6020 60%, #2a4818 100%)',
          }}
        />

        {/* Pixel trees — left */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -4,
            top: '32%',
            width: 28,
            height: 56,
          }}
        >
          <PixelTree />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -4,
            bottom: '14%',
            width: 28,
            height: 56,
          }}
        >
          <PixelTree />
        </div>

        {/* Pixel trees — right */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -4,
            top: '36%',
            width: 28,
            height: 56,
          }}
        >
          <PixelTree flip />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -4,
            bottom: '18%',
            width: 28,
            height: 56,
          }}
        >
          <PixelTree flip />
        </div>

        {/* ── Cobblestone path SVG ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 420 747"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Shadow / outer edge */}
          <path
            d={PATH_D}
            stroke="#1a1812"
            strokeWidth="46"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          {/* Dirt base */}
          <path
            d={PATH_D}
            stroke="#5a4830"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Stone surface */}
          <path
            d={PATH_D}
            stroke="#928c7c"
            strokeWidth="30"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Stone joint lines (dark gaps) */}
          <path
            d={PATH_D}
            stroke="#3a3832"
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="16 8"
            opacity="0.6"
          />
          {/* Stone mid-tone */}
          <path
            d={PATH_D}
            stroke="#aca694"
            strokeWidth="24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="14 9"
            strokeDashoffset="4"
            opacity="0.8"
          />
          {/* Stone top highlights */}
          <path
            d={PATH_D}
            stroke="#dcd6c0"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 13"
            strokeDashoffset="8"
            opacity="0.5"
          />
          {/* Moss patches */}
          <path
            d={PATH_D}
            stroke="#3c6a24"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3 22"
            strokeDashoffset="11"
            opacity="0.4"
          />
        </svg>

        {/* ── Grass tufts decorative overlay ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 420 747"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          style={{ pointerEvents: 'none' }}
        >
          {[
            [30, 160], [380, 180], [20, 280], [395, 310], [25, 420],
            [390, 440], [15, 560], [400, 580], [35, 680], [385, 700],
          ].map(([gx, gy], i) => (
            <g key={i} transform={`translate(${gx},${gy})`} opacity="0.7">
              <rect x="3" y="6" width="2" height="5" fill="#2d7a1a" />
              <rect x="1" y="3" width="2" height="8" fill="#3a9922" />
              <rect x="5" y="4" width="2" height="7" fill="#3a9922" />
              <rect x="-1" y="5" width="2" height="5" fill="#2d7a1a" />
              <rect x="7" y="6" width="2" height="4" fill="#2d7a1a" />
            </g>
          ))}
          {/* Flowers scattered */}
          {[
            [50, 200], [340, 220], [60, 380], [355, 400], [45, 520], [370, 540],
          ].map(([fx, fy], i) => (
            <g key={`f${i}`} transform={`translate(${fx},${fy})`} opacity="0.65">
              <rect x="1" y="2" width="2" height="1" fill="#c83820" />
              <rect x="0" y="1" width="1" height="2" fill="#c83820" />
              <rect x="2" y="1" width="1" height="2" fill="#c83820" />
              <rect x="1" y="1" width="2" height="2" fill="#f4cc20" />
            </g>
          ))}
        </svg>

        {/* ── Node buttons ── */}
        {nodes.map((node) => (
          <PixelNode
            key={node.id}
            node={node}
            selected={selectedNode.id === node.id}
            bossPower={bossPower}
            onSelect={() => handleNodeTap(node)}
          />
        ))}

        {/* ── Nopalito floating above active node ── */}
        <motion.img
          src={nopalitoIdle}
          alt="Nopalito"
          className="absolute pointer-events-none"
          style={{
            left: `${activeNode.position.x}%`,
            top: `calc(${activeNode.position.y}% - 13%)`,
            transform: 'translateX(-50%)',
            width: 50,
            height: 50,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 4px 8px rgba(10,30,10,0.45))',
            zIndex: 6,
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
        />

        {/* ── HUD overlay ── */}
        <PixelHUD
          phase={SENDERO_PHASE_ONE_TITLE}
          progress={progressPct}
          streakDays={streakDays}
          level={level}
          completedScenarios={senderoProgress.completedScenarios}
          onOpenMap={() => setMapDrawerOpen(true)}
        />
      </div>

      {/* Reward banner below map */}
      {recentReward && (
        <div className="px-4 pt-3">
          <RewardImpactBanner
            reward={recentReward}
            bossPower={bossPower}
            onDismiss={dismissReward}
          />
        </div>
      )}

      {/* ── Node info Sheet ── */}
      <Sheet open={nodeSheetOpen} onOpenChange={setNodeSheetOpen}>
        <SheetContent
          side="bottom"
          className="p-0 border-0 bg-transparent shadow-none"
          style={{ maxHeight: '55vh' }}
        >
          <PixelNodeCard
            node={selectedNode}
            onClose={() => setNodeSheetOpen(false)}
            onAction={() => {
              setNodeSheetOpen(false)
              selectedNode.onAction?.()
            }}
          />
        </SheetContent>
      </Sheet>

      {/* ── Mapa drawer Sheet ── */}
      <Sheet open={mapDrawerOpen} onOpenChange={setMapDrawerOpen}>
        <SheetContent
          side="bottom"
          className="p-0 border-0 bg-transparent shadow-none"
          style={{ maxHeight: '70vh' }}
        >
          <PixelMapDrawer onClose={() => setMapDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Demo event modal (nodos especiales) ── */}
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
            const reviewNode =
              nodes.find((n) => n.action === 'review') ?? demoEventNode
            setDemoEventNode(null)
            onOpenNode(reviewNode)
          }}
          onOpenGame={() => {
            const gameNode =
              nodes.find((n) => n.action === 'game') ?? demoEventNode
            setDemoEventNode(null)
            onOpenNode(gameNode)
          }}
        />
      )}
    </section>
  )
}

// ─── HUD overlay (top of game canvas) ────────────────────────────────────────

function PixelHUD({
  phase,
  progress,
  streakDays,
  level,
  completedScenarios,
  onOpenMap,
}: {
  phase: string
  progress: number
  streakDays: number
  level: string
  completedScenarios: number
  onOpenMap: () => void
}) {
  const panelStyle: React.CSSProperties = {
    background: '#f4ecc8',
    border: '3px solid #2a1810',
    boxShadow: PIXEL_PANEL_SHADOW,
    imageRendering: 'pixelated',
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        display: 'flex',
        gap: 8,
        zIndex: 10,
      }}
    >
      {/* Left: phase + progress */}
      <div style={{ ...panelStyle, flex: 1, padding: '7px 10px' }}>
        <p
          style={{
            fontSize: 7,
            fontWeight: 900,
            letterSpacing: '0.16em',
            color: '#4a3220',
            textTransform: 'uppercase',
            marginBottom: 2,
          }}
        >
          SENDERO SEMILLA
        </p>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 13,
            fontWeight: 900,
            color: '#1a1a1a',
            lineHeight: 1.1,
            marginBottom: 5,
          }}
        >
          {phase}
        </p>
        {/* Progress bar */}
        <div
          style={{
            height: 8,
            background: '#6b5538',
            border: '2px solid #2a1810',
            boxShadow: 'inset 1px 1px 0 #3a2818',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.max(2, progress)}%`,
              background:
                'linear-gradient(180deg, #86c860 0%, #5aa040 50%, #3e7a28 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
              transition: 'width 0.5s',
            }}
          />
        </div>
      </div>

      {/* Right: streak + level */}
      <div
        style={{
          ...panelStyle,
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          minWidth: 54,
          cursor: 'pointer',
        }}
        role="button"
        tabIndex={0}
        onClick={onOpenMap}
        onKeyDown={(e) => e.key === 'Enter' && onOpenMap()}
        aria-label="Ver mapa de módulos"
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>🔥</span>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 12,
            fontWeight: 900,
            color: '#1a1a1a',
            lineHeight: 1,
          }}
        >
          {streakDays}
        </span>
        <span
          style={{
            fontSize: 7,
            fontWeight: 700,
            color: '#4a3220',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          DÍAS
        </span>
      </div>

      {/* Coin counter */}
      <div
        style={{
          ...panelStyle,
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          minWidth: 44,
        }}
      >
        <img
          src={coinSprout}
          alt=""
          aria-hidden="true"
          style={{ width: 20, height: 20, imageRendering: 'pixelated' }}
        />
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 11,
            fontWeight: 900,
            color: '#1a1a1a',
            lineHeight: 1,
          }}
        >
          {completedScenarios}
        </span>
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
  const isWeakened = bossPower < 55
  const Icon = node.icon

  const selectionGlow = selected
    ? '0 0 0 3px rgba(255,216,64,0.9), 0 0 14px rgba(255,216,64,0.45)'
    : undefined

  return (
    <button
      type="button"
      onClick={onSelect}
      className="absolute active:scale-90 transition-transform"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
      aria-label={
        locked
          ? `${node.title}: bloqueado. ${node.description}`
          : `Abrir ${node.title}: ${node.description}`
      }
      data-status={node.status}
      data-type={node.type}
    >
      <div className="flex flex-col items-center">
        {/* ── Sprite ── */}
        {locked && !isBoss ? (
          /* Gold padlock on green rock */
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 35%, #6aaa4a 0%, #2d6a1a 100%)',
              border: selected ? '3px solid #FFD700' : '2px solid #1a4010',
              boxShadow: selectionGlow ?? '0 4px 0 #1a4010, inset 0 2px 4px rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Padlock body */}
            <div
              style={{
                width: 12,
                height: 13,
                background:
                  'linear-gradient(180deg, #f4c848 0%, #a06820 60%, #6a4010 100%)',
                border: '1.5px solid #1a0e04',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Shackle */}
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: 2,
                  width: 8,
                  height: 7,
                  border: '2px solid #a06820',
                  borderBottom: 'none',
                  borderRadius: '4px 4px 0 0',
                }}
              />
              {/* Keyhole */}
              <div
                style={{
                  width: 3,
                  height: 5,
                  background: '#1a0e04',
                  borderRadius: '2px 2px 1px 1px',
                  marginTop: 2,
                }}
              />
            </div>
          </div>
        ) : isBoss ? (
          /* Gasto Hormiga boss */
          <div className="flex flex-col items-center gap-1">
            <img
              src={isWeakened ? gastoHormigaWeakened : gastoHormigaIdle}
              alt="Gasto Hormiga"
              style={{
                width: 50,
                height: 50,
                imageRendering: 'pixelated',
                filter: selected
                  ? 'drop-shadow(0 0 6px #FFD700) drop-shadow(0 4px 8px rgba(82,41,24,0.35))'
                  : 'drop-shadow(0 4px 8px rgba(82,41,24,0.35))',
              }}
              draggable={false}
            />
            <div
              style={{
                width: 46,
                height: 6,
                background: '#F8D8CF',
                border: '1.5px solid rgba(138,75,34,0.5)',
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${bossPower}%`,
                  background: 'linear-gradient(90deg, #EF4444, #F59E0B)',
                  borderRadius: 2,
                  transition: 'width 0.5s',
                }}
              />
            </div>
          </div>
        ) : isChest ? (
          /* Cofre del sendero */
          <div
            style={{
              width: 32,
              height: 26,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #1a0a02',
              boxShadow: selectionGlow ?? '2px 2px 0 rgba(0,0,0,0.45)',
            }}
          >
            {/* Lid */}
            <div
              style={{
                height: '40%',
                background:
                  'linear-gradient(90deg, #9a5828 0%, #dca838 40%, #fce070 60%, #dca838 80%, #7a4018 100%)',
                borderBottom: '2px solid #1a0a02',
              }}
            />
            {/* Body */}
            <div
              style={{
                flex: 1,
                background:
                  'linear-gradient(180deg, #b87038 0%, #5a2c10 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 35% 35%, #fce070, #a06820)',
                  border: '1px solid #1a0a02',
                }}
              />
            </div>
            {isCompleted && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#2d6a1a',
                  border: '2px solid #1a4010',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  color: '#fff',
                }}
              >
                ✓
              </span>
            )}
          </div>
        ) : isCompleted ? (
          /* Nodo completado — círculo verde con estrella */
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 35%, #78C850 0%, #4a8a2a 100%)',
              border: selected ? '3px solid #FFD700' : '2px solid #2d6a1a',
              boxShadow: selectionGlow ?? '0 4px 0 #1a4010',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Star
              className="fill-yellow-300"
              style={{ width: 14, height: 14, color: '#FFD700' }}
            />
          </div>
        ) : (
          /* Nodo disponible / siguiente — caja con ícono y bounce */
          <motion.div
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              background: '#F5E6C8',
              border: selected ? '3px solid #FFD700' : '2px solid #8B6914',
              boxShadow: selectionGlow ?? '0 4px 0 #5a4010',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            animate={isNext ? { y: [0, -5, 0] } : undefined}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <Icon
              style={{ width: 15, height: 15, color: '#5a3010' }}
            />
          </motion.div>
        )}

        {/* ── Platform pedestal ── */}
        {!isBoss && (
          <div
            style={{
              width: 36,
              height: 14,
              marginTop: 3,
              background:
                'radial-gradient(ellipse at 50% 30%, #dca838 0%, #8a5818 60%, #5a3010 100%)',
              border: '2px solid #2a1810',
              borderRadius: '50%',
              boxShadow: '0 3px 0 #1a0e04',
            }}
          />
        )}

        {/* ── Glow ring when selected ── */}
        {selected && (
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 54,
              height: 54,
              border: '3px solid rgba(255,248,220,0.82)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
            animate={{
              scale: [1, 1.38, 1],
              opacity: [0.9, 0, 0.9],
            }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            initial={{ x: '-50%', y: '-50%' }}
          />
        )}
      </div>
    </button>
  )
}

// ─── Pixel tree decoration ────────────────────────────────────────────────────

function PixelTree({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 28 56"
      width="28"
      height="56"
      style={{
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
      aria-hidden="true"
    >
      {/* Foliage layers */}
      <rect x="8" y="0" width="12" height="2" fill="#1a3010" />
      <rect x="5" y="2" width="18" height="3" fill="#284a18" />
      <rect x="3" y="5" width="22" height="4" fill="#3c6a24" />
      <rect x="2" y="9" width="24" height="4" fill="#508a32" />
      <rect x="3" y="13" width="22" height="4" fill="#68a840" />
      <rect x="5" y="17" width="18" height="3" fill="#508a32" />
      <rect x="7" y="20" width="14" height="3" fill="#3c6a24" />
      {/* Trunk */}
      <rect x="10" y="23" width="8" height="14" fill="#4a2c14" />
      <rect x="11" y="23" width="4" height="14" fill="#6a3e1e" />
      <rect x="12" y="23" width="2" height="14" fill="#8a5828" />
      {/* Roots */}
      <rect x="6" y="36" width="16" height="3" fill="#3a2208" />
      {/* Highlights */}
      <rect x="3" y="5" width="4" height="4" fill="#84c454" opacity="0.5" />
      <rect x="19" y="9" width="3" height="3" fill="#84c454" opacity="0.35" />
      {/* Berries */}
      <rect x="16" y="14" width="2" height="2" fill="#c83820" />
      <rect x="8" y="11" width="2" height="2" fill="#c83820" opacity="0.7" />
    </svg>
  )
}

// ─── Node info Sheet content ──────────────────────────────────────────────────

function PixelNodeCard({
  node,
  onClose,
  onAction,
}: {
  node: AdventureNode
  onClose: () => void
  onAction: () => void
}) {
  const locked = node.status === 'locked'

  return (
    <div
      style={{
        margin: '0 10px 12px',
        background: '#f4ecc8',
        border: '4px solid #2a1810',
        boxShadow: PIXEL_PANEL_SHADOW,
        padding: '18px 20px 20px',
        position: 'relative',
        imageRendering: 'pixelated',
      }}
    >
      {/* Corner ornaments */}
      {[
        { top: 8, left: 8, borderRight: 'none', borderBottom: 'none' },
        { top: 8, right: 8, borderLeft: 'none', borderBottom: 'none' },
        { bottom: 8, left: 8, borderRight: 'none', borderTop: 'none' },
        { bottom: 8, right: 8, borderLeft: 'none', borderTop: 'none' },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 16,
            height: 16,
            border: '2px solid #5a3420',
            pointerEvents: 'none',
            ...style,
          }}
        />
      ))}

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 28,
          height: 28,
          background: '#8b5a30',
          border: '2px solid #2a1810',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
          color: '#fff8dc',
        }}
        aria-label="Cerrar"
      >
        <X style={{ width: 14, height: 14 }} />
      </button>

      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 8,
          letterSpacing: '0.18em',
          color: '#6a4a28',
          textAlign: 'center',
          marginBottom: 6,
          textTransform: 'uppercase',
          paddingRight: 28,
        }}
      >
        {locked ? 'NODO BLOQUEADO' : 'NODO SELECCIONADO'}
      </p>

      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 16,
          fontWeight: 900,
          color: '#1a1a1a',
          textAlign: 'center',
          marginBottom: 6,
          lineHeight: 1.2,
        }}
      >
        {node.title}
      </h2>

      <p
        style={{
          fontSize: 15,
          color: '#2a2018',
          textAlign: 'center',
          lineHeight: 1.4,
          marginBottom: locked ? 0 : 14,
          maxWidth: '34ch',
          margin: '0 auto',
        }}
      >
        {node.description}
      </p>

      {!locked && (
        <button
          type="button"
          onClick={onAction}
          style={{
            display: 'block',
            width: '100%',
            marginTop: 14,
            fontFamily: 'var(--font-heading)',
            fontSize: 10,
            fontWeight: 900,
            background: '#3e7a28',
            color: '#fff8dc',
            border: '3px solid #1f4a1c',
            padding: '10px 20px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow:
              'inset 0 0 0 2px #5aa040, inset 0 -3px 0 #2a5018, 3px 3px 0 rgba(0,0,0,0.4)',
          }}
        >
          {node.actionLabel}
        </button>
      )}

      {/* Reward tag */}
      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontSize: 11,
          color: '#5a4010',
          fontWeight: 700,
        }}
      >
        Recompensa: {node.reward}
      </div>
    </div>
  )
}

// ─── Map drawer (módulos del sendero) ────────────────────────────────────────

function PixelMapDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        margin: '0 10px 12px',
        background: '#f4ecc8',
        border: '4px solid #2a1810',
        boxShadow: PIXEL_PANEL_SHADOW,
        padding: '16px 20px 20px',
        position: 'relative',
        maxHeight: '68vh',
        overflowY: 'auto',
      }}
    >
      {/* Corner ornaments */}
      {[
        { top: 8, left: 8, borderRight: 'none', borderBottom: 'none' },
        { top: 8, right: 8, borderLeft: 'none', borderBottom: 'none' },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 16,
            height: 16,
            border: '2px solid #5a3420',
            pointerEvents: 'none',
            ...style,
          }}
        />
      ))}

      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 28,
          height: 28,
          background: '#8b5a30',
          border: '2px solid #2a1810',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
          color: '#fff8dc',
        }}
        aria-label="Cerrar mapa"
      >
        <X style={{ width: 14, height: 14 }} />
      </button>

      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 8,
          letterSpacing: '0.18em',
          color: '#6a4a28',
          marginBottom: 6,
          textTransform: 'uppercase',
          paddingRight: 32,
        }}
      >
        MAPA DE CRECIMIENTO
      </p>
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 15,
          fontWeight: 900,
          color: '#1a1a1a',
          marginBottom: 14,
          lineHeight: 1.2,
        }}
      >
        Despues de Finanzas Basicas, elige tu ruta.
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SENDERO_MODULE_PREVIEWS.map((mod) => (
          <ModuleRow key={mod.id} module={mod} />
        ))}
      </div>
    </div>
  )
}

function ModuleRow({ module }: { module: SenderoModulePreview }) {
  const isActive = module.status === 'active'
  const isChoice = module.status === 'choice'
  const label = isActive ? 'ACTUAL' : isChoice ? 'ELEGIBLE' : 'PRONTO'

  return (
    <div
      style={{
        padding: '10px 12px',
        background: isActive ? '#e8f0d8' : '#ede4c4',
        border: `2px solid ${isActive ? '#3c6a24' : '#8b6a40'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: isActive
            ? '#3e7a28'
            : isChoice
              ? '#8b5a30'
              : '#6b5538',
          border: '2px solid #2a1810',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 10,
            fontWeight: 900,
            color: '#1a1a1a',
          }}
        >
          {module.title}
        </p>
        <p
          style={{ fontSize: 12, color: '#4a3220', lineHeight: 1.3, marginTop: 2 }}
        >
          {module.description}
        </p>
      </div>
      <span
        style={{
          fontSize: 7,
          fontWeight: 900,
          color: isActive ? '#3e7a28' : '#6b5538',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <ChevronRight style={{ width: 14, height: 14, color: '#8b6a40', flexShrink: 0 }} />
    </div>
  )
}

// ─── getNodeIcon ──────────────────────────────────────────────────────────────

function getNodeIcon(type: SenderoNode['type']): LucideIcon {
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

// ─── Demo event modal ─────────────────────────────────────────────────────────

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
      title: claimed
        ? 'Ya guardaste esta recompensa.'
        : 'Tu constancia deja semillas extra.',
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

// ─── Plantamigo unlock modal ──────────────────────────────────────────────────

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

// ─── Reward impact banner ─────────────────────────────────────────────────────

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
        background:
          'linear-gradient(135deg, rgba(254,251,246,0.98), rgba(229,184,75,0.18))',
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
          <div
            className="mt-3 h-2 overflow-hidden rounded-full"
            style={{ background: 'rgba(127,29,29,0.12)' }}
          >
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
