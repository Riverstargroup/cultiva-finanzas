// Cosmetic SVG overlay for garden plant characters.
// Each cosmetic snaps to the plant's head using a species-aware anchor.
// Callers position the overlay container at top:0 on the plant container;
// this component handles its own vertical offset based on the species' head.

import { HEAD_TOP_FRACTION } from './sceneHelpers'

export type CosmeticId = 'sombrero' | 'corona' | 'birrete' | 'lentes' | 'bufanda'

interface CosmeticsOverlayProps {
  id: string
  size: number
  species?: string
}

// Offset (in fractions of `size`) applied to each cosmetic relative to the
// plant's head anchor. Positive = further below the anchor.
interface CosmeticOffset {
  readonly dy: number
}
const OFFSETS: Readonly<Record<CosmeticId, CosmeticOffset>> = {
  sombrero: { dy: -0.75 },
  corona:   { dy: -0.72 },
  birrete:  { dy: -0.82 },
  lentes:   { dy: -0.05 },
  bufanda:  { dy: 0.55 },
}

function getAnchorTop(size: number, species: string | undefined): number {
  const frac = species && HEAD_TOP_FRACTION[species] !== undefined ? HEAD_TOP_FRACTION[species] : 0.25
  return frac * size
}

export function CosmeticsOverlay({ id, size = 40, species }: CosmeticsOverlayProps): JSX.Element | null {
  const anchorTop = getAnchorTop(size, species)
  const offset = OFFSETS[id as CosmeticId]
  if (!offset) return null
  const top = anchorTop + offset.dy * size

  const common = {
    position: 'absolute' as const,
    top,
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none' as const,
  }

  if (id === 'sombrero') {
    return (
      <svg width={size} height={size * 0.8} viewBox="0 0 50 40" style={common}>
        <ellipse cx="25" cy="28" rx="22" ry="6" fill="#1B1210" />
        <rect x="15" y="8" width="20" height="22" rx="3" fill="#1B1210" />
        <rect x="14" y="26" width="22" height="3" rx="1" fill="#3D1A14" />
        <path d="M 17 10 Q 19 12 22 11" stroke="#444" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
    )
  }
  if (id === 'corona') {
    return (
      <svg width={size * 1.1} height={size * 0.7} viewBox="0 0 55 34" style={common}>
        <polygon points="4,34 10,14 27,26 44,14 51,34" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
        <circle cx="10" cy="14" r="3" fill="#EF4444" />
        <circle cx="27" cy="24" r="3" fill="#3B82F6" />
        <circle cx="44" cy="14" r="3" fill="#EF4444" />
        <path d="M 4 30 L 51 30" stroke="#D97706" strokeWidth="1.5" />
      </svg>
    )
  }
  if (id === 'birrete') {
    return (
      <svg width={size * 1.1} height={size * 0.8} viewBox="0 0 55 40" style={common}>
        <rect x="10" y="18" width="35" height="5" rx="1.5" fill="#1B3B26" />
        <rect x="18" y="6" width="19" height="14" rx="2" fill="#1B3B26" />
        <line x1="32" y1="10" x2="42" y2="22" stroke="#FCD34D" strokeWidth="1.8" />
        <circle cx="43" cy="23" r="3" fill="#FCD34D" />
      </svg>
    )
  }
  if (id === 'lentes') {
    return (
      <svg width={size * 1.3} height={size * 0.5} viewBox="0 0 65 26" style={common}>
        <circle cx="16" cy="13" r="10" fill="rgba(180,225,255,0.35)" stroke="#5D3136" strokeWidth="2" />
        <circle cx="49" cy="13" r="10" fill="rgba(180,225,255,0.35)" stroke="#5D3136" strokeWidth="2" />
        <line x1="26" y1="13" x2="39" y2="13" stroke="#5D3136" strokeWidth="2" />
        <line x1="4" y1="11" x2="6" y2="13" stroke="#5D3136" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="61" y1="11" x2="59" y2="13" stroke="#5D3136" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'bufanda') {
    return (
      <svg width={size * 1.4} height={size * 0.55} viewBox="0 0 70 28" style={common}>
        <path
          d="M 4 10 Q 35 2 66 10 Q 64 20 35 22 Q 6 20 4 10 Z"
          fill="#A78BFA"
          stroke="#7C3AED"
          strokeWidth="0.9"
        />
        <path d="M 4 10 Q 6 4 14 7 Q 12 14 10 18 Z" fill="#7C3AED" />
        <line x1="18" y1="5" x2="18" y2="20" stroke="#DDD6FE" strokeWidth="0.9" opacity="0.6" />
        <line x1="35" y1="4" x2="35" y2="20" stroke="#DDD6FE" strokeWidth="0.9" opacity="0.6" />
        <line x1="52" y1="5" x2="52" y2="20" stroke="#DDD6FE" strokeWidth="0.9" opacity="0.6" />
      </svg>
    )
  }
  return null
}
