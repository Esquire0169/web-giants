import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useAmbientPause, useMotionBudget } from './Reveal'
import { useLocale } from '../i18n'

const EASE = [0.22, 1, 0.36, 1] as const

function HeadlineLine({
  children,
  delay,
  animate,
  className = '',
  accent = false,
}: {
  children: React.ReactNode
  delay: number
  animate: boolean
  className?: string
  /** Extra vertical room for italic serif (Cyrillic descenders especially). */
  accent?: boolean
}) {
  return (
    <span
      className={`block overflow-hidden ${
        accent ? 'my-[0.08em] py-[0.2em]' : 'pb-[0.04em]'
      } ${className}`}
    >
      <motion.span
        className={`block will-change-transform ${accent ? 'leading-[1.15]' : ''}`}
        initial={animate ? { y: '110%', rotate: 2 } : false}
        animate={{ y: '0%', rotate: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const { t, lang } = useLocale()
  const ref = useRef<HTMLElement>(null)
  const { reduced, light } = useMotionBudget()
  useAmbientPause(ref)

  // cursor-tied glow (desktop only), throttled to one update per frame
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const glowX = useSpring(mx, { stiffness: 40, damping: 20 })
  const glowY = useSpring(my, { stiffness: 40, damping: 20 })
  const rafId = useRef(0)

  // scroll parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  function onPointerMove(e: React.PointerEvent) {
    if (light || e.pointerType !== 'mouse' || rafId.current) return
    const { clientX, clientY } = e
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0
      // hero is full-viewport, so normalize against the viewport directly —
      // no layout reads (getBoundingClientRect) on the hot path
      mx.set((clientX / window.innerWidth - 0.5) * 60)
      my.set((clientY / window.innerHeight - 0.5) * 60)
    })
  }

  // reduced motion: static composition, entrance handled by opacity only
  const parallaxText = reduced ? undefined : { y: textY, opacity: fade }
  const parallaxOrb = reduced ? undefined : { y: orbY, x: glowX, opacity: fade }

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-32 pb-12 lg:pb-16"
    >
      {/* atmosphere */}
      <div className="grid-lines absolute inset-0" aria-hidden />
      <div
        className="animate-drift-slow absolute -top-1/4 left-1/2 h-[80vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,242,75,0.07),transparent)] blur-2xl"
        aria-hidden
      />
      <div
        className="animate-pulse-glow absolute top-1/3 -right-32 h-[50vmin] w-[50vmin] rounded-full bg-[radial-gradient(closest-side,rgba(87,215,255,0.05),transparent)] blur-3xl"
        aria-hidden
      />

      {/* orb centerpiece */}
      <motion.div
        style={parallaxOrb}
        className="pointer-events-none absolute top-[8%] right-[4%] hidden h-[46vmin] w-[46vmin] lg:block xl:right-[8%]"
        aria-hidden
      >
        <motion.div
          style={reduced ? undefined : { y: glowY }}
          className="relative h-full w-full"
        >
          {/* halo */}
          <div className="animate-pulse-glow absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,rgba(201,242,75,0.16),rgba(201,242,75,0.03)_55%,transparent_75%)]" />
          {/* orb body */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#3a3f2a_0%,#15170f_38%,#08090a_78%)] shadow-[inset_0_0_80px_rgba(0,0,0,0.9),0_0_120px_-40px_rgba(201,242,75,0.4)]" />
          {/* specular rim */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(220,255,94,0.35),transparent_42%)] mix-blend-screen" />
          <div className="absolute inset-0 rounded-full border border-lime/15" />
          {/* orbit ring */}
          <div className="animate-spin-slow absolute inset-[-12%]">
            <div className="absolute inset-0 rounded-full border border-white/6 [mask-image:linear-gradient(115deg,black_20%,transparent_55%)]" />
            <div className="absolute top-[7%] left-[78%] h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_16px_4px_rgba(201,242,75,0.5)]" />
          </div>
          {/* meridian */}
          <div className="animate-drift absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-ghost/25 to-transparent" />
        </motion.div>
      </motion.div>

      <motion.div
        style={parallaxText}
        className="relative z-10 mx-auto w-full max-w-[88rem] px-6 lg:px-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="kicker mb-8 flex items-center gap-4"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_12px_2px_rgba(201,242,75,0.6)]" />
          {t.hero.kicker}
        </motion.p>

        <h1
          key={lang}
          className="display-xl text-[clamp(3.4rem,11.5vw,11.5rem)] text-bone"
        >
          <HeadlineLine delay={0.25} animate={!reduced}>
            {t.hero.l1}
          </HeadlineLine>
          <HeadlineLine
            delay={0.37}
            animate={!reduced}
            accent
            className="text-right lg:pr-[8vw]"
          >
            <span className="serif-accent inline-block pr-[0.08em] font-normal leading-[1.1] text-lime">
              {t.hero.l2}
            </span>
          </HeadlineLine>
          <HeadlineLine delay={0.49} animate={!reduced}>
            {t.hero.l3}
          </HeadlineLine>
        </h1>

        <div className="mt-12 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
            className="max-w-md text-base leading-relaxed text-fog lg:text-lg"
          >
            {t.hero.support}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-lime px-8 py-4 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-all duration-400 hover:bg-lime-bright hover:shadow-[0_0_48px_-8px_rgba(201,242,75,0.55)]"
            >
              {t.hero.ctaPrimary}
              <span className="transition-transform duration-400 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </a>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full border border-slate-line px-8 py-4 font-mono text-xs tracking-[0.18em] text-bone uppercase transition-all duration-400 hover:border-bone/40 hover:bg-white/4"
            >
              {t.hero.ctaSecondary}
              <span className="text-lime transition-transform duration-400 group-hover:translate-y-0.5">
                &darr;
              </span>
            </a>
          </motion.div>
        </div>

        {/* trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 border-t border-slate-line pt-6 lg:mt-20"
        >
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {t.hero.trust.map((label, i) => (
              <li
                key={label}
                className="flex items-center gap-8 font-mono text-[11px] tracking-[0.24em] text-dim uppercase"
              >
                {label}
                {i < t.hero.trust.length - 1 && (
                  <span className="hidden h-0.5 w-0.5 rounded-full bg-lime/50 sm:block" />
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  )
}
