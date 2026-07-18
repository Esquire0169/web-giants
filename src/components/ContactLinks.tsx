import { getContactChannels, type ContactKind } from '../data/contacts'
import { useLocale } from '../i18n'
import { ContactIcon } from './ContactIcons'

type Variant = 'panel' | 'footer' | 'header' | 'mobile'

type Props = {
  variant?: Variant
  className?: string
  showPreferred?: boolean
  onNavigate?: () => void
}

function labelFor(kind: ContactKind, labels: Record<ContactKind, string>) {
  return labels[kind]
}

export function ContactLinks({
  variant = 'panel',
  className = '',
  showPreferred = variant === 'panel',
  onNavigate,
}: Props) {
  const { t } = useLocale()
  const c = t.contact.channels
  const channels = getContactChannels()
  const labels: Record<ContactKind, string> = {
    telegramChannel: c.telegramChannel,
    telegramAccount: c.telegramAccount,
    phone: c.phone,
    email: c.email,
  }

  if (variant === 'header') {
    const fast = channels.find((ch) => ch.preferred) ?? channels[0]
    const phone = channels.find((ch) => ch.id === 'phone')
    return (
      <div
        className={`hidden items-center gap-5 xl:flex ${className}`}
        aria-label={c.ariaGroup}
      >
        {fast && (
          <a
            href={fast.href}
            target={fast.external ? '_blank' : undefined}
            rel={fast.external ? 'noopener noreferrer' : undefined}
            aria-label={`${c.telegramAccount}: ${fast.value}`}
            className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-fog transition-colors hover:text-lime focus-visible:text-lime"
          >
            <ContactIcon kind="telegramAccount" size="sm" />
            <span className="text-bone transition-colors group-hover:text-lime">{fast.value}</span>
          </a>
        )}
        {phone && (
          <a
            href={phone.href}
            aria-label={`${c.phone}: ${phone.value}`}
            className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-fog transition-colors hover:text-lime focus-visible:text-lime"
          >
            <ContactIcon kind="phone" size="sm" />
            <span className="transition-colors group-hover:text-lime">{phone.value}</span>
          </a>
        )}
      </div>
    )
  }

  if (variant === 'mobile') {
    return (
      <ul className={`space-y-1 ${className}`} aria-label={c.ariaGroup}>
        {channels.map((ch) => (
          <li key={ch.id}>
            <a
              href={ch.href}
              target={ch.external ? '_blank' : undefined}
              rel={ch.external ? 'noopener noreferrer' : undefined}
              onClick={onNavigate}
              className="flex items-center gap-3 border-b border-slate-line/80 py-3 transition-colors hover:border-lime/40 focus-visible:border-lime/50"
            >
              <ContactIcon kind={ch.id} size="md" />
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                  {labelFor(ch.id, labels)}
                  {ch.preferred && showPreferred ? (
                    <span className="ml-2 text-lime">· {c.preferred}</span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-lg text-bone">{ch.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
          {c.kicker}
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2" aria-label={c.ariaGroup}>
          {channels.map((ch) => (
            <li key={ch.id}>
              <a
                href={ch.href}
                target={ch.external ? '_blank' : undefined}
                rel={ch.external ? 'noopener noreferrer' : undefined}
                className="group flex items-start gap-3 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-0"
              >
                <ContactIcon kind={ch.id} size="md" className="mt-0.5" />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] tracking-[0.18em] text-dim uppercase transition-colors group-hover:text-fog">
                    {labelFor(ch.id, labels)}
                  </span>
                  <span className="mt-1 block text-sm text-bone transition-colors group-hover:text-lime">
                    {ch.value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  /* panel — contact section */
  return (
    <div
      className={`rounded-2xl border border-slate-line/80 bg-white/[0.02] p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-line/60 pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
            {c.kicker}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-fog">{c.lead}</p>
        </div>
        <span className="font-mono text-[10px] tracking-[0.16em] text-dim">
          {t.contact.location}
        </span>
      </div>

      <ul className="mt-2 divide-y divide-slate-line/50" aria-label={c.ariaGroup}>
        {channels.map((ch) => (
          <li key={ch.id}>
            <a
              href={ch.href}
              target={ch.external ? '_blank' : undefined}
              rel={ch.external ? 'noopener noreferrer' : undefined}
              className="group flex items-start justify-between gap-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <ContactIcon kind={ch.id} size="md" className="mt-0.5" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                      {labelFor(ch.id, labels)}
                    </span>
                    {ch.preferred && showPreferred ? (
                      <span className="rounded-full border border-lime/35 bg-lime/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-lime uppercase">
                        {c.preferred}
                      </span>
                    ) : null}
                  </div>
                  <span className="mt-1.5 block truncate text-base text-bone transition-colors group-hover:text-lime sm:text-lg">
                    {ch.value}
                  </span>
                </div>
              </div>
              <span
                aria-hidden
                className="mt-1 shrink-0 font-mono text-xs text-dim transition-all group-hover:translate-x-0.5 group-hover:text-lime"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
