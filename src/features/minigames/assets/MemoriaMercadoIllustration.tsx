interface Props {
  className?: string
}

/**
 * Illustration: 2x2 grid of memory cards — two face-down with question marks,
 * two face-up showing simple financial shapes (coin, bar chart).
 * Viewbox 200 x 160, brand palette.
 */
export function MemoriaMercadoIllustration({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Cuatro cartas de memoria: dos ocultas y dos reveladas con símbolos financieros"
    >
      <rect x="0" y="0" width="200" height="160" rx="12" fill="#d4c5b0" fillOpacity="0.18" />

      {/* Card 1 — face down (top-left) */}
      <rect x="24" y="24" width="66" height="52" rx="8" fill="#d4c5b0" fillOpacity="0.55" stroke="#1a3a2a" strokeWidth="1.5" />
      <text x="57" y="58" textAnchor="middle" fontFamily="serif" fontSize="26" fontWeight="700" fill="#1a3a2a" fillOpacity="0.7">?</text>

      {/* Card 2 — face up, coin (top-right) */}
      <rect x="110" y="24" width="66" height="52" rx="8" fill="#ffffff" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="143" cy="50" r="13" fill="#4ade80" fillOpacity="0.35" stroke="#1a3a2a" strokeWidth="1.5" />
      <text x="143" y="55" textAnchor="middle" fontFamily="serif" fontSize="14" fontWeight="700" fill="#1a3a2a">$</text>

      {/* Card 3 — face up, bar chart (bottom-left) */}
      <rect x="24" y="84" width="66" height="52" rx="8" fill="#ffffff" stroke="#4ade80" strokeWidth="1.5" />
      <rect x="36" y="118" width="8" height="10" fill="#1a3a2a" fillOpacity="0.55" />
      <rect x="49" y="110" width="8" height="18" fill="#4ade80" fillOpacity="0.75" />
      <rect x="62" y="100" width="8" height="28" fill="#1a3a2a" fillOpacity="0.85" />
      <rect x="75" y="94" width="8" height="34" fill="#4ade80" />

      {/* Card 4 — face down (bottom-right) */}
      <rect x="110" y="84" width="66" height="52" rx="8" fill="#d4c5b0" fillOpacity="0.55" stroke="#1a3a2a" strokeWidth="1.5" />
      <text x="143" y="118" textAnchor="middle" fontFamily="serif" fontSize="26" fontWeight="700" fill="#1a3a2a" fillOpacity="0.7">?</text>

      {/* Connecting match arc between the two face-up cards */}
      <path d="M90 50 Q100 80 90 110" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
