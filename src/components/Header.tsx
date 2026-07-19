import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale } from '../i18n'
import type { Lang } from '../i18n/dict'
import { LogoFramed } from './LogoFramed'
import { ContactLinks } from './ContactLinks'

const EASE = [0.22, 1, 0.36, 1] as const
const LANGS: Lang[] = ['en', 'ru']

const PILL_SLIDE_MS = 250
const PILL_HOLD_MS = 80
const PILL_FADE_MS = 420

function SlidingNav({
  items,
}: {
  items: { label: string; href: string }[]
}) {
  const pillRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const fadeTimer = useRef<number | null>(null)
  const lastIndex = useRef(0)
  const [active, setActive] = useState<number | null>(null)
  const [pillOn, setPillOn] = useState(false)

  const placePill = useCallback((index: number, animate: boolean) => {
    const pill = pillRef.current
    const tab = tabRefs.current[index]
    if (!pill || !tab) return
    if (!animate) pill.style.transition = 'none'
    pill.style.transform = `translateX(${tab.offsetLeft}px)`
    pill.style.width = `${tab.offsetWidth}px`
    if (!animate) {
      void pill.offsetWidth
      pill.style.transition = ''
    }
  }, [])

  const flashTo = useCallback(
    (index: number) => {
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current)
      // Park under the previous tab, then slide to the new one and evaporate.
      placePill(lastIndex.current, false)
      setActive(index)
      setPillOn(true)
      requestAnimationFrame(() => {
        placePill(index, true)
        lastIndex.current = index
        fadeTimer.current = window.setTimeout(() => {
          setPillOn(false)
          fadeTimer.current = window.setTimeout(() => {
            setActive(null)
            fadeTimer.current = null
          }, PILL_FADE_MS)
        }, PILL_SLIDE_MS + PILL_HOLD_MS)
      })
    },
    [placePill],
  )

  useLayoutEffect(() => {
    placePill(lastIndex.current, false)
  }, [items, placePill])

  useEffect(() => {
    const onResize = () => placePill(lastIndex.current, false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [placePill])

  useEffect(
    () => () => {
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current)
    },
    [],
  )

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <div className="t-tabs" role="tablist">
        <span
          ref={pillRef}
          className={`t-tabs-pill${pillOn ? ' is-on' : ''}`}
          aria-hidden="true"
        />
        {items.map((item, i) => (
          <a
            key={`${item.href}-${item.label}`}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            href={item.href}
            role="tab"
            aria-selected={active === i}
            className="t-tab"
            onClick={() => flashTo(i)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLocale()
  return (
    <div
      role="group"
      aria-label={t.header.langLabel}
      className={`flex items-center rounded-full border border-slate-line/80 p-0.5 ${className}`}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === 'en' ? 'English' : 'Русский'}
          className={`rounded-full px-2.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 focus-visible:outline-offset-1 ${
            lang === l
              ? 'bg-lime/15 text-lime'
              : 'text-fog hover:text-bone focus-visible:text-bone'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { t } = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? 'border-slate-line bg-ink/85 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.7)] backdrop-blur-xl'
            : 'border-transparent bg-transparent backdrop-blur-sm'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[88rem] items-center justify-between px-6 transition-all duration-500 lg:px-10 ${
            scrolled ? 'h-16' : 'h-[5.25rem]'
          }`}
        >
          <a
            href="#top"
            className="group block transition-opacity duration-300 hover:opacity-90"
            aria-label="Web Giants — home"
          >
            <LogoFramed
              compact
              width={scrolled ? 176 : 200}
              className="max-w-[48vw]"
            />
          </a>

          <SlidingNav items={t.header.nav} />

          <div className="flex items-center gap-3 lg:gap-5">
            <ContactLinks variant="header" />
            <LangSwitcher className="hidden md:flex" />

            <a
              href="#contact"
              className="group hidden items-center gap-2 rounded-full bg-lime px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.18em] text-ink uppercase transition-all duration-400 hover:bg-lime-bright hover:shadow-[0_0_32px_-6px_rgba(201,242,75,0.5)] sm:inline-flex"
            >
              {t.header.cta}
              <span className="transition-transform duration-400 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label={open ? t.header.menuClose : t.header.menuOpen}
              aria-expanded={open}
            >
              <span
                className={`h-px w-6 bg-bone transition-all duration-400 ${
                  open ? 'translate-y-[3.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-6 bg-bone transition-all duration-400 ${
                  open ? '-translate-y-[3.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/97 px-6 pt-28 pb-10 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {t.header.nav.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.06 }}
                  className="display-xl border-b border-slate-line py-4 text-4xl text-bone transition-colors hover:text-lime"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
              >
                <ContactLinks
                  variant="mobile"
                  showPreferred
                  className="mb-2"
                  onNavigate={() => setOpen(false)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
                className="flex justify-center"
              >
                <LangSwitcher />
              </motion.div>
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.48 }}
                className="flex items-center justify-center rounded-full bg-lime py-4 font-mono text-xs font-medium tracking-[0.2em] text-ink uppercase"
              >
                {t.header.cta} &rarr;
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
