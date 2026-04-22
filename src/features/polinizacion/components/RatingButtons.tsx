interface RatingButtonsProps {
  onRate: (quality: number) => void
  disabled?: boolean
}

const RATINGS = [
  { label: 'No recuerdo', quality: 1, style: { background: '#fee2e2', color: '#dc2626' } },
  { label: 'Difícil', quality: 3, style: { background: '#fef9c3', color: '#ca8a04' } },
  { label: 'Bien', quality: 4, style: { background: '#dcfce7', color: '#16a34a' } },
  { label: 'Fácil', quality: 5, style: { background: '#dbeafe', color: '#2563eb' } },
]

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {RATINGS.map(({ label, quality, style }) => (
        <button
          key={quality}
          onClick={() => onRate(quality)}
          disabled={disabled}
          className="rounded-xl py-2.5 px-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
          style={style}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
