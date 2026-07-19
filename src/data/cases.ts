import { asset } from '../lib/asset'

export type CaseKind = 'external' | 'private'
export type CaseStatus = 'live' | 'wip'
export type CaseEta = '7d' | '1m' | '2m' | '6m'

export interface CaseBase {
  id: string
  name: string
  image: string
  stack: string[]
  accent: string
  /** Approximate engagement floor, e.g. "$5k" */
  priceFrom: string
  status: CaseStatus
  eta?: CaseEta
  featured?: boolean
  kind: CaseKind
  /** External URL for public cases */
  href?: string
  /** Gallery for private case pages */
  gallery?: string[]
  /**
   * Temporarily hide from Work / easter / deep links.
   * RESTORE: set `hidden: false` (or remove the flag) on richmeb when asked.
   */
  hidden?: boolean
}

export const CASE_BASE: CaseBase[] = [
  {
    id: 'mystic',
    name: 'MYSTIC',
    image: asset('cases/mystic.jpg'),
    stack: ['React', 'TypeScript', 'AI'],
    priceFrom: '$5k',
    status: 'live',
    featured: true,
    accent: '#eab308',
    kind: 'external',
    href: 'https://t.me/mysticf_bot',
  },
  {
    id: 'parma',
    name: 'PARMA',
    image: asset('cases/parma.jpg'),
    stack: ['React', 'Vite', 'Tailwind'],
    priceFrom: '$4k',
    status: 'live',
    accent: '#d4d4d8',
    kind: 'external',
    href: 'https://ubparma.ru/',
  },
  {
    id: 'richmeb',
    name: 'RICHMEB',
    image: asset('cases/richmeb-site.jpg'),
    stack: ['React', 'Three.js', 'WebGL'],
    priceFrom: '$12k',
    status: 'live',
    accent: '#c4a574',
    kind: 'external',
    href: 'https://richmeb.com',
    // TEMP hidden — restore when user asks (remove `hidden: true`)
    hidden: true,
    gallery: [
      asset('cases/richmeb-site.jpg'),
      asset('cases/richmeb-configurator.jpg'),
      asset('cases/richmeb-play.jpg'),
      asset('cases/richmeb-hero.jpg'),
      asset('cases/richmeb-plan.jpg'),
      asset('cases/richmeb-modules.jpg'),
    ],
  },
  {
    id: 'ai-3d',
    name: 'AI 3D SANDBOX',
    image: asset('cases/ai-3d.jpg'),
    stack: ['Next.js', 'Three.js', 'R3F'],
    priceFrom: '$15k',
    status: 'wip',
    eta: '6m',
    accent: '#57d7ff',
    kind: 'private',
    gallery: [
      asset('cases/ai-3d.jpg'),
      asset('cases/ai-3d-plan.jpg'),
      asset('cases/ai-3d-modules.jpg'),
    ],
  },
  {
    id: 'kids',
    name: 'SPORTKIDS',
    image: asset('cases/sportkids.jpg'),
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    priceFrom: '$20k',
    status: 'wip',
    eta: '1m',
    accent: '#2dd4bf',
    kind: 'private',
    gallery: [asset('cases/sportkids.jpg'), asset('cases/sportkids-ops.jpg')],
  },
  {
    id: 'superpower',
    name: 'SUPERPOWER',
    image: asset('cases/superpower.jpg'),
    stack: ['React', 'Zustand', 'Recharts'],
    priceFrom: '$12k',
    status: 'wip',
    eta: '2m',
    accent: '#60a5fa',
    kind: 'private',
    gallery: [asset('cases/superpower.jpg'), asset('cases/superpower-ops.jpg')],
  },
]

export function getCaseById(id: string) {
  const c = CASE_BASE.find((entry) => entry.id === id)
  if (!c || c.hidden) return undefined
  return c
}

/** Cases shown on the site (excludes temporarily hidden entries). */
export function getVisibleCases() {
  return CASE_BASE.filter((c) => !c.hidden)
}
