import { useDroppable } from '@dnd-kit/core'
import type { Zone } from './data'

const ZONE_META: Record<Zone, { label: string; emoji: string; tint: string; ring: string }> = {
  necesidades: { label: 'Necesidades', emoji: '🏠', tint: 'rgba(76,175,80,0.10)', ring: '#3f8a4f' },
  deseos: { label: 'Deseos', emoji: '🎮', tint: 'rgba(168,85,247,0.10)', ring: '#8b5cf6' },
  ahorro: { label: 'Ahorro', emoji: '🐷', tint: 'rgba(244,114,182,0.10)', ring: '#db2777' },
  deudas: { label: 'Deudas', emoji: '💳', tint: 'rgba(239,68,68,0.10)', ring: '#dc2626' },
}

export function Jar({ zone, flash }: { zone: Zone; flash: boolean }) {
  const meta = ZONE_META[zone]
  const { setNodeRef, isOver } = useDroppable({ id: zone })

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: '110px',
        border: `2px ${isOver ? 'solid' : 'dashed'} ${isOver ? meta.ring : 'var(--clay-soft, #d4c5b0)'}`,
        borderRadius: '18px',
        padding: '14px 12px',
        background: isOver || flash ? meta.tint : 'rgba(255,255,255,0.6)',
        transition: 'border-color 0.15s, background 0.2s, transform 0.15s',
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{meta.emoji}</span>
      <span
        className="font-heading"
        style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: 'var(--forest-deep, #1B3B26)',
        }}
      >
        {meta.label}
      </span>
    </div>
  )
}
