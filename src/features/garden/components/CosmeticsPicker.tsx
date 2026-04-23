import type { CosmeticId } from './CosmeticsOverlay'
import { COSMETIC_ITEMS } from './cosmeticsData'

interface CosmeticsPickerProps {
  domain: string
  label: string
  equipped: CosmeticId | null
  ownedIds: ReadonlyArray<CosmeticId>
  coins: number
  onEquip: (id: CosmeticId | null) => void
  onBuy: (id: CosmeticId) => void
  onClose: () => void
}

function CosmeticThumb({ id }: { id: CosmeticId }): JSX.Element {
  return (
    <svg width={28} height={20} viewBox="0 0 55 40" aria-hidden="true">
      {id === 'sombrero' && (
        <>
          <ellipse cx="27" cy="30" rx="22" ry="6" fill="#1B1210" />
          <rect x="15" y="10" width="24" height="22" rx="3" fill="#1B1210" />
        </>
      )}
      {id === 'corona' && (
        <polygon points="5,38 13,18 27,30 41,18 49,38" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
      )}
      {id === 'birrete' && (
        <>
          <rect x="10" y="20" width="35" height="5" rx="1.5" fill="#1B3B26" />
          <rect x="18" y="8" width="19" height="14" rx="2" fill="#1B3B26" />
          <circle cx="44" cy="27" r="4" fill="#FCD34D" />
        </>
      )}
      {id === 'lentes' && (
        <>
          <circle cx="16" cy="20" r="9" fill="rgba(180,225,255,0.35)" stroke="#5D3136" strokeWidth="2" />
          <circle cx="39" cy="20" r="9" fill="rgba(180,225,255,0.35)" stroke="#5D3136" strokeWidth="2" />
          <line x1="25" y1="20" x2="30" y2="20" stroke="#5D3136" strokeWidth="2" />
        </>
      )}
      {id === 'bufanda' && (
        <path
          d="M 4 18 Q 27 10 50 18 Q 48 26 27 28 Q 6 26 4 18 Z"
          fill="#A78BFA"
          stroke="#7C3AED"
          strokeWidth="1"
        />
      )}
    </svg>
  )
}

export function CosmeticsPicker({
  label,
  equipped,
  ownedIds,
  coins,
  onEquip,
  onBuy,
  onClose,
}: CosmeticsPickerProps): JSX.Element {
  const ownedSet = new Set(ownedIds)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FEFBF6',
        border: '1px solid #5D3136',
        borderRadius: 8,
        padding: 10,
        width: 220,
        boxShadow: '0 8px 24px rgba(93,49,54,0.2)',
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#5D3136',
            fontWeight: 700,
          }}
        >
          COSMÉTICOS — {label}
        </span>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 14,
            color: '#A2777A',
            lineHeight: 1,
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={() => onEquip(null)}
          style={{
            border: equipped === null ? '2px solid #5D3136' : '1px solid #D8BFC0',
            background: equipped === null ? '#F9ECDF' : '#FEFBF6',
            borderRadius: 6,
            padding: '6px 8px',
            cursor: 'pointer',
            fontSize: 10,
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#7D5658',
          }}
        >
          Ninguno
        </button>
        {COSMETIC_ITEMS.map((c) => {
          const owned = ownedSet.has(c.id)
          const isEquipped = equipped === c.id
          const canAfford = coins >= c.price
          return (
            <button
              key={c.id}
              onClick={() => (owned ? onEquip(c.id) : canAfford ? onBuy(c.id) : undefined)}
              disabled={!owned && !canAfford}
              title={owned ? `${c.name} — equipado si haces clic` : `Comprar ${c.name} · ${c.price} 🪙`}
              style={{
                border: isEquipped ? '2px solid #5D3136' : '1px solid #D8BFC0',
                background: isEquipped ? '#F9ECDF' : owned ? '#FEFBF6' : '#F4ECE2',
                borderRadius: 6,
                padding: '5px 7px',
                cursor: owned || canAfford ? 'pointer' : 'not-allowed',
                opacity: !owned && !canAfford ? 0.55 : 1,
                fontSize: 11,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                position: 'relative',
              }}
            >
              <CosmeticThumb id={c.id} />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 8,
                  color: '#7D5658',
                }}
              >
                {c.name}
              </span>
              {!owned && (
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 8,
                    color: canAfford ? '#5D3136' : '#A2777A',
                    fontWeight: 700,
                    marginTop: 1,
                  }}
                >
                  🪙 {c.price}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div
        style={{
          marginTop: 8,
          borderTop: '1px dashed rgba(93,49,54,0.15)',
          paddingTop: 6,
          fontSize: 9,
          color: '#A2777A',
          fontFamily: "'IBM Plex Mono', monospace",
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>DOBLE CLIC → cosméticos</span>
        <span>🪙 {coins}</span>
      </div>
    </div>
  )
}
