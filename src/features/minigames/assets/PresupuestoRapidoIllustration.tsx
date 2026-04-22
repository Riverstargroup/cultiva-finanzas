interface Props {
  className?: string;
}

/**
 * Illustration: a hand sorting coins into three labeled jars
 * (Necesidades, Deseos, Ahorro) with a small leaf accent.
 *
 * Viewbox: 200 × 160. Stroke-based, brand palette.
 */
export function PresupuestoRapidoIllustration({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Una mano clasificando monedas en tres frascos etiquetados: Necesidades, Deseos y Ahorro"
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

      {/* ── Jar 1 — Necesidades (left) ── */}
      {/* Body */}
      <rect
        x="14"
        y="74"
        width="34"
        height="42"
        rx="5"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#d4c5b0"
        fillOpacity="0.35"
        aria-hidden="true"
      />
      {/* Neck */}
      <rect
        x="18"
        y="66"
        width="26"
        height="10"
        rx="3"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#d4c5b0"
        fillOpacity="0.5"
        aria-hidden="true"
      />
      {/* Lid */}
      <rect
        x="15"
        y="62"
        width="32"
        height="6"
        rx="3"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#1a3a2a"
        fillOpacity="0.15"
        aria-hidden="true"
      />
      {/* Coin stack hint inside jar */}
      <circle cx="31" cy="105" r="5" fill="#4ade80" fillOpacity="0.6" aria-hidden="true" />
      <circle cx="31" cy="97" r="5" fill="#4ade80" fillOpacity="0.4" aria-hidden="true" />

      {/* ── Jar 2 — Deseos (center) ── */}
      {/* Body */}
      <rect
        x="83"
        y="68"
        width="34"
        height="48"
        rx="5"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#d4c5b0"
        fillOpacity="0.35"
        aria-hidden="true"
      />
      {/* Neck */}
      <rect
        x="87"
        y="60"
        width="26"
        height="10"
        rx="3"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#d4c5b0"
        fillOpacity="0.5"
        aria-hidden="true"
      />
      {/* Lid */}
      <rect
        x="84"
        y="56"
        width="32"
        height="6"
        rx="3"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#1a3a2a"
        fillOpacity="0.15"
        aria-hidden="true"
      />
      {/* Coin inside */}
      <circle cx="100" cy="104" r="5" fill="#d4c5b0" fillOpacity="0.9" aria-hidden="true" />

      {/* ── Jar 3 — Ahorro (right) ── */}
      {/* Body */}
      <rect
        x="152"
        y="74"
        width="34"
        height="42"
        rx="5"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#d4c5b0"
        fillOpacity="0.35"
        aria-hidden="true"
      />
      {/* Neck */}
      <rect
        x="156"
        y="66"
        width="26"
        height="10"
        rx="3"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#d4c5b0"
        fillOpacity="0.5"
        aria-hidden="true"
      />
      {/* Lid */}
      <rect
        x="153"
        y="62"
        width="32"
        height="6"
        rx="3"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        fill="#1a3a2a"
        fillOpacity="0.15"
        aria-hidden="true"
      />
      {/* Coin stack (tallest — savings grow most) */}
      <circle cx="169" cy="108" r="5" fill="#4ade80" fillOpacity="0.7" aria-hidden="true" />
      <circle cx="169" cy="100" r="5" fill="#4ade80" fillOpacity="0.55" aria-hidden="true" />
      <circle cx="169" cy="92" r="5" fill="#4ade80" fillOpacity="0.4" aria-hidden="true" />

      {/* ── Hand dropping a coin into center jar ── */}
      {/* Palm */}
      <path
        d="M88 52 C88 44 94 38 100 36 C106 38 112 44 112 52"
        stroke="#1a3a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        aria-hidden="true"
      />
      {/* Fingers */}
      <line x1="94" y1="44" x2="92" y2="30" stroke="#1a3a2a" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" />
      <line x1="100" y1="42" x2="100" y2="26" stroke="#1a3a2a" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" />
      <line x1="106" y1="44" x2="108" y2="30" stroke="#1a3a2a" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" />
      {/* Coin falling */}
      <circle
        cx="100"
        cy="56"
        r="4"
        stroke="#4ade80"
        strokeWidth="1.5"
        fill="#4ade80"
        fillOpacity="0.3"
        aria-hidden="true"
      />

      {/* ── Jar label strips (color-coded bands) ── */}
      {/* Jar 1 band — forest deep */}
      <rect x="16" y="84" width="30" height="4" rx="2" fill="#1a3a2a" fillOpacity="0.25" aria-hidden="true" />
      {/* Jar 2 band — clay soft */}
      <rect x="85" y="80" width="30" height="4" rx="2" fill="#d4c5b0" fillOpacity="0.8" aria-hidden="true" />
      {/* Jar 3 band — leaf bright */}
      <rect x="154" y="84" width="30" height="4" rx="2" fill="#4ade80" fillOpacity="0.55" aria-hidden="true" />

      {/* ── Connecting arcs from hand toward outer jars ── */}
      <path
        d="M90 52 Q60 58 45 68"
        stroke="#6b7a6b"
        strokeWidth="1"
        strokeDasharray="3 2"
        strokeLinecap="round"
        fill="none"
        aria-hidden="true"
      />
      <path
        d="M110 52 Q140 58 155 68"
        stroke="#6b7a6b"
        strokeWidth="1"
        strokeDasharray="3 2"
        strokeLinecap="round"
        fill="none"
        aria-hidden="true"
      />

      {/* ── Botanical leaf accent (bottom-left) ── */}
      <path
        d="M8 148 C14 136 26 132 32 140 C22 138 14 144 8 148 Z"
        fill="#4ade80"
        fillOpacity="0.55"
        aria-hidden="true"
      />
      <line
        x1="8"
        y1="148"
        x2="28"
        y2="136"
        stroke="#1a3a2a"
        strokeWidth="1"
        strokeLinecap="round"
        aria-hidden="true"
      />

      {/* ── Small second leaf ── */}
      <path
        d="M12 152 C16 144 24 142 26 148 C20 146 14 150 12 152 Z"
        fill="#4ade80"
        fillOpacity="0.35"
        aria-hidden="true"
      />
    </svg>
  );
}
