import { Mail, Phone } from 'lucide-react'
import { FaTelegram, FaTelegramPlane } from 'react-icons/fa'
import type { ContactKind } from '../data/contacts'

const sizeMap = {
  sm: 15,
  md: 18,
  lg: 20,
} as const

type Size = keyof typeof sizeMap

/**
 * Ready icon sets: Font Awesome (Telegram) + Lucide (mail / phone).
 * Bone → lime on hover via parent `group`.
 */
export function ContactIcon({
  kind,
  size = 'md',
  className = '',
}: {
  kind: ContactKind
  size?: Size
  className?: string
}) {
  const px = sizeMap[size]
  const tone =
    'text-bone transition-colors duration-300 group-hover:text-lime group-focus-visible:text-lime'

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg border border-slate-line/70 bg-white/[0.03] p-1.5 transition-colors duration-300 group-hover:border-lime/40 group-hover:bg-lime/[0.07] ${className}`}
      aria-hidden
    >
      {kind === 'telegramAccount' ? (
        <FaTelegramPlane size={px} className={tone} />
      ) : kind === 'telegramChannel' ? (
        <FaTelegram size={px} className={tone} />
      ) : kind === 'email' ? (
        <Mail size={px} strokeWidth={1.65} className={tone} />
      ) : (
        <Phone size={px} strokeWidth={1.65} className={tone} />
      )}
    </span>
  )
}
