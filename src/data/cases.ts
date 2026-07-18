export type CaseKind = 'external' | 'private'

export interface CaseBase {
  id: string
  name: string
  image: string
  stack: string[]
  accent: string
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
    image: '/cases/mystic.jpg',
    stack: ['React', 'TypeScript', 'AI'],
    featured: true,
    accent: '#eab308',
    kind: 'external',
    href: 'https://t.me/mysticf_bot',
  },
  {
    id: 'parma',
    name: 'PARMA',
    image: '/cases/parma.jpg',
    stack: ['React', 'Vite', 'Tailwind'],
    accent: '#d4d4d8',
    kind: 'external',
    href: 'https://ubparma.ru/',
  },
  {
    id: 'ai-3d',
    name: 'AI 3D SANDBOX',
    image: '/cases/ai-3d.jpg',
    stack: ['Next.js', 'Three.js', 'R3F'],
    accent: '#57d7ff',
    kind: 'private',
    gallery: ['/cases/ai-3d.jpg', '/cases/ai-3d-plan.jpg', '/cases/ai-3d-modules.jpg'],
  },
  {
    id: 'kids',
    name: 'SPORTKIDS',
    image: '/cases/sportkids.jpg',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    accent: '#2dd4bf',
    kind: 'private',
    gallery: ['/cases/sportkids.jpg', '/cases/sportkids-ops.jpg'],
  },
  {
    id: 'superpower',
    name: 'SUPERPOWER',
    image: '/cases/superpower.jpg',
    stack: ['React', 'Zustand', 'Recharts'],
    accent: '#60a5fa',
    kind: 'private',
    gallery: ['/cases/superpower.jpg', '/cases/superpower-ops.jpg'],
  },
]

export function getCaseById(id: string) {
  return CASE_BASE.find((c) => c.id === id)
}
