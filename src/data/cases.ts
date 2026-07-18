import { asset } from '../lib/asset'

export type CaseKind = 'external' | 'private'

export interface CaseBase {
  id: string
  name: string
  image: string
  stack: string[]
  accent: string
  /** Approximate engagement floor, e.g. "$5k" */
  priceFrom: string
  featured?: boolean
  kind: CaseKind
  /** External URL for public cases */
  href?: string
  /** Gallery for private case pages */
  gallery?: string[]
}

export const CASE_BASE: CaseBase[] = [
  {
    id: 'mystic',
    name: 'MYSTIC',
    image: asset('cases/mystic.jpg'),
    stack: ['React', 'TypeScript', 'AI'],
    priceFrom: '$5k',
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
    accent: '#c4a574',
    kind: 'private',
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
    accent: '#60a5fa',
    kind: 'private',
    gallery: [asset('cases/superpower.jpg'), asset('cases/superpower-ops.jpg')],
  },
]

export function getCaseById(id: string) {
  return CASE_BASE.find((c) => c.id === id)
}
