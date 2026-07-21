import { useMemo, useState, type ReactNode } from 'react'
import { CASE_BASE, getVisibleCases } from '../../data/cases'
import { useLocale } from '../../i18n'
import { SnakeWindow } from './SnakeGame'

export interface AppApi {
  /** Show a small retro system dialog (replaces blocking alert()). */
  notify: (title: string, text: string) => void
  /** Close this window. */
  close: () => void
}

const SERVICE_ICONS = ['🎮', '🌐', '📱', '🤖'] as const
/** Short 8.3-style names so RU/EN labels never collide in the explorer grid. */
const SERVICE_EXES = [
  'Games.exe',
  'Web.exe',
  'Mobile.exe',
  'AI.exe',
  'CRM.exe',
  'Editors.exe',
] as const
const CASE_ICONS: Record<string, string> = {
  mystic: '🔮',
  parma: '⚖️',
  richmeb: '🛋️',
  'gigant-media': '🪧',
  klz: '🎨',
  'ai-3d': '🧊',
  kids: '⚽',
  superpower: '⚡',
}

function MenuBar({ api, app }: { api: AppApi; app: string }) {
  return (
    <div className="mb-1 flex gap-0 border-b border-gray-400 px-1 pt-1 text-xs">
      {['File', 'Edit', 'View', 'Help'].map((m) => (
        <button
          key={m}
          className="px-3 py-0.5 hover:bg-blue-800 hover:text-white focus-visible:bg-blue-800 focus-visible:text-white"
          onClick={() =>
            api.notify(
              `${m} — ${app}`,
              m === 'Help'
                ? 'Help is on the way. Estimated arrival: 2026.'
                : `The "${m}" menu is feeling shy today.`,
            )
          }
        >
          {m}
        </button>
      ))}
    </div>
  )
}

function AboutWindow({ api }: { api: AppApi }) {
  const { t } = useLocale()
  return (
    <div className="p-4" style={{ fontSize: 13 }}>
      <div className="mb-4 flex items-start gap-4">
        <div style={{ fontSize: 40 }} aria-hidden>
          🏢
        </div>
        <div>
          <div className="text-base font-bold">WEBGIANTS.EXE</div>
          <div className="text-gray-600">Version 98.0.1</div>
          <div className="text-gray-600">© 1998–2026 Web Giants Corp.</div>
        </div>
      </div>
      <div className="win98-panel-inset mb-3 p-3 text-xs leading-relaxed">
        <div className="font-bold">{t.meta.title}</div>
        <div className="mt-2">{t.hero.support}</div>
        <div className="mt-2 text-gray-600">{t.footer.tagline}</div>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-1">
        {t.stack.stats.map((s) => (
          <div key={s.label} className="win98-panel-inset px-2 py-1 text-xs">
            <span className="font-bold">{s.value}</span>
            <span className="text-gray-600"> — {s.label}</span>
          </div>
        ))}
      </div>
      <div className="mb-3 text-xs text-gray-600">
        {t.hero.trust.join(' · ')}
      </div>
      <div className="flex justify-center gap-2">
        <button className="win98-btn" onClick={api.close}>
          OK
        </button>
        <button
          className="win98-btn"
          onClick={() =>
            api.notify('System Info', `${t.meta.description}\n\n${t.contact.location}`)
          }
        >
          System Info...
        </button>
      </div>
    </div>
  )
}

function ServicesWindow({ api }: { api: AppApi }) {
  const { t } = useLocale()
  const [selected, setSelected] = useState<string | null>(null)
  const items = t.services.items.map((item, i) => ({
    ...item,
    icon: SERVICE_ICONS[i] ?? '📁',
    exe: SERVICE_EXES[i] ?? `Svc${item.num}.exe`,
  }))

  const launch = (item: (typeof items)[number]) =>
    api.notify(
      item.exe,
      `${item.title}\n\n${item.promise}\n\n${item.body}\n\n${item.metric}\n[${item.tags.join(', ')}]`,
    )

  return (
    <div style={{ fontSize: 12 }}>
      <MenuBar api={api} app="Services" />
      <div className="mb-2 flex gap-1 border-b border-gray-400 px-2 py-1 text-xs">
        <button
          className="win98-btn !min-w-0 !px-1.5"
          aria-label="Back"
          onClick={() => api.notify('Navigation', 'There is no going back from 1998.')}
        >
          ◄
        </button>
        <button
          className="win98-btn !min-w-0 !px-1.5"
          aria-label="Forward"
          onClick={() => api.notify('Navigation', 'The future is the Exit to 2026 button.')}
        >
          ►
        </button>
        <button
          className="win98-btn !min-w-0 !px-1.5"
          aria-label="Up one level"
          onClick={() => api.notify('Navigation', 'C:\\WEBGIANTS is already the top. It always was.')}
        >
          ↑
        </button>
        <div className="win98-panel-inset min-w-0 flex-1 truncate px-2 py-0.5">
          C:\WEBGIANTS\Services
        </div>
      </div>
      <div className="px-2 pb-1 text-xs leading-snug text-gray-600">{t.services.sub}</div>
      <div className="grid grid-cols-2 gap-1 px-2 pb-2" role="listbox" aria-label="Services">
        {items.map((item) => (
          <button
            key={item.num}
            role="option"
            aria-selected={selected === item.num}
            onClick={() => setSelected(item.num)}
            onDoubleClick={() => launch(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') launch(item)
            }}
            className={`flex min-w-0 cursor-pointer flex-col items-center gap-1 overflow-hidden p-2 text-center ${
              selected === item.num
                ? 'bg-blue-800 text-white'
                : 'hover:bg-blue-100 focus-visible:bg-blue-100'
            }`}
          >
            <div style={{ fontSize: 28 }} aria-hidden>
              {item.icon}
            </div>
            <div className="w-full break-words font-mono text-[11px] leading-tight">{item.exe}</div>
            <div className="w-full break-words text-[10px] leading-snug opacity-80">{item.title}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="win98-panel-inset mx-2 mb-2 px-2 py-1 text-xs leading-snug" role="status">
          {items.find((i) => i.num === selected)?.promise} — Enter / double-click to open.
        </div>
      )}
    </div>
  )
}

function ContactWindow({ api }: { api: AppApi }) {
  const { t } = useLocale()
  const f = t.contact.form
  const [sent, setSent] = useState(false)
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  return (
    <div className="p-4" style={{ fontSize: 12 }}>
      <div className="mb-3 flex items-center gap-3">
        <div style={{ fontSize: 28 }} aria-hidden>
          ✉️
        </div>
        <div>
          <div className="text-sm font-bold">New Message</div>
          <div className="text-xs text-gray-600">
            {t.contact.kicker} · {t.contact.location}
          </div>
        </div>
      </div>
      <div className="win98-panel-inset mb-3 p-2 text-xs leading-relaxed text-gray-700">
        {t.contact.support}
      </div>
      {sent ? (
        <div className="win98-panel p-3 text-center" role="status">
          <div style={{ fontSize: 32 }} aria-hidden>
            📨
          </div>
          <div className="font-bold">{f.sent}</div>
          <div className="mt-1 text-xs text-gray-600">
            {f.successBody.replace('{name}', name || f.successFallbackName)}
          </div>
          <div className="mt-1 text-xs text-gray-600">Transmitted via 56k modem.</div>
          <button className="win98-btn mt-3" onClick={() => setSent(false)}>
            OK
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="w98-to" className="w-14 shrink-0 text-right text-xs">
                To:
              </label>
              <input id="w98-to" value="hello@webgiants.studio" readOnly className="win98-input flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="w98-name" className="w-14 shrink-0 text-right text-xs">
                {f.name}:
              </label>
              <input
                id="w98-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={f.namePlaceholder}
                className="win98-input flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="w98-from" className="w-14 shrink-0 text-right text-xs">
                {f.email}:
              </label>
              <input
                id="w98-from"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={f.emailPlaceholder}
                className="win98-input flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="w98-subj" className="w-14 shrink-0 text-right text-xs">
                Subject:
              </label>
              <input
                id="w98-subj"
                value={`${t.contact.titlePre} ${t.contact.titleAccent}`}
                readOnly
                className="win98-input flex-1"
              />
            </div>
          </div>
          <div className="win98-panel-inset mb-3">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={4}
              aria-label={f.message}
              className="w-full resize-none bg-white p-2 font-mono text-xs outline-none"
              placeholder={f.messagePlaceholder}
            />
          </div>
          <div className="mb-3 space-y-1 text-xs text-gray-600">
            {t.contact.assurances.map((a) => (
              <div key={a.title}>
                <span className="font-bold text-gray-800">{a.title}</span> — {a.body}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="win98-btn"
              onClick={() => {
                if (email && msg) setSent(true)
                else api.notify('Web Giants Mail', `${f.errEmail}\n${f.errName}`)
              }}
            >
              📨 {f.send}
            </button>
            <button
              className="win98-btn"
              onClick={() => {
                setMsg('')
                setEmail('')
                setName('')
              }}
            >
              🗑️ Delete
            </button>
            <button
              className="win98-btn"
              onClick={() =>
                api.notify(
                  'Attach',
                  'Attachment too large for a 56k modem.\nTry the modern site — Exit to 2026.',
                )
              }
            >
              📎 Attach
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">{f.privacy}</div>
        </>
      )}
    </div>
  )
}

function PortfolioWindow({ api }: { api: AppApi }) {
  const { t } = useLocale()
  const cases = useMemo(
    () =>
      getVisibleCases().map((base) => {
        const i = CASE_BASE.findIndex((c) => c.id === base.id)
        return {
          ...base,
          ...t.work.cases[i],
          icon: CASE_ICONS[base.id] ?? '📁',
        }
      }),
    [t],
  )
  const [selected, setSelected] = useState<string | null>(cases[0]?.id ?? null)
  const active = cases.find((c) => c.id === selected) ?? cases[0]

  function openCase(c: (typeof cases)[number]) {
    if (c.kind === 'external' && c.href) {
      window.open(c.href, '_blank', 'noopener,noreferrer')
      return
    }
    api.notify(
      c.name,
      `${t.work.private.badge}\n\n${t.work.private.noticeTitle}\n${t.work.private.noticeBody}\n\n→ #case/${c.id} after Exit to 2026`,
    )
  }

  return (
    <div style={{ fontSize: 12 }}>
      <MenuBar api={api} app="Cases" />
      <div className="mb-1 px-2 text-xs text-gray-600">{t.work.sub}</div>
      <div className="px-2 py-1">
        <div className="win98-panel-inset">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-400 text-left">
                {['Name', 'Category', 'Stack', 'Access'].map((h) => (
                  <th key={h} className="px-2 py-1 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  onDoubleClick={() => openCase(c)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') openCase(c)
                  }}
                  tabIndex={0}
                  className={`cursor-pointer outline-none ${
                    selected === c.id
                      ? 'bg-blue-800 text-white'
                      : i % 2 === 0
                        ? 'bg-white hover:bg-blue-100'
                        : 'bg-gray-100 hover:bg-blue-100'
                  }`}
                >
                  <td className="px-2 py-1">
                    <span aria-hidden>{c.icon}</span> {c.name}
                  </td>
                  <td className="px-2 py-1">{c.category}</td>
                  <td className="px-2 py-1">{c.stack.slice(0, 2).join(', ')}</td>
                  <td className="px-2 py-1">{c.kind === 'external' ? 'Public' : 'Private'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {active && (
          <div className="win98-panel-inset mt-2 p-2 text-xs leading-relaxed" role="region" aria-label={active.name}>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold">
                {active.icon} {active.name}
              </div>
              <button type="button" className="win98-btn !min-w-0 !px-2 !py-0.5 text-xs" onClick={() => openCase(active)}>
                {active.kind === 'external' ? t.work.openExternal : t.work.openPrivate}
              </button>
            </div>
            <div className="mb-1">
              <span className="font-bold">{t.work.problemLabel}: </span>
              {active.problem}
            </div>
            <div className="mb-1">
              <span className="font-bold">{t.work.solutionLabel}: </span>
              {active.solution}
            </div>
            <div className="text-gray-700">→ {active.result}</div>
            <div className="mt-1 text-gray-500">[{active.stack.join(' · ')}]</div>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-600">
          {cases.length} object(s) — {t.work.othersBody}
        </div>
      </div>
    </div>
  )
}

function StudioWindow({ api }: { api: AppApi }) {
  const { t } = useLocale()
  return (
    <div style={{ fontSize: 12 }}>
      <MenuBar api={api} app="Studio" />
      <div className="space-y-3 p-3">
        <div>
          <div className="mb-1 text-sm font-bold">
            {t.process.titlePre} {t.process.titleAccent}
          </div>
          <div className="mb-2 text-xs text-gray-600">{t.process.sub}</div>
          <div className="win98-panel-inset divide-y divide-gray-300">
            {t.process.steps.map((s) => (
              <div key={s.num} className="px-2 py-1.5">
                <div className="font-bold">
                  {s.num}. {s.title}
                </div>
                <div className="text-xs">{s.line}</div>
                <div className="text-xs text-gray-500">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-bold">
            {t.stack.titlePre} {t.stack.titleAccent}
          </div>
          <div className="grid gap-1">
            {t.stack.groups.map((g) => (
              <div key={g.label} className="win98-panel-inset px-2 py-1 text-xs">
                <span className="font-bold">{g.label}: </span>
                {g.items.join(', ')}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" className="win98-btn" onClick={api.close}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

function RecycleWindow({ api }: { api: AppApi }) {
  return (
    <div className="p-4 text-center" style={{ fontSize: 12 }}>
      <div style={{ fontSize: 40 }} aria-hidden>
        🗑️
      </div>
      <div className="mt-2 font-bold">Recycle Bin</div>
      <div className="win98-panel-inset mx-auto mt-3 max-w-56 p-3 text-xs leading-relaxed">
        The Recycle Bin is empty.
        <br />
        We never throw away good ideas.
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <button
          className="win98-btn"
          onClick={() => api.notify('Recycle Bin', 'Nothing to empty. It is a lifestyle.')}
        >
          Empty
        </button>
        <button className="win98-btn" onClick={api.close}>
          Close
        </button>
      </div>
    </div>
  )
}

export interface AppDef {
  id: string
  title: string
  icon: string
  width: number
  render: (api: AppApi) => ReactNode
}

export const APPS: AppDef[] = [
  {
    id: 'about',
    title: 'About Web Giants',
    icon: '🖥️',
    width: 400,
    render: (api) => <AboutWindow api={api} />,
  },
  {
    id: 'services',
    title: 'Services — Web Giants',
    icon: '📁',
    width: 420,
    render: (api) => <ServicesWindow api={api} />,
  },
  {
    id: 'portfolio',
    title: 'Cases — Web Giants',
    icon: '🗂️',
    width: 540,
    render: (api) => <PortfolioWindow api={api} />,
  },
  {
    id: 'studio',
    title: 'Studio — Process & Stack',
    icon: '🏭',
    width: 460,
    render: (api) => <StudioWindow api={api} />,
  },
  {
    id: 'contact',
    title: 'Web Giants Mail',
    icon: '✉️',
    width: 440,
    render: (api) => <ContactWindow api={api} />,
  },
  {
    id: 'snake',
    title: 'Snake — Web Giants Arcade',
    icon: '🐍',
    width: 360,
    render: (api) => <SnakeWindow api={api} />,
  },
  {
    id: 'recycle',
    title: 'Recycle Bin',
    icon: '🗑️',
    width: 320,
    render: (api) => <RecycleWindow api={api} />,
  },
]
