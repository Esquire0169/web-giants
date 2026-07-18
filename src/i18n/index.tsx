import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { DICTS, type Dict, type Lang } from './dict'

const STORAGE_KEY = 'wg-lang'

function detectLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'ru' || fromUrl === 'en') return fromUrl
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'ru' || stored === 'en') return stored
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

function setMetaByName(name: string, content: string) {
  document.querySelector(`meta[name="${name}"]`)?.setAttribute('content', content)
}

function setMetaByProp(prop: string, content: string) {
  document.querySelector(`meta[property="${prop}"]`)?.setAttribute('content', content)
}

interface LocaleValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  /* keep <html lang>, document title, and social metadata in sync with the locale */
  useEffect(() => {
    const meta = DICTS[lang].meta
    document.documentElement.lang = lang
    document.title = meta.title
    setMetaByName('description', meta.description)
    setMetaByName('twitter:title', meta.title)
    setMetaByName('twitter:description', meta.description)
    setMetaByProp('og:title', meta.title)
    setMetaByProp('og:description', meta.description)
    setMetaByProp('og:locale', lang === 'ru' ? 'ru_RU' : 'en_US')

    // keep the URL shareable in the active language (matches hreflang alternates)
    const url = new URL(window.location.href)
    if (lang === 'en') url.searchParams.delete('lang')
    else url.searchParams.set('lang', lang)
    window.history.replaceState(null, '', url)

    // mirror the shareable URL into Open Graph for crawlers that re-read the DOM
    setMetaByProp('og:url', url.origin + url.pathname + url.search)
  }, [lang])

  return (
    <LocaleContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LocaleContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
