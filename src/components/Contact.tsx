import { useRef } from 'react'
import { Kicker, Reveal, useAmbientPause, useMotionBudget } from './Reveal'
import { ContactScene } from './contact3d/ContactScene'
import { ContactLinks } from './ContactLinks'
import { useLocale } from '../i18n'

export function Contact() {
  const { t } = useLocale()
  const ref = useRef<HTMLElement>(null)
  useAmbientPause(ref)
  const { reduced, light } = useMotionBudget()

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-x-clip border-t border-slate-line/60"
    >
      <div
        className="animate-drift pointer-events-none absolute top-1/2 left-[20%] h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,242,75,0.07),transparent_70%)] blur-2xl"
        aria-hidden
      />
      <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />

      <div className="relative mx-auto max-w-[88rem] px-6 py-28 lg:px-10 lg:py-40">
        <div className="max-w-2xl">
          <Kicker index="05" label={t.contact.kicker} />

          <Reveal delay={0.08}>
            <h2 className="display-xl mt-10 text-[clamp(2.6rem,6vw,5.5rem)] text-bone">
              {t.contact.titlePre}{' '}
              <span className="serif-accent text-lime">{t.contact.titleAccent}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-fog">
              {t.contact.support}
            </p>
          </Reveal>
        </div>

        {/* Form + quick contacts — side by side on desktop */}
        <div className="mt-14 grid items-start gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
          <Reveal delay={0.12} amount={0.12}>
            <div className="space-y-10">
              <ContactLinks variant="panel" />

              <ul className="space-y-6 border-t border-slate-line/60 pt-8">
                {t.contact.assurances.map((a) => (
                  <li key={a.title} className="flex gap-4">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime shadow-[0_0_12px_2px_rgba(201,242,75,0.5)]"
                      aria-hidden
                    />
                    <div>
                      <h3 className="font-mono text-[11px] font-medium tracking-[0.2em] text-bone uppercase">
                        {a.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-fog">{a.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.18} amount={0.12}>
            <ContactScene lite={light || reduced} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
