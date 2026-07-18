import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { Process } from './components/Process'
import { Stack } from './components/Stack'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { PrivateCasePage } from './components/PrivateCasePage'
import { getCaseById } from './data/cases'

const BootSequence = lazy(() => import('./components/easter/BootSequence'))
const Win98Desktop = lazy(() => import('./components/easter/Win98Desktop'))

type EggPhase = 'idle' | 'booting' | 'desktop'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

function parseCaseHash(hash: string): string | null {
  const m = hash.match(/^#case\/([a-z0-9-]+)$/i)
  if (!m) return null
  const c = getCaseById(m[1])
  return c?.kind === 'private' ? c.id : null
}

export default function App() {
  const [eggPhase, setEggPhase] = useState<EggPhase>('idle')
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [caseId, setCaseId] = useState<string | null>(() =>
    typeof window !== 'undefined' ? parseCaseHash(window.location.hash) : null,
  )
  const prevPhase = useRef<EggPhase>('idle')

  const activateEgg = useCallback(() => {
    setEggPhase((phase) => (phase === 'idle' ? 'booting' : phase))
  }, [])

  const exitEgg = useCallback(() => {
    setEggPhase('idle')
    setKonamiIndex(0)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const closeCase = useCallback((target: string = 'work') => {
    setCaseId(null)
    const url = new URL(window.location.href)
    url.hash = target
    window.history.pushState(null, '', url)
    requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [])

  useEffect(() => {
    const sync = () => setCaseId(parseCaseHash(window.location.hash))
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  // return keyboard focus to the trigger once the main site remounts
  useEffect(() => {
    if (prevPhase.current !== 'idle' && eggPhase === 'idle') {
      const t = setTimeout(() => {
        document.getElementById('egg-trigger')?.focus({ preventScroll: true })
      }, 150)
      prevPhase.current = eggPhase
      return () => clearTimeout(t)
    }
    prevPhase.current = eggPhase
  }, [eggPhase])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (eggPhase !== 'idle' || caseId) return
      if (e.key === KONAMI[konamiIndex]) {
        const next = konamiIndex + 1
        if (next === KONAMI.length) {
          activateEgg()
          setKonamiIndex(0)
        } else {
          setKonamiIndex(next)
        }
      } else {
        setKonamiIndex(e.key === KONAMI[0] ? 1 : 0)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [konamiIndex, activateEgg, eggPhase, caseId])

  if (caseId && eggPhase === 'idle') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`case-${caseId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <PrivateCasePage caseId={caseId} onClose={closeCase} />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {eggPhase === 'idle' && (
        <motion.div key="main" className="noise" exit={{ opacity: 0 }}>
          <Header />
          <main>
            <Hero />
            <Services />
            <Work />
            <Process />
            <Stack />
            <Contact />
          </main>
          <Footer onEggActivate={activateEgg} />
        </motion.div>
      )}
      {eggPhase === 'booting' && (
        <motion.div
          key="boot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Suspense fallback={null}>
            <BootSequence onComplete={() => setEggPhase('desktop')} />
          </Suspense>
        </motion.div>
      )}
      {eggPhase === 'desktop' && (
        <motion.div
          key="desktop"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={null}>
            <Win98Desktop onExit={exitEgg} />
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
