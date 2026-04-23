interface Props {
  className?: string
}

/**
 * Illustration: a credit card with a small sprout growing from its top edge.
 * Viewbox 200x160. Uses brand palette.
 */
export function SemillasCreditoIllustration({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Una tarjeta de crédito con un brote creciendo de su borde superior"
    >
      <rect x="0" y="0" width="200" height="160" rx="12" fill="#d4c5b0" fillOpacity="0.18" />
      {/* Card body */}
      <rect
        x="40"
        y="70"
        width="120"
        height="74"
        rx="9"
        fill="#1a3a2a"
        stroke="#1a3a2a"
        strokeWidth="1.5"
      />
      {/* Magnetic stripe */}
      <rect x="40" y="82" width="120" height="10" fill="#0f2319" />
      {/* Chip */}
      <rect
        x="54"
        y="104"
        width="18"
        height="14"
        rx="2"
        fill="#d4c5b0"
        stroke="#d4c5b0"
        strokeOpacity="0.8"
      />
      <line x1="58" y1="104" x2="58" y2="118" stroke="#1a3a2a" strokeOpacity="0.4" />
      <line x1="68" y1="104" x2="68" y2="118" stroke="#1a3a2a" strokeOpacity="0.4" />
      {/* Card number hint */}
      <rect x="82" y="108" width="60" height="3" rx="1.5" fill="#d4c5b0" fillOpacity="0.7" />
      <rect x="54" y="128" width="42" height="3" rx="1.5" fill="#d4c5b0" fillOpacity="0.45" />
      <rect x="104" y="128" width="38" height="3" rx="1.5" fill="#d4c5b0" fillOpacity="0.45" />

      {/* Sprout stem */}
      <path
        d="M100 70 C100 58 100 50 100 38"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left leaf */}
      <path
        d="M100 52 C90 50 82 42 84 34 C92 36 100 42 100 52 Z"
        fill="#4ade80"
        fillOpacity="0.75"
        stroke="#1a3a2a"
        strokeWidth="1"
      />
      {/* Right leaf */}
      <path
        d="M100 44 C110 42 118 34 116 26 C108 28 100 34 100 44 Z"
        fill="#4ade80"
        fillOpacity="0.9"
        stroke="#1a3a2a"
        strokeWidth="1"
      />
      {/* Soil line under card */}
      <path
        d="M34 148 Q100 156 166 148"
        stroke="#1a3a2a"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.5"
      />
    </svg>
  )
}
