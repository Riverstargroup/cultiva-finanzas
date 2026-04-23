import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { GardenPlot, SkillDomain } from '../types'
import { GirasolChar } from './sprites/GirasolChar'
import { HelechodChar } from './sprites/HelechodChar'
import { LirioChar } from './sprites/LirioChar'
import { MargaritaChar } from './sprites/MargaritaChar'
import { TomateChar } from './sprites/TomateChar'
import type { PlantCharProps, PlantMood } from './sprites/primitives'
import { CosmeticsOverlay, type CosmeticId } from './CosmeticsOverlay'
import { CosmeticsPicker } from './CosmeticsPicker'
import { WaterDrop, WaterRipple } from './WaterParticles'
import { SceneBackground } from './SceneBackground'
import { GRASS_COLORS, GROUND_COLORS, QUIPS, SKY_COLORS, getTimeOfDay } from './sceneHelpers'
import type { TimeOfDay, Weather } from './sceneHelpers'
import {
  COSMETIC_ITEMS,
  loadEquippedCosmetics,
  loadLocalCoinsOverride,
  loadOwnedCosmetics,
  saveEquippedCosmetics,
  saveLocalCoinsOverride,
  saveOwnedCosmetics,
} from './cosmeticsData'

interface DomainPlantDef {
  readonly domain: SkillDomain
  readonly label: string
  readonly Component: (props: PlantCharProps) => JSX.Element
  readonly leftPct: number
  readonly topPct: number
  readonly size: number
  readonly z: number
}

const DOMAIN_PLANTS: readonly DomainPlantDef[] = [
  { domain: 'control', label: 'Control', Component: GirasolChar, leftPct: 14, topPct: 74, size: 78, z: 11 },
  { domain: 'credito', label: 'Crédito', Component: HelechodChar, leftPct: 62, topPct: 72, size: 78, z: 10 },
  { domain: 'proteccion', label: 'Protección', Component: LirioChar, leftPct: 33, topPct: 92, size: 88, z: 13 },
  { domain: 'crecimiento', label: 'Crecimiento', Component: MargaritaChar, leftPct: 80, topPct: 90, size: 88, z: 12 },
]

interface ExtraSlotDef {
  readonly id: string
  readonly label: string
  readonly leftPct: number
  readonly topPct: number
  readonly cost: number
  readonly Component: ((props: PlantCharProps) => JSX.Element) | null
}

const EXTRA_SLOTS: readonly ExtraSlotDef[] = [
  { id: 'slot_a', label: 'Ahorro', leftPct: 52, topPct: 95, cost: 20, Component: TomateChar },
  { id: 'slot_b', label: 'Emergencia', leftPct: 8, topPct: 94, cost: 40, Component: null },
]

export interface GardenSceneProps {
  plots: readonly GardenPlot[]
  coins: number
  timeOfDay?: TimeOfDay
  weather?: Weather
  showLabels?: boolean
}

interface DropState {
  id: number
  x: string
  y: string
  delay: number
}
interface RippleState {
  id: number
  x: string
  y: string
}

function WateringCanIcon({ active, size = 22 }: { active: boolean; size?: number }): JSX.Element {
  const primary = active ? '#3B82F6' : '#93C5FD'
  const accent = active ? '#1D4ED8' : '#60A5FA'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path
        d="M 4 14 Q 4 22 12 24 L 22 24 Q 28 24 28 18 Q 28 12 22 12 L 14 12 Q 14 6 8 6 Q 4 6 4 10 Z"
        fill={primary}
        stroke={accent}
        strokeWidth="1.5"
      />
      <path d="M 22 12 L 28 8 L 30 6" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d="M 28 18 L 30 20"
        stroke={active ? '#93C5FD' : '#BFDBFE'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {active && (
        <>
          <line x1="22" y1="26" x2="21" y2="31" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="25" y1="26" x2="26" y2="31" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19" y1="26" x2="17" y2="31" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

interface LockedPlotProps {
  label: string
  cost: number
  leftPct: number
  topPct: number
  coins: number
  onUnlock: () => void
}

function LockedPlot({ label, cost, leftPct, topPct, coins, onUnlock }: LockedPlotProps): JSX.Element {
  const canAfford = coins >= cost
  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: canAfford ? 'pointer' : 'default',
        zIndex: 8,
      }}
      onClick={canAfford ? onUnlock : undefined}
    >
      <div
        style={{
          width: 64,
          height: 72,
          background: 'rgba(0,0,0,0.18)',
          border: '2px dashed rgba(255,255,255,0.35)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          backdropFilter: 'blur(1px)',
          transition: 'all 0.2s',
          boxShadow: canAfford ? '0 0 12px rgba(252,211,77,0.4)' : 'none',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="#FEFBF6" strokeWidth="1.6" />
          <path d="M 8 11 V 8 a 4 4 0 0 1 8 0 V 11" stroke="#FEFBF6" strokeWidth="1.6" fill="none" />
        </svg>
        <div
          style={{
            background: canAfford ? '#FCD34D' : 'rgba(255,255,255,0.7)',
            color: '#5D3136',
            fontSize: 9,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 999,
            letterSpacing: '0.05em',
          }}
        >
          {cost}
        </div>
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 9,
          fontFamily: "'IBM Plex Mono', monospace",
          color: 'rgba(255,255,255,0.8)',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </div>
  )
}

function useRainDrops(weather: Weather): readonly { id: number; x: number; delay: number; dur: number }[] {
  return useMemo(
    () =>
      Array.from({ length: weather === 'rain' ? 44 : 0 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.8,
        dur: 0.55 + Math.random() * 0.5,
      })),
    [weather]
  )
}

function useFireflies(timeOfDay: TimeOfDay): readonly { id: number; x: number; y: number; delay: number }[] {
  return useMemo(
    () =>
      Array.from({ length: timeOfDay === 'night' ? 9 : 0 }).map((_, i) => ({
        id: i,
        x: 8 + Math.random() * 84,
        y: 18 + Math.random() * 52,
        delay: Math.random() * 3.5,
      })),
    [timeOfDay]
  )
}

const SCENE_KEYFRAMES = `
@keyframes gs_rain { 0%{transform:translateY(0);opacity:0} 15%{opacity:1} 100%{transform:translateY(120vh);opacity:0.6} }
@keyframes gs_firefly { 0%,100%{opacity:0.15;transform:translate(0,0)} 50%{opacity:1;transform:translate(12px,-9px)} }
@keyframes flutter { 0%,100%{transform:rotate(-3deg) translateY(0)} 50%{transform:rotate(3deg) translateY(-10px)} }
@keyframes flyAcross { 0%{left:-8%} 100%{left:110%} }
@keyframes gs_floatUp { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-28px);opacity:0} }
`

export function GardenScene({
  plots,
  coins,
  timeOfDay,
  weather = 'clear',
  showLabels = false,
}: GardenSceneProps): JSX.Element {
  const effectiveTimeOfDay: TimeOfDay = timeOfDay ?? getTimeOfDay()

  const [speechFor, setSpeechFor] = useState<SkillDomain | null>(null)
  const [wateringMode, setWateringMode] = useState(false)
  const [happyPlants, setHappyPlants] = useState<Partial<Record<SkillDomain, boolean>>>({})
  const [drops, setDrops] = useState<DropState[]>([])
  const [ripples, setRipples] = useState<RippleState[]>([])
  const [equippedCosmetics, setEquippedCosmetics] = useState<Partial<Record<SkillDomain, CosmeticId | null>>>(
    () => loadEquippedCosmetics() as Partial<Record<SkillDomain, CosmeticId | null>>
  )
  const [ownedCosmetics, setOwnedCosmetics] = useState<ReadonlyArray<CosmeticId>>(
    () => loadOwnedCosmetics()
  )
  const [cosmeticsOpenFor, setCosmeticsOpenFor] = useState<SkillDomain | null>(null)
  const [extraSlots, setExtraSlots] = useState(0)
  const [localCoins, setLocalCoins] = useState<number>(() => {
    const override = loadLocalCoinsOverride()
    return override ?? coins
  })
  const dropIdRef = useRef(0)
  const sceneRef = useRef<HTMLDivElement>(null)

  // Persist cosmetic coin/own/equip state across reloads.
  useEffect(() => { saveLocalCoinsOverride(localCoins) }, [localCoins])
  useEffect(() => { saveOwnedCosmetics(ownedCosmetics) }, [ownedCosmetics])
  useEffect(() => {
    const cleaned: Record<string, CosmeticId | undefined> = {}
    for (const [k, v] of Object.entries(equippedCosmetics)) {
      if (v) cleaned[k] = v
    }
    saveEquippedCosmetics(cleaned)
  }, [equippedCosmetics])

  const sky = SKY_COLORS[effectiveTimeOfDay]
  const [grassA] = GRASS_COLORS[effectiveTimeOfDay]
  const [groundA, groundB] = GROUND_COLORS[effectiveTimeOfDay]

  const raindrops = useRainDrops(weather)
  const fireflies = useFireflies(effectiveTimeOfDay)

  // filter plots to only those matching the 4 main domains
  const plotByDomain = useMemo<Partial<Record<SkillDomain, GardenPlot>>>(() => {
    const map: Partial<Record<SkillDomain, GardenPlot>> = {}
    for (const p of plots) map[p.domain] = p
    return map
  }, [plots])

  const handlePlantClick = useCallback(
    (domain: SkillDomain, leftPct: number, topPct: number, e: React.MouseEvent) => {
      e.stopPropagation()
      if (cosmeticsOpenFor) {
        setCosmeticsOpenFor(null)
        return
      }
      if (!wateringMode) {
        setSpeechFor((prev) => (prev === domain ? null : domain))
        return
      }
      const dropX = `${leftPct}%`
      const dropY = `${Math.max(0, topPct - 38)}%`
      const newDrops: DropState[] = Array.from({ length: 7 }).map((_, i) => ({
        id: ++dropIdRef.current,
        x: `calc(${dropX} + ${(i - 3) * 7}px)`,
        y: dropY,
        delay: i * 0.07,
      }))
      setDrops((prev) => [...prev, ...newDrops])
      setTimeout(() => {
        const ripId = ++dropIdRef.current
        const rip: RippleState = { id: ripId, x: `${leftPct}%`, y: `${topPct - 4}%` }
        setRipples((prev) => [...prev, rip])
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripId)), 700)
      }, 500)
      setHappyPlants((prev) => ({ ...prev, [domain]: true }))
      setTimeout(() => {
        setHappyPlants((prev) => {
          const next = { ...prev }
          delete next[domain]
          return next
        })
      }, 2200)
    },
    [wateringMode, cosmeticsOpenFor]
  )

  const handlePlantDoubleClick = useCallback((domain: SkillDomain, e: React.MouseEvent) => {
    e.stopPropagation()
    setCosmeticsOpenFor((prev) => (prev === domain ? null : domain))
    setSpeechFor(null)
  }, [])

  const equipCosmetic = useCallback((domain: SkillDomain, id: CosmeticId | null) => {
    setEquippedCosmetics((prev) => {
      const next: Partial<Record<SkillDomain, CosmeticId | null>> = { ...prev }
      if (id === null) {
        delete next[domain]
      } else {
        // one cosmetic per plant; if the same id is on another plant, it moves.
        for (const k of Object.keys(next) as SkillDomain[]) {
          if (next[k] === id && k !== domain) delete next[k]
        }
        next[domain] = id
      }
      return next
    })
  }, [])

  const buyCosmetic = useCallback(
    (domain: SkillDomain, id: CosmeticId) => {
      const item = COSMETIC_ITEMS.find((c) => c.id === id)
      if (!item) return
      if (ownedCosmetics.includes(id)) {
        equipCosmetic(domain, id)
        return
      }
      if (localCoins < item.price) return
      setLocalCoins((c) => c - item.price)
      setOwnedCosmetics((prev) => (prev.includes(id) ? prev : [...prev, id]))
      equipCosmetic(domain, id)
    },
    [localCoins, ownedCosmetics, equipCosmetic]
  )

  const unlockSlot = useCallback(
    (idx: number, cost: number) => {
      if (localCoins >= cost) {
        setLocalCoins((c) => c - cost)
        setExtraSlots((s) => Math.max(s, idx + 1))
      }
    },
    [localCoins]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <style>{SCENE_KEYFRAMES}</style>
      <WateringToolbar
        wateringMode={wateringMode}
        localCoins={localCoins}
        onToggle={() => {
          setWateringMode((w) => !w)
          setSpeechFor(null)
          setCosmeticsOpenFor(null)
        }}
      />
      <div
        ref={sceneRef}
        onClick={() => {
          setSpeechFor(null)
          setCosmeticsOpenFor(null)
        }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 2.8',
          borderRadius: 8,
          overflow: 'hidden',
          background: sky,
          boxShadow: 'inset 0 0 0 1px rgba(93,49,54,0.15), 0 6px 20px rgba(93,49,54,0.1)',
          cursor: wateringMode ? 'crosshair' : 'default',
        }}
      >
        <SceneBackground
          timeOfDay={effectiveTimeOfDay}
          weather={weather}
          grassA={grassA}
          groundA={groundA}
          groundB={groundB}
        />

        {/* Rain */}
        {weather === 'rain' &&
          raindrops.map((d) => (
            <div
              key={d.id}
              style={{
                position: 'absolute',
                top: -16,
                left: `${d.x}%`,
                width: 1.4,
                height: 11,
                background: 'linear-gradient(180deg, transparent, rgba(200,220,242,0.85))',
                animation: `gs_rain ${d.dur}s linear ${d.delay}s infinite`,
                pointerEvents: 'none',
              }}
            />
          ))}

        {/* Fireflies */}
        {fireflies.map((f) => (
          <div
            key={f.id}
            style={{
              position: 'absolute',
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#FCD34D',
              boxShadow: '0 0 8px 3px rgba(252,211,77,0.85)',
              animation: `gs_firefly 3.2s ease-in-out ${f.delay}s infinite`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Water drops */}
        {drops.map((d) => (
          <WaterDrop
            key={d.id}
            x={d.x}
            y={d.y}
            delay={d.delay}
            onDone={() => setDrops((prev) => prev.filter((p) => p.id !== d.id))}
          />
        ))}

        {/* Ripples */}
        {ripples.map((r) => (
          <WaterRipple
            key={r.id}
            x={r.x}
            y={r.y}
            onDone={() => setRipples((prev) => prev.filter((p) => p.id !== r.id))}
          />
        ))}

        {/* Locked extra slots */}
        {EXTRA_SLOTS.map((slot, idx) => {
          const isUnlocked = extraSlots > idx
          if (isUnlocked && slot.Component) {
            const Comp = slot.Component
            return (
              <div
                key={slot.id}
                style={{
                  position: 'absolute',
                  left: `${slot.leftPct}%`,
                  top: `${slot.topPct}%`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: 9,
                  pointerEvents: 'none',
                }}
              >
                <Comp size={72} mood="idle" />
                {showLabels && <LabelChip label={slot.label} dotColor="#5D3136" />}
              </div>
            )
          }
          if (isUnlocked) return null
          return (
            <LockedPlot
              key={slot.id}
              label={slot.label}
              cost={slot.cost}
              leftPct={slot.leftPct}
              topPct={slot.topPct}
              coins={localCoins}
              onUnlock={() => unlockSlot(idx, slot.cost)}
            />
          )
        })}

        {/* Domain plants */}
        {DOMAIN_PLANTS.map((p) => {
          if (!plotByDomain[p.domain]) return null
          const isHappy = !!happyPlants[p.domain]
          const currentMood: PlantMood = isHappy ? 'happy' : weather === 'rain' ? 'worried' : 'idle'
          const cosmetic = equippedCosmetics[p.domain] ?? null
          const isCosmOpen = cosmeticsOpenFor === p.domain
          const Comp = p.Component
          const dotColor = isHappy ? '#1A9C43' : weather === 'rain' ? '#93C5FD' : '#5D3136'

          return (
            <div
              key={p.domain}
              style={{
                position: 'absolute',
                left: `${p.leftPct}%`,
                top: `${p.topPct}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: isHappy ? 30 : p.z,
                cursor: wateringMode ? 'crosshair' : 'pointer',
                filter: isHappy
                  ? 'drop-shadow(0 0 8px rgba(252,211,77,0.6))'
                  : 'drop-shadow(0 3px 6px rgba(93,49,54,0.18))',
                transition: 'filter 0.22s ease',
              }}
              onClick={(e) => handlePlantClick(p.domain, p.leftPct, p.topPct, e)}
              onDoubleClick={(e) => handlePlantDoubleClick(p.domain, e)}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: -4,
                  transform: 'translateX(-50%)',
                  width: p.size * 0.55,
                  height: 9,
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.28), transparent 70%)',
                  filter: 'blur(2px)',
                  pointerEvents: 'none',
                }}
              />

              {cosmetic && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 5,
                  }}
                >
                  <CosmeticsOverlay id={cosmetic} size={p.size} species={p.domain} />
                </div>
              )}

              <Comp size={p.size} mood={currentMood} />

              {isHappy &&
                [
                  [-12, -8],
                  [12, -6],
                  [0, -14],
                ].map(([dx, dy], i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${dx}px)`,
                      top: dy,
                      fontSize: 10,
                      animation: `gs_floatUp 1.8s ease-out ${i * 0.2}s infinite`,
                      pointerEvents: 'none',
                    }}
                  >
                    <SparkleStar />
                  </div>
                ))}

              {speechFor === p.domain && <SpeechBubble text={QUIPS[p.domain] ?? ''} />}

              {isCosmOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                  <CosmeticsPicker
                    domain={p.domain}
                    label={p.label}
                    equipped={equippedCosmetics[p.domain] ?? null}
                    ownedIds={ownedCosmetics}
                    coins={localCoins}
                    onEquip={(id) => equipCosmetic(p.domain, id)}
                    onBuy={(id) => buyCosmetic(p.domain, id)}
                    onClose={() => setCosmeticsOpenFor(null)}
                  />
                </div>
              )}

              {showLabels && speechFor !== p.domain && !isCosmOpen && (
                <LabelChip label={p.label} dotColor={dotColor} />
              )}
            </div>
          )
        })}

        {/* Night vignette */}
        {effectiveTimeOfDay === 'night' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.42) 100%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Film grain */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.07,
            mixBlendMode: 'soft-light',
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>
    </div>
  )
}

function LabelChip({ label, dotColor }: { label: string; dotColor: string }): JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: -18,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FEFBF6',
        border: '1px solid #5D3136',
        borderRadius: 999,
        padding: '2px 10px 3px',
        fontSize: 8.5,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        color: '#5D3136',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor }} />
      {label}
    </div>
  )
}

function SpeechBubble({ text }: { text: string }): JSX.Element {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translate(-50%, -5px)',
        background: '#FEFBF6',
        border: '1px solid #5D3136',
        borderRadius: 6,
        padding: '7px 11px',
        fontSize: 11,
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#4A2C2A',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        boxShadow: '0 5px 14px rgba(93,49,54,0.18)',
        zIndex: 40,
      }}
    >
      {text}
      <div
        style={{
          position: 'absolute',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: 8,
          height: 8,
          background: '#FEFBF6',
          borderRight: '1px solid #5D3136',
          borderBottom: '1px solid #5D3136',
        }}
      />
    </div>
  )
}

function SparkleStar(): JSX.Element {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M 5 0 L 6 4 L 10 5 L 6 6 L 5 10 L 4 6 L 0 5 L 4 4 Z" fill="#FCD34D" />
    </svg>
  )
}

interface WateringToolbarProps {
  wateringMode: boolean
  localCoins: number
  onToggle: () => void
}

function WateringToolbar({ wateringMode, localCoins, onToggle }: WateringToolbarProps): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 999,
          border: wateringMode ? '1.5px solid #1D4ED8' : '1.5px solid #93C5FD',
          background: wateringMode ? '#EFF6FF' : '#FEFBF6',
          color: wateringMode ? '#1D4ED8' : '#5D3136',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.08em',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: wateringMode ? '0 0 12px rgba(59,130,246,0.3)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        <WateringCanIcon active={wateringMode} size={22} />
        {wateringMode ? 'REGAR · haz clic en planta' : 'REGAR'}
      </button>
      <span
        style={{
          fontSize: 9,
          color: '#A2777A',
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: '0.06em',
        }}
      >
        DOBLE CLIC → cosméticos
      </span>
      <span
        style={{
          marginLeft: 'auto',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          color: '#5D3136',
          fontWeight: 700,
        }}
      >
        {localCoins}
      </span>
    </div>
  )
}
