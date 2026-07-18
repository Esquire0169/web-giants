import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { getCaseById } from '../data/cases'
import { useLocale } from '../i18n'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  caseId: string
  onClose: (target?: string) => void
}

export function PrivateCasePage({ caseId, onClose }: Props) {
  const { t } = useLocale()
  const base = getCaseById(caseId)
  const copyIndex = base ? ['mystic', 'parma', 'ai-3d', 'kids', 'superpower'].indexOf(base.id) : -1
  const copy = copyIndex >= 0 ? t.work.cases[copyIndex] : null
  const [active, setActive] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const prev = document.body.style.overflow
    return () => {
      document.body.style.overflow = prev
    }
  }, [caseId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!base || base.kind !== 'private' || !copy) {
    return (
      <div className="noise flex min-h-svh items-center justify-center px-6">
        <button
          type="button"
          onClick={() => onClose()}
          className="font-mono text-xs tracking-[0.2em] text-lime uppercase"
        >
          {t.work.private.back}
        </button>
      </div>
    )
  }

  const gallery = base.gallery ?? [base.image]
  const p = t.work.private

  return (
    <div className="noise min-h-svh bg-ink text-bone">
      <header className="sticky top-0 z-40 border-b border-slate-line/60 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[88rem] items-center justify-between px-6 lg:px-10">
          <button
            type="button"
            onClick={() => onClose()}
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-fog uppercase transition-colors hover:text-lime focus-visible:text-lime"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">&larr;</span>
            {p.back}
          </button>
          <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-lime uppercase">
            {p.badge}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[88rem] px-6 py-12 lg:px-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="kicker mb-6">
            <span className="text-lime">02</span>
            <span className="mx-2 text-dim">/</span>
            {copy.category}
          </p>
          <h1 className="display-xl text-[clamp(2.4rem,6vw,5.5rem)] text-bone">{base.name}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fog">{copy.solution}</p>
        </motion.div>

        {/* hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-line"
        >
          <div
            className="absolute inset-x-0 top-0 z-10 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${base.accent}, transparent)`,
            }}
            aria-hidden
          />
          <img
            src={gallery[active]}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        </motion.div>

        {/* gallery thumbs */}
        {gallery.length > 1 && (
          <div className="mt-4">
            <p className="kicker mb-4">{p.galleryLabel}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`relative aspect-[16/10] overflow-hidden rounded-xl border transition-all duration-400 ${
                    active === i
                      ? 'border-lime/50 shadow-[0_0_32px_-12px_rgba(201,242,75,0.35)]'
                      : 'border-slate-line hover:border-white/20'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* private notice */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="relative mt-14 overflow-hidden rounded-2xl border border-slate-line bg-white/[0.02] p-8 lg:p-10"
        >
          <span
            className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent"
            aria-hidden
          />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] tracking-[0.22em] text-lime uppercase">
                {p.badge}
              </p>
              <h2 className="display-xl mt-4 text-3xl text-bone lg:text-4xl">
                {p.noticeTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-fog">{p.noticeBody}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {base.stack.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onClose('contact')}
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-lime px-8 py-4 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-all duration-400 hover:bg-lime-bright hover:shadow-[0_0_48px_-8px_rgba(201,242,75,0.55)]"
            >
              {p.cta}
              <span className="transition-transform duration-400 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </button>
          </div>
        </motion.aside>
      </main>
    </div>
  )
}
