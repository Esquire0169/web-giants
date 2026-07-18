type Props = {
  compact?: boolean
  className?: string
  width?: number
}

/**
 * Framed wordmark — WEB / GIANTS / STUDIO.
 * Clean typographic lockup, no character.
 */
export function LogoFramed({ compact = false, className = '', width }: Props) {
  const frameH = compact ? 148 : 164
  const vbH = compact ? 200 : 260
  const vb = `0 0 560 ${vbH}`
  const h = width ? (width * vbH) / 560 : undefined
  const frameBottom = 26 + frameH

  return (
    <svg
      viewBox={vb}
      width={width}
      height={h}
      fill="none"
      className={`overflow-visible ${className}`}
      role="img"
      aria-label="Web Giants Studio"
    >
      <title>Web Giants</title>

      <rect
        x="34"
        y="18"
        width="492"
        height={frameH + 16}
        stroke="#ECEAE4"
        strokeWidth="1"
        opacity="0.28"
      />
      <rect
        x="42"
        y="26"
        width="476"
        height={frameH}
        stroke="#ECEAE4"
        strokeWidth="2.25"
      />

      {/* Lime seal corners */}
      <path d="M42 36V26h10" stroke="#C9F24B" strokeWidth="2" fill="none" />
      <path d="M518 36V26h-10" stroke="#C9F24B" strokeWidth="2" fill="none" />
      <path
        d={`M42 ${frameBottom - 10}v10h10`}
        stroke="#C9F24B"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={`M518 ${frameBottom - 10}v10h-10`}
        stroke="#C9F24B"
        strokeWidth="2"
        fill="none"
      />

      <text
        x="68"
        y="68"
        fill="#ECEAE4"
        style={{
          fontFamily: 'var(--font-display), Archivo, sans-serif',
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: '0.36em',
        }}
      >
        WEB
      </text>

      <text
        x="68"
        y="140"
        fill="#ECEAE4"
        style={{
          fontFamily: 'var(--font-display), Archivo, sans-serif',
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: '0.06em',
        }}
      >
        GIANTS
      </text>

      <text
        x="378"
        y={compact ? 158 : 168}
        fill="#B0B2B8"
        style={{
          fontFamily: 'var(--font-display), Archivo, sans-serif',
          fontSize: 14,
          fontWeight: 550,
          letterSpacing: '0.36em',
        }}
      >
        STUDIO
      </text>

      {!compact && (
        <g>
          <circle cx="98" cy="224" r="2.8" fill="#C9F24B" />
          <text
            x="280"
            y="228"
            textAnchor="middle"
            fill="#8A8D94"
            style={{
              fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.3em',
            }}
          >
            DIGITAL PRODUCTION STUDIO
          </text>
        </g>
      )}
    </svg>
  )
}
