interface Props {
  className?: string
}

/**
 * Illustration: a balance/scale with a coin on the left pan and a piggy
 * bank on the right pan. Brand palette.
 * Viewbox: 200 × 160.
 */
export function AhorraCosechaIllustration({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Una balanza con una moneda de un lado y una alcancía del otro"
    >
      <rect x="0" y="0" width="200" height="160" rx="12" fill="var(--clay-soft)" fillOpacity="0.18" />
      {/* Base + post */}
      <rect x="90" y="130" width="20" height="8" rx="2" fill="var(--forest-deep)" />
      <rect x="97" y="60" width="6" height="72" fill="var(--forest-deep)" />
      {/* Beam */}
      <rect x="40" y="58" width="120" height="5" rx="2" fill="var(--forest-deep)" transform="rotate(-6 100 60)" />
      {/* Left chains */}
      <line x1="52" y1="66" x2="52" y2="86" stroke="var(--forest-deep)" strokeWidth="1.5" />
      {/* Left pan with coin */}
      <ellipse cx="52" cy="92" rx="22" ry="5" fill="var(--forest-deep)" fillOpacity="0.18" stroke="var(--forest-deep)" strokeWidth="1.5" />
      <circle cx="52" cy="84" r="9" fill="var(--leaf-bright)" stroke="var(--forest-deep)" strokeWidth="1.5" />
      <text x="52" y="88" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--forest-deep)">$</text>
      {/* Right chains */}
      <line x1="148" y1="54" x2="148" y2="76" stroke="var(--forest-deep)" strokeWidth="1.5" />
      {/* Right pan with piggy bank */}
      <ellipse cx="148" cy="82" rx="22" ry="5" fill="var(--forest-deep)" fillOpacity="0.18" stroke="var(--forest-deep)" strokeWidth="1.5" />
      <path d="M134 74 q0 -12 14 -12 q14 0 14 12 q4 0 4 4 q0 4 -4 4 q0 8 -8 10 l-1 4 h-4 l-1 -3 h-8 l-1 3 h-4 l-1 -4 q-6 -2 -6 -8 q-2 0 -2 -4 q0 -4 4 -4 z"
        fill="var(--leaf-bright)" stroke="var(--forest-deep)" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="156" cy="72" r="1.2" fill="var(--forest-deep)" />
      <rect x="146" y="64" width="6" height="2" rx="1" fill="var(--forest-deep)" />
      {/* Top cap */}
      <circle cx="100" cy="56" r="4" fill="var(--forest-deep)" />
    </svg>
  )
}
