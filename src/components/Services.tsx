import { useId, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useScroll,
  useTransform,
} from 'motion/react'
import { Kicker, Reveal, useMotionBudget } from './Reveal'
import { useLocale } from '../i18n'

const EASE = [0.22, 1, 0.36, 1] as const

type ServiceItem = {
  num: string
  title: string
  promise: string
  body: string
  metric: string
  tags: string[]
}

function ServiceCard({
  s,
  open,
  onToggle,
  openHint,
  closeHint,
  reduced,
  light,
}: {
  s: ServiceItem
  open: boolean
  onToggle: () => void
  openHint: string
  closeHint: string
  reduced: boolean
  light: boolean
}) {
  const controls = useAnimationControls()
  const panelId = useId()

  async function handleActivate() {
    if (!reduced && !open) {
      // premium "shake awake" before the reveal
      await controls.start({
        rotate: light ? [0, -1, 1, 0] : [0, -1.6, 1.4, -0.9, 0.6, 0],
        x: light ? [0, -3, 3, 0] : [0, -5, 5, -3, 2, 0],
        transition: { duration: light ? 0.32 : 0.45, ease: EASE },
      })
    }
    onToggle()
  }

  const panelIn = reduced
    ? { opacity: 0 }
    : { height: 0, opacity: 0 }
  const panelShow = reduced
    ? { opacity: 1 }
    : { height: 'auto', opacity: 1 }
  const panelOut = reduced
    ? { opacity: 0 }
    : { height: 0, opacity: 0 }

  return (
    <motion.article
      animate={controls}
      className={`surface group relative flex h-full flex-col rounded-2xl p-8 lg:p-10 ${
        open ? 'border-lime/25 shadow-[0_0_60px_-28px_rgba(201,242,75,0.28)]' : ''
      }`}
    >
      <button
        type="button"
        onClick={handleActivate}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full flex-col text-left outline-offset-4"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs tracking-[0.3em] text-dim">{s.num}</span>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-500 ${
              open
                ? 'rotate-45 border-lime/50 text-lime'
                : 'border-slate-line text-fog group-hover:border-lime/40 group-hover:text-lime'
            }`}
            aria-hidden
          >
            {open ? '×' : '+'}
          </span>
        </div>

        <h3 className="display-xl mt-10 text-2xl text-bone transition-colors duration-500 group-hover:text-lime lg:mt-14 lg:text-3xl">
          {s.title}
        </h3>
        <p className="serif-accent mt-3 text-lg text-lime/90">{s.promise}</p>

        <p className="mt-5 font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
          {open ? closeHint : openHint}
          <span className="ml-2 text-lime">{open ? '↑' : '↓'}</span>
        </p>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="body"
            initial={panelIn}
            animate={panelShow}
            exit={panelOut}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            <motion.div
              initial={reduced ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
              className="pt-5"
            >
              <p className="max-w-md text-sm leading-relaxed text-fog">{s.body}</p>

              <div className="mt-8 border-t border-slate-line/70 pt-6">
                <p className="font-mono text-[11px] tracking-[0.2em] text-bone/70 uppercase">
                  <span className="mr-2 inline-block h-1 w-1 rounded-full bg-lime align-middle" />
                  {s.metric}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map((tag, ti) => (
                    <motion.span
                      key={tag}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: EASE,
                        delay: 0.08 + ti * 0.05,
                      }}
                      className="chip"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <span
        className={`absolute bottom-0 left-8 right-8 h-px origin-left bg-gradient-to-r from-lime/70 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </motion.article>
  )
}

export function Services() {
  const { t } = useLocale()
  const ref = useRef<HTMLElement>(null)
  const { reduced, light } = useMotionBudget()
  const [openNum, setOpenNum] = useState<string | null>(null)

  /* Each row (01–02 / 03–04 / 05–06) exits on its own scroll window so lower
     cards stay fully readable until they themselves leave the viewport. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const exitRow1 = useTransform(scrollYProgress, [0.04, 0.32], [0, 1], { clamp: true })
  const exitRow2 = useTransform(scrollYProgress, [0.28, 0.56], [0, 1], { clamp: true })
  const exitRow3 = useTransform(scrollYProgress, [0.52, 0.82], [0, 1], { clamp: true })

  const dist = light ? 64 : 150
  const tilt = light ? 2 : 4

  const r1LeftX = useTransform(exitRow1, (v) => -dist * v)
  const r1RightX = useTransform(exitRow1, (v) => dist * v)
  const r1LeftRot = useTransform(exitRow1, (v) => -tilt * v)
  const r1RightRot = useTransform(exitRow1, (v) => tilt * v)
  const r1Scale = useTransform(exitRow1, [0, 1], [1, 0.94])
  const r1Fade = useTransform(exitRow1, [0, 1], [1, 0])

  const r2LeftX = useTransform(exitRow2, (v) => -dist * v)
  const r2RightX = useTransform(exitRow2, (v) => dist * v)
  const r2LeftRot = useTransform(exitRow2, (v) => -tilt * v)
  const r2RightRot = useTransform(exitRow2, (v) => tilt * v)
  const r2Scale = useTransform(exitRow2, [0, 1], [1, 0.94])
  const r2Fade = useTransform(exitRow2, [0, 1], [1, 0])

  const r3LeftX = useTransform(exitRow3, (v) => -dist * v)
  const r3RightX = useTransform(exitRow3, (v) => dist * v)
  const r3LeftRot = useTransform(exitRow3, (v) => -tilt * v)
  const r3RightRot = useTransform(exitRow3, (v) => tilt * v)
  const r3Scale = useTransform(exitRow3, [0, 1], [1, 0.94])
  const r3Fade = useTransform(exitRow3, [0, 1], [1, 0])

  const veil = useTransform(exitRow1, [0, 0.9], [0, 1])

  const exitStyles: (React.ComponentProps<typeof motion.div>['style'] | undefined)[] = reduced
    ? [
        { opacity: r1Fade },
        { opacity: r1Fade },
        { opacity: r2Fade },
        { opacity: r2Fade },
        { opacity: r3Fade },
        { opacity: r3Fade },
      ]
    : [
        {
          x: r1LeftX,
          rotateZ: r1LeftRot,
          scale: r1Scale,
          opacity: r1Fade,
          willChange: 'transform, opacity',
        },
        {
          x: r1RightX,
          rotateZ: r1RightRot,
          scale: r1Scale,
          opacity: r1Fade,
          willChange: 'transform, opacity',
        },
        /* 03–04 collapse inward (opposite of the outer pairs). */
        {
          x: r2RightX,
          rotateZ: r2RightRot,
          scale: r2Scale,
          opacity: r2Fade,
          willChange: 'transform, opacity',
        },
        {
          x: r2LeftX,
          rotateZ: r2LeftRot,
          scale: r2Scale,
          opacity: r2Fade,
          willChange: 'transform, opacity',
        },
        {
          x: r3LeftX,
          rotateZ: r3LeftRot,
          scale: r3Scale,
          opacity: r3Fade,
          willChange: 'transform, opacity',
        },
        {
          x: r3RightX,
          rotateZ: r3RightRot,
          scale: r3Scale,
          opacity: r3Fade,
          willChange: 'transform, opacity',
        },
      ]

  return (
    <section
      id="services"
      ref={ref}
      className="relative mx-auto max-w-[88rem] px-6 py-28 lg:px-10 lg:py-40"
    >
      <Kicker index="01" label={t.services.kicker} />

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal delay={0.08}>
          <h2 className="display-xl max-w-xl text-4xl text-bone sm:text-5xl lg:text-6xl">
            {t.services.titlePre}{' '}
            <span className="serif-accent text-lime">{t.services.titleAccent}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="max-w-sm text-sm leading-relaxed text-fog">{t.services.sub}</p>
        </Reveal>
      </div>

      <div className="relative mt-14 lg:mt-20">
        <motion.div
          style={{ opacity: veil }}
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -top-16 h-[70%] bg-[radial-gradient(70%_90%_at_50%_20%,rgba(0,0,0,0.65),transparent_78%)]"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {t.services.items.map((s, i) => (
            <motion.div key={s.num} style={exitStyles[i]} className="h-full">
              <Reveal delay={i * 0.08} amount={0.2} className="h-full">
                <ServiceCard
                  s={s}
                  open={openNum === s.num}
                  onToggle={() =>
                    setOpenNum((cur) => (cur === s.num ? null : s.num))
                  }
                  openHint={t.services.openHint}
                  closeHint={t.services.closeHint}
                  reduced={reduced}
                  light={light}
                />
              </Reveal>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
