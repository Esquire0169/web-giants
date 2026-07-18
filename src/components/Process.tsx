import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Kicker, Reveal } from './Reveal'
import { useLocale } from '../i18n'

export function Process() {
  const { t } = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 60%'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })

  return (
    <section id="process" className="relative border-t border-slate-line/60">
      <div className="mx-auto max-w-[88rem] px-6 py-28 lg:px-10 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Kicker index="03" label={t.process.kicker} />
            <Reveal delay={0.08}>
              <h2 className="display-xl mt-8 text-4xl text-bone sm:text-5xl lg:text-6xl">
                {t.process.titlePre}{' '}
                <span className="serif-accent text-lime">{t.process.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-fog">{t.process.sub}</p>
            </Reveal>
          </div>

          {/* timeline */}
          <div ref={ref} className="relative pl-10 lg:pl-14">
            {/* track */}
            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-white/8 lg:left-[7px]" />
            {/* scroll-drawn progress */}
            <motion.div
              style={{ scaleY: progress }}
              className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-gradient-to-b from-lime via-lime/70 to-lime/20 shadow-[0_0_12px_rgba(201,242,75,0.4)] lg:left-[7px]"
            />

            <ol className="space-y-14 lg:space-y-20">
              {t.process.steps.map((s, i) => (
                <li key={s.num} className="relative">
                  {/* node */}
                  <span className="absolute top-2 -left-10 flex h-3 w-3 items-center justify-center lg:-left-14 lg:h-4 lg:w-4">
                    <span className="absolute h-full w-full rounded-full border border-lime/50 bg-ink" />
                    <span className="h-1 w-1 rounded-full bg-lime lg:h-1.5 lg:w-1.5" />
                  </span>

                  <Reveal delay={i * 0.05} amount={0.5}>
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-xs tracking-[0.3em] text-lime">
                        {s.num}
                      </span>
                      <h3 className="display-xl text-2xl text-bone lg:text-3xl">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-lg text-base leading-relaxed text-fog">
                      {s.line}
                    </p>
                    <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">
                      {s.detail}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
