/** Studio contact channels — override via VITE_* env when needed. */

function env(key: string, fallback: string) {
  const v = import.meta.env[key] as string | undefined
  return v?.trim() || fallback
}

const tgChannel = env('VITE_TG_CHANNEL', 'webgiants')
const tgAccount = env('VITE_TG_ACCOUNT', 'webgiants_hello')
const phoneE164 = env('VITE_CONTACT_PHONE', '+74951204567')
const phoneDisplay = env('VITE_CONTACT_PHONE_DISPLAY', '+7 (495) 120-45-67')
const email = env('VITE_CONTACT_EMAIL', 'hello@webgiants.studio')

export type ContactKind = 'telegramChannel' | 'telegramAccount' | 'phone' | 'email'

export interface ContactChannel {
  id: ContactKind
  /** Visible value (handle, number, address) */
  value: string
  href: string
  /** Mark as preferred / fastest reply */
  preferred?: boolean
  external?: boolean
}

export const STUDIO_CONTACTS = {
  email,
  phoneDisplay,
  phoneE164,
  telegramChannel: tgChannel,
  telegramAccount: tgAccount,
  locationKey: 'location' as const,
} as const

export function getContactChannels(): ContactChannel[] {
  return [
    {
      id: 'telegramAccount',
      value: `@${tgAccount}`,
      href: `https://t.me/${tgAccount}`,
      preferred: true,
      external: true,
    },
    {
      id: 'telegramChannel',
      value: `@${tgChannel}`,
      href: `https://t.me/${tgChannel}`,
      external: true,
    },
    {
      id: 'phone',
      value: phoneDisplay,
      href: `tel:${phoneE164.replace(/[^\d+]/g, '')}`,
    },
    {
      id: 'email',
      value: email,
      href: `mailto:${email}`,
    },
  ]
}
