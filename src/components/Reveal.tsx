import { motion, useReducedMotion, type Variants } from 'motion/react'
import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * Motion budget for the current device.
 * - `reduced`: user asked for calm motion — animate opacity only.
 * - `light`: touch/small screens — keep transforms, drop expensive blur.
 */
export function useMotionBudget() {
  const reduced = useReducedMotion() ?? false
  const coarse = useMediaQuery('(pointer: coarse), (max-width: 768px)')
  return { reduced, light: reduced || coarse }
}

/** Pauses all CSS keyframe animations inside `ref` while it is offscreen. */
export function useAmbientPause(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('ambient-paused', !entry.isIntersecting),
      { rootMargin: '10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE, delay },
  }),
}

/* No filter animation: cheaper to composite on mobile GPUs. */
const fadeUpLight: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
}

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: Math.min(delay, 0.1) },
  }),
}

/** Fade-up entrance triggered when the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  amount = 0.3,
}: {
  children: ReactNode
  delay?: number
  className?: string
  amount?: number
}) {
  const { reduced, light } = useMotionBudget()
  const variants = reduced ? fadeOnly : light ? fadeUpLight : fadeUp

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      // Lower trigger threshold on small screens so tall blocks still reveal.
      viewport={{ once: true, amount: light ? Math.min(amount, 0.15) : amount }}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

/** Section kicker: mono label with accent tick, revealed on scroll. */
export function Kicker({ index, label }: { index: string; label: string }) {
  return (
    <Reveal>
      <div className="flex items-center gap-4">
        <span className="h-px w-10 bg-lime/70" />
        <span className="kicker">
          <span className="text-lime">{index}</span>
          <span className="mx-2 text-dim">/</span>
          {label}
        </span>
      </div>
    </Reveal>
  )
}
