import { Sprout, Check } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { MemoryCard } from './data'

interface Props {
  card: MemoryCard
  flipped: boolean
  matched: boolean
  onClick: () => void
}

export function MemoryTile({ card, flipped, matched, onClick }: Props) {
  const reduced = useReducedMotion()
  const shown = flipped || matched

  const innerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: reduced ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: shown ? 'rotateY(180deg)' : 'rotateY(0deg)',
    willChange: 'transform',
  }

  const faceBase: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    textAlign: 'center',
  }

  const frontStyle: React.CSSProperties = {
    ...faceBase,
    background: 'var(--soil-warm, #e8dcc4)',
    border: '1.5px solid var(--clay-soft, #d4c5b0)',
    backgroundImage:
      'repeating-linear-gradient(45deg, color-mix(in srgb, var(--forest-deep) 5%, transparent) 0, color-mix(in srgb, var(--forest-deep) 5%, transparent) 2px, transparent 2px, transparent 12px)',
  }

  const backStyle: React.CSSProperties = {
    ...faceBase,
    transform: 'rotateY(180deg)',
    background: matched
      ? 'color-mix(in srgb, var(--leaf-bright, #4ade80) 15%, transparent)'
      : '#ffffff',
    border: `1.5px solid ${
      matched ? 'var(--leaf-bright, #4ade80)' : 'var(--forest-deep, #1a3a2a)'
    }`,
  }

  const disabled = matched

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={shown ? card.content : 'Carta oculta'}
      style={{
        perspective: '800px',
        width: '100%',
        minHeight: '80px',
        padding: 0,
        background: 'transparent',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        borderRadius: '0.75rem',
      }}
    >
      <div style={innerStyle}>
        <div style={frontStyle} aria-hidden={shown}>
          <Sprout
            size={28}
            strokeWidth={1.75}
            style={{ color: 'var(--forest-deep, #1a3a2a)', opacity: 0.55 }}
          />
        </div>
        <div style={{ ...backStyle, position: 'relative' }} aria-hidden={!shown}>
          <span
            className={card.face === 'name' ? 'font-heading' : undefined}
            style={{
              fontSize: card.face === 'name' ? '0.95rem' : '0.72rem',
              fontWeight: card.face === 'name' ? 700 : 500,
              lineHeight: 1.25,
              color: 'var(--forest-deep, #1a3a2a)',
            }}
          >
            {card.content}
          </span>
          {matched && (
            <Check
              size={14}
              strokeWidth={2.5}
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                color: 'var(--leaf-bright, #4ade80)',
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </button>
  )
}
