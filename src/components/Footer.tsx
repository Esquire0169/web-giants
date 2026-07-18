import { useLocale } from '../i18n'
import { LogoFramed } from './LogoFramed'
import { ContactLinks } from './ContactLinks'

export function Footer({ onEggActivate }: { onEggActivate?: () => void }) {
  const { t } = useLocale()
  return (
    <footer className="border-t border-slate-line/60">
      <div className="mx-auto max-w-[88rem] px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 xl:grid-cols-[1fr_1fr_1.1fr]">
          <div className="space-y-6">
            <a href="#top" aria-label="Web Giants — home" className="block w-[220px] max-w-full">
              <LogoFramed width={220} />
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-dim">{t.footer.tagline}</p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer">
            <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
              {t.footer.navKicker}
            </p>
            <div className="flex flex-col gap-2">
              {t.footer.nav.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="link-sweep w-fit font-mono text-[11px] tracking-[0.2em] text-fog uppercase transition-colors hover:text-bone"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>

          <ContactLinks variant="footer" />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-line/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.16em] text-dim">
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </p>
          <button
            id="egg-trigger"
            type="button"
            onClick={onEggActivate}
            className="w-fit font-mono text-[11px] tracking-[0.2em] text-dim/70 transition-colors duration-500 hover:text-lime focus-visible:text-lime"
            aria-label={t.footer.eggAria}
            title="?"
          >
            &uarr;&uarr;&darr;&darr;&larr;&rarr;&larr;&rarr;BA
          </button>
        </div>
      </div>
    </footer>
  )
}
