import type { CSSProperties } from 'react'

type LogoVariant = 'wordmark' | 'monogram' | 'symbol' | 'mark' | 'full'
type LogoTone = 'accent' | 'mono'

type Props = {
  variant?: LogoVariant
  /** Mark / monogram edge length in px. */
  size?: number
  className?: string
  tone?: LogoTone
  decorative?: boolean
}

/** Compact WG monogram — brand stamp for favicon / avatar / app. */
export function LogoMonogram({
  size = 28,
  className = '',
  tone = 'accent',
  decorative = false,
}: Omit<Props, 'variant'>) {
  const mono = tone === 'mono'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Web Giants'}
    >
      {!decorative && <title>Web Giants</title>}
      {/* W */}
      <path
        className={mono ? 'fill-current' : 'fill-bone'}
        d="M6 48V14h6.8l4.9 18.6L22.6 14H29.4v34h-6.2V27.8L19.4 46.2h-4.8L10.8 27.8V48H6Z"
      />
      {/* G — geometric open form */}
      <path
        className={mono ? 'fill-current' : 'fill-bone'}
        fillRule="evenodd"
        d="M48.2 31.2c0-7.6-5.4-12.8-12.6-12.8-7.4 0-12.8 5.6-12.8 13s5.4 13 13 13c3.8 0 7-1.3 9.2-3.6l.2-.2-3.6-3.5-.2.2c-1.5 1.5-3.5 2.3-5.8 2.3-4.2 0-7-3.2-7.4-7.4H52.4v-1Zm-12.4-7.4c3.6 0 6 2.6 6.4 6.2H29.6c.5-3.6 2.9-6.2 6.2-6.2Z"
      />
      {/* Lime spur — signature accent */}
      <rect
        x="40"
        y="29.4"
        width="12.5"
        height="3.6"
        rx="0.4"
        className={mono ? 'fill-current' : 'fill-lime'}
      />
    </svg>
  )
}

/**
 * Abstract symbol — portal / structure / scale.
 * Independent of letterforms; pairs with the wordmark system.
 */
export function LogoSymbol({
  size = 28,
  className = '',
  tone = 'accent',
  decorative = false,
}: Omit<Props, 'variant'>) {
  const mono = tone === 'mono'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Web Giants'}
    >
      {!decorative && <title>Web Giants</title>}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="2"
        className={mono ? 'stroke-current' : 'stroke-bone/40'}
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="16"
        y="16"
        width="32"
        height="32"
        rx="1"
        className={mono ? 'stroke-current' : 'stroke-bone/25'}
        strokeWidth="1.25"
        fill="none"
      />
      {/* Twin pillars */}
      <path
        className={mono ? 'fill-current' : 'fill-bone'}
        d="M22 44V20h4v24h-4ZM38 44V20h4v24h-4Z"
      />
      <path className={mono ? 'fill-current' : 'fill-bone'} d="M22 20h20v3.5H22Z" />
      <rect
        x="28.5"
        y="28.5"
        width="7"
        height="7"
        className={mono ? 'fill-current' : 'fill-lime'}
      />
    </svg>
  )
}

/** @deprecated prefer LogoMonogram — kept as alias for existing imports */
export function LogoMark(props: Omit<Props, 'variant'>) {
  return <LogoMonogram {...props} />
}

/** Primary wordmark — tracked uppercase, lime period. */
export function LogoWordmark({
  className = '',
  style,
  tone = 'accent',
}: {
  className?: string
  style?: CSSProperties
  tone?: LogoTone
}) {
  const mono = tone === 'mono'
  return (
    <span
      className={`font-display font-extrabold uppercase tracking-[0.16em] ${
        mono ? 'text-current' : 'text-bone'
      } ${className}`}
      style={{ fontStretch: '105%', lineHeight: 1, ...style }}
    >
      Web&nbsp;Giants
      <span className={mono ? 'text-current' : 'text-lime'}>.</span>
    </span>
  )
}

export function Logo({
  variant = 'full',
  size = 28,
  className = '',
  tone = 'accent',
  decorative = false,
}: Props) {
  if (variant === 'wordmark') {
    return <LogoWordmark className={className} tone={tone} />
  }
  if (variant === 'monogram' || variant === 'mark') {
    return (
      <LogoMonogram size={size} className={className} tone={tone} decorative={decorative} />
    )
  }
  if (variant === 'symbol') {
    return <LogoSymbol size={size} className={className} tone={tone} decorative={decorative} />
  }

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={decorative ? undefined : 'Web Giants'}
    >
      <LogoMonogram size={size} tone={tone} decorative />
      <LogoWordmark
        tone={tone}
        style={{ fontSize: Math.max(11, Math.round(size * 0.42)) }}
      />
    </span>
  )
}
