interface Props {
  className?: string;
}

/**
 * Illustration: a shopping basket with two price tags —
 * a smaller original price and a larger current price —
 * plus an upward arrow and a small calendar icon indicating years.
 *
 * Viewbox: 200 × 160. Stroke-based, brand palette.
 */
export function InflacionChallengeIllustration({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Una canasta de compras con dos etiquetas de precio: el precio anterior más pequeño y el precio actual más alto, con una flecha hacia arriba mostrando inflación"
    >
      {/* ── Background wash ── */}
      <rect
        x="0"
        y="0"
        width="200"
        height="160"
        rx="12"
        fill="#d4c5b0"
        fillOpacity="0.18"
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════
          SHOPPING BASKET
      ══════════════════════════════════════ */}

      {/* Basket body */}
      <path
        d="M46 88 L50 130 L140 130 L144 88 Z"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#d4c5b0"
        fillOpacity="0.4"
        aria-hidden="true"
      />

      {/* Basket rim */}
      <rect
        x="42"
        y="83"
        width="106"
        height="8"
        rx="4"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#d4c5b0"
        fillOpacity="0.6"
        aria-hidden="true"
      />

      {/* Basket weave lines — vertical */}
      <line x1="68" y1="91" x2="64" y2="129" stroke="#1a3a2a" strokeOpacity="0.18" strokeWidth="1" aria-hidden="true" />
      <line x1="86" y1="91" x2="84" y2="129" stroke="#1a3a2a" strokeOpacity="0.18" strokeWidth="1" aria-hidden="true" />
      <line x1="104" y1="91" x2="104" y2="129" stroke="#1a3a2a" strokeOpacity="0.18" strokeWidth="1" aria-hidden="true" />
      <line x1="122" y1="91" x2="124" y2="129" stroke="#1a3a2a" strokeOpacity="0.18" strokeWidth="1" aria-hidden="true" />

      {/* Basket weave lines — horizontal */}
      <line x1="48" y1="102" x2="142" y2="102" stroke="#1a3a2a" strokeOpacity="0.18" strokeWidth="1" aria-hidden="true" />
      <line x1="47" y1="115" x2="143" y2="115" stroke="#1a3a2a" strokeOpacity="0.18" strokeWidth="1" aria-hidden="true" />

      {/* Basket handle */}
      <path
        d="M68 83 Q95 58 122 83"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        aria-hidden="true"
      />

      {/* Items peeking out of basket */}
      {/* Bread loaf shape */}
      <path
        d="M58 83 C58 74 70 70 74 76 C74 80 68 83 58 83 Z"
        fill="#d4c5b0"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      />
      {/* Small circle item */}
      <circle
        cx="110"
        cy="79"
        r="5"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#4ade80"
        fillOpacity="0.4"
        aria-hidden="true"
      />
      {/* Another item */}
      <path
        d="M120 83 C120 76 130 73 132 78 C132 81 126 83 120 83 Z"
        fill="#4ade80"
        fillOpacity="0.3"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════
          OLD PRICE TAG (smaller, left)
      ══════════════════════════════════════ */}
      {/* Tag body */}
      <rect
        x="14"
        y="34"
        width="50"
        height="32"
        rx="5"
        stroke="#6b7a6b"
        strokeWidth="1.5"
        fill="white"
        fillOpacity="0.75"
        aria-hidden="true"
      />
      {/* Tag hole */}
      <circle cx="22" cy="42" r="3" stroke="#6b7a6b" strokeWidth="1.2" fill="none" aria-hidden="true" />
      {/* Tag string */}
      <line x1="22" y1="39" x2="22" y2="34" stroke="#6b7a6b" strokeWidth="1" strokeLinecap="round" aria-hidden="true" />
      {/* Price line — narrower to signal "cheaper/older" */}
      <rect x="30" y="40" width="26" height="5" rx="2.5" fill="#6b7a6b" fillOpacity="0.35" aria-hidden="true" />
      <rect x="30" y="49" width="18" height="4" rx="2" fill="#6b7a6b" fillOpacity="0.2" aria-hidden="true" />
      {/* Year indicator */}
      <rect x="14" y="60" width="50" height="8" rx="3" fill="#6b7a6b" fillOpacity="0.12" aria-hidden="true" />
      <rect x="18" y="62" width="24" height="3" rx="1.5" fill="#6b7a6b" fillOpacity="0.3" aria-hidden="true" />

      {/* ══════════════════════════════════════
          NEW PRICE TAG (larger, right)
      ══════════════════════════════════════ */}
      {/* Tag body */}
      <rect
        x="136"
        y="18"
        width="60"
        height="40"
        rx="5"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="white"
        fillOpacity="0.85"
        aria-hidden="true"
      />
      {/* Tag hole */}
      <circle cx="146" cy="28" r="3.5" stroke="#1a3a2a" strokeWidth="1.2" fill="none" aria-hidden="true" />
      {/* Tag string */}
      <line x1="146" y1="24" x2="146" y2="18" stroke="#1a3a2a" strokeWidth="1" strokeLinecap="round" aria-hidden="true" />
      {/* Price line — wider to signal "more expensive/current" */}
      <rect x="156" y="24" width="34" height="6" rx="3" fill="#1a3a2a" fillOpacity="0.4" aria-hidden="true" />
      <rect x="156" y="34" width="26" height="5" rx="2.5" fill="#1a3a2a" fillOpacity="0.2" aria-hidden="true" />
      {/* "Hoy" accent band */}
      <rect x="136" y="52" width="60" height="8" rx="3" fill="#4ade80" fillOpacity="0.3" aria-hidden="true" />
      <rect x="140" y="54" width="20" height="3" rx="1.5" fill="#1a3a2a" fillOpacity="0.4" aria-hidden="true" />

      {/* ══════════════════════════════════════
          UPWARD ARROW (center, between tags)
      ══════════════════════════════════════ */}
      <line
        x1="100"
        y1="72"
        x2="100"
        y2="30"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
      />
      {/* Arrow head */}
      <polyline
        points="93,40 100,28 107,40"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════
          CALENDAR ICON (small, bottom center)
      ══════════════════════════════════════ */}
      <rect
        x="82"
        y="136"
        width="36"
        height="20"
        rx="3"
        stroke="#6b7a6b"
        strokeWidth="1.2"
        fill="white"
        fillOpacity="0.6"
        aria-hidden="true"
      />
      {/* Calendar header */}
      <rect x="82" y="136" width="36" height="7" rx="3" fill="#6b7a6b" fillOpacity="0.25" aria-hidden="true" />
      {/* Calendar page hooks */}
      <line x1="89" y1="134" x2="89" y2="139" stroke="#6b7a6b" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true" />
      <line x1="111" y1="134" x2="111" y2="139" stroke="#6b7a6b" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true" />
      {/* Calendar dots (days) */}
      <circle cx="91" cy="149" r="1.5" fill="#6b7a6b" fillOpacity="0.5" aria-hidden="true" />
      <circle cx="100" cy="149" r="1.5" fill="#1a3a2a" fillOpacity="0.6" aria-hidden="true" />
      <circle cx="109" cy="149" r="1.5" fill="#1a3a2a" fillOpacity="0.6" aria-hidden="true" />

      {/* ══════════════════════════════════════
          BOTANICAL LEAF ACCENT (bottom-right)
      ══════════════════════════════════════ */}
      <path
        d="M168 154 C174 142 186 138 190 146 C180 144 172 150 168 154 Z"
        fill="#4ade80"
        fillOpacity="0.55"
        aria-hidden="true"
      />
      <line
        x1="168"
        y1="154"
        x2="187"
        y2="142"
        stroke="#1a3a2a"
        strokeWidth="1"
        strokeLinecap="round"
        aria-hidden="true"
      />

      {/* Small stem */}
      <path
        d="M172 157 C174 149 180 147 180 152 C176 150 172 156 172 157 Z"
        fill="#4ade80"
        fillOpacity="0.35"
        aria-hidden="true"
      />
    </svg>
  );
}
