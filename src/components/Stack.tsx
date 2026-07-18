import { Kicker, Reveal } from './Reveal'
import { useLocale } from '../i18n'

export function Stack() {
  const { t } = useLocale()
  return (
    <section id="studio" className="relative border-t border-slate-line/60">
      <div className="mx-auto max-w-[88rem] px-6 py-24 lg:px-10 lg:py-32">
        <Kicker index="04" label={t.stack.kicker} />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal delay={0.08}>
            <h2 className="display-xl max-w-xl text-4xl text-bone sm:text-5xl">
              {t.stack.titlePre}{' '}
              <span className="serif-accent text-lime">{t.stack.titleAccent}</span>
            </h2>
          </Reveal>
        </div>

        {/* stats strip */}
        <Reveal delay={0.12} amount={0.4}>
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-line bg-slate-line lg:grid-cols-4">
            {t.stack.stats.map((s) => (
              <div key={s.label} className="bg-coal px-8 py-8 lg:py-10">
                <dt className="order-2 mt-2 block font-mono text-[11px] tracking-[0.2em] text-dim uppercase">
                  {s.label}
                </dt>
                <dd className="display-xl order-1 text-3xl text-bone lg:text-4xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* capability chips */}
        <div className="mt-14 space-y-8">
          {t.stack.groups.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.08} amount={0.5}>
              <div className="flex flex-col gap-4 border-t border-slate-line/60 pt-8 lg:flex-row lg:items-start lg:gap-16">
                <h3 className="kicker w-44 shrink-0 pt-2">{g.label}</h3>
                <div className="flex flex-wrap gap-2.5">
                  {g.items.map((item) => (
                    <span key={item} className="chip !px-5 !py-2.5 !text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
