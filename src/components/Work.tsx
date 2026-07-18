import { useRef } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import { Kicker, Reveal, useAmbientPause, useMotionBudget } from './Reveal'
import { useLocale } from '../i18n'
import { CASE_BASE, type CaseBase } from '../data/cases'
import { CaseTape } from './CaseTape'

const EASE = [0.22, 1, 0.36, 1] as const

type Case = CaseBase & {
  category: string
  problem: string
  solution: string
  result: string
}

function CaseCard({
  c,
  delay,
  problemLabel,
  solutionLabel,
  openLabel,
  priceFromLabel,
  privateBadge,
  reduced,
  light,
}: {
  c: Case
  delay: number
  problemLabel: string
  solutionLabel: string
  openLabel: string
  priceFromLabel: string
  privateBadge: string
  reduced: boolean
  light: boolean
}) {
  const isExternal = c.kind === 'external'
  const href = isExternal ? c.href! : `#case/${c.id}`
  const controls = useAnimationControls()
  const shaking = useRef(false)

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced) return
    if (shaking.current) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    shaking.current = true
    await controls.start({
      rotate: light ? [0, -1, 1, 0] : [0, -1.6, 1.4, -0.9, 0.6, 0],
      x: light ? [0, -3, 3, 0] : [0, -5, 5, -3, 2, 0],
      transition: { duration: light ? 0.32 : 0.45, ease: EASE },
    })
    shaking.current = false
    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      window.location.hash = href.replace(/^#/, '')
    }
  }

  return (
    <Reveal delay={delay} amount={0.15} className={c.featured ? 'md:col-span-2' : ''}>
      <motion.a
        href={href}
        animate={controls}
        onClick={handleClick}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className={`surface group relative flex h-full flex-col overflow-hidden rounded-2xl outline-offset-4 ${
          c.featured ? 'lg:flex-row' : ''
        }`}
      >
        {/* visual */}
        <div
          className={`relative overflow-hidden bg-ink ${
            c.featured
              ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[24rem] lg:w-[56%]'
              : 'aspect-[16/10]'
          }`}
        >
          <div
            className="absolute inset-x-0 top-0 z-20 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`,
            }}
            aria-hidden
          />

          <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
            <img
              src={c.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0 opacity-40 mix-blend-soft-light"
              style={{
                background: `radial-gradient(80% 70% at 50% 40%, ${c.accent}33, transparent 70%)`,
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.15)_0%,transparent_35%,rgba(8,9,10,0.55)_100%)]"
              aria-hidden
            />
          </div>

          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background: `radial-gradient(60% 50% at 50% 45%, ${c.accent}22, transparent 70%)`,
            }}
            aria-hidden
          />

          <span className="absolute top-5 left-5 z-10 rounded-full border border-white/12 bg-ink/55 px-4 py-1.5 font-mono text-[10px] tracking-[0.22em] text-bone/90 uppercase backdrop-blur-md">
            {c.category}
          </span>

          {c.kind === 'private' && (
            <span className="absolute top-5 right-5 z-10 rounded-full border border-lime/25 bg-ink/70 px-3 py-1 font-mono text-[9px] tracking-[0.16em] text-lime/90 uppercase backdrop-blur-md">
              {privateBadge}
            </span>
          )}

          <CaseTape status={c.status} eta={c.eta} />

          {c.featured && (
            <span
              className="pointer-events-none absolute right-6 bottom-4 z-10 display-xl text-5xl text-white/[0.06] select-none lg:text-7xl"
              aria-hidden
            >
              01
            </span>
          )}
        </div>

        {/* copy */}
        <div
          className={`relative flex flex-1 flex-col p-7 lg:p-9 ${
            c.featured ? 'lg:justify-center' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="display-xl text-2xl text-bone transition-colors duration-500 group-hover:text-lime lg:text-3xl">
                {c.name}
              </h3>
              <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-lime/85 uppercase">
                {priceFromLabel}
              </p>
              <span
                className="mt-3 block h-px w-10 origin-left scale-x-75 bg-current opacity-40 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-90"
                style={{ color: c.accent }}
                aria-hidden
              />
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-line text-fog transition-all duration-500 group-hover:border-lime/40 group-hover:text-lime">
              <span className="inline-block transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                &#8599;
              </span>
            </span>
          </div>

          <dl className="mt-6 space-y-4 text-sm leading-relaxed">
            <div>
              <dt className="kicker mb-1.5 !text-[10px] text-dim">{problemLabel}</dt>
              <dd className="text-fog">{c.problem}</dd>
            </div>
            <div>
              <dt className="kicker mb-1.5 !text-[10px] text-dim">{solutionLabel}</dt>
              <dd className="text-fog">{c.solution}</dd>
            </div>
          </dl>

          <p className="mt-6 border-l-2 border-lime/60 pl-4 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-bone/85">
            {c.result}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
            <div className="flex flex-wrap gap-2">
              {c.stack.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
            <span className="font-mono text-[10px] tracking-[0.18em] text-lime uppercase opacity-0 transition-opacity duration-400 group-hover:opacity-100">
              {openLabel} &rarr;
            </span>
          </div>
        </div>
      </motion.a>
    </Reveal>
  )
}

export function Work() {
  const { t } = useLocale()
  const ref = useRef<HTMLElement>(null)
  const { reduced, light } = useMotionBudget()
  useAmbientPause(ref)

  const cases: Case[] = CASE_BASE.map((base, i) => ({
    ...base,
    ...t.work.cases[i],
  }))

  return (
    <section id="work" ref={ref} className="relative border-t border-slate-line/60">
      <motion.div
        initial={reduced ? false : { y: light ? 32 : 56 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[88rem] px-6 py-28 lg:px-10 lg:py-40"
      >
        <Kicker index="02" label={t.work.kicker} />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal delay={0.08}>
            <h2 className="display-xl max-w-2xl text-4xl text-bone sm:text-5xl lg:text-6xl">
              {t.work.titlePre}{' '}
              <span className="serif-accent text-lime">{t.work.titleAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-sm text-sm leading-relaxed text-fog">{t.work.sub}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20">
          {cases.map((c, i) => (
            <CaseCard
              key={c.id}
              c={c}
              delay={i * 0.06}
              problemLabel={t.work.problemLabel}
              solutionLabel={t.work.solutionLabel}
              openLabel={c.kind === 'external' ? t.work.openExternal : t.work.openPrivate}
              priceFromLabel={t.work.priceFrom.replace('{price}', c.priceFrom)}
              privateBadge={t.work.private.badge}
              reduced={reduced}
              light={light}
            />
          ))}
        </div>

        {/* And others */}
        <Reveal delay={0.1} amount={0.3}>
          <aside className="relative mt-10 overflow-hidden rounded-2xl border border-dashed border-slate-line/80 bg-white/[0.015] px-8 py-10 lg:px-12 lg:py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="font-mono text-[11px] tracking-[0.28em] text-dim uppercase">
                  {t.work.othersKicker}
                </p>
                <h3 className="display-xl mt-3 text-3xl text-bone lg:text-4xl">
                  {t.work.othersTitle}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-fog">{t.work.othersBody}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-16 w-12 rounded-lg border border-slate-line bg-gradient-to-b from-white/[0.04] to-transparent"
                    style={{ opacity: 1 - i * 0.25, transform: `rotate(${(i - 1) * 4}deg)` }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </Reveal>
      </motion.div>
    </section>
  )
}
