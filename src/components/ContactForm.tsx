import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useMotionBudget } from './Reveal'
import { useLocale } from '../i18n'
import { submitLead } from '../lib/leads'

const EASE = [0.22, 1, 0.36, 1] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MAX_FILES = 5
const MAX_FILE_BYTES = 8 * 1024 * 1024
const ACCEPT_EXT = new Set([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'rtf',
  'zip',
  'fig',
])
const ACCEPT_ATTR =
  '.pdf,.png,.jpg,.jpeg,.webp,.gif,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.zip,.fig'

type Status = 'idle' | 'submitting' | 'sent' | 'success' | 'locked'

type Errors = Partial<Record<'name' | 'email' | 'files', string>>

type AttachedFile = { id: string; file: File }

function fileExt(name: string) {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function isAllowedFile(file: File) {
  return ACCEPT_EXT.has(fileExt(file.name))
}

export type ContactFormProps = {
  /** After a successful lead send, run the 3D sequence instead of the inline success screen. */
  deferSuccess?: boolean
  /** Glass / 3D-embedded styling tweaks. */
  cinematic?: boolean
  onSuccessSequence?: (name: string) => void
  className?: string
  style?: CSSProperties
}

/** Floating-label wrapper: label rests inside the field, floats up on focus/content. */
function FloatWrap({
  filled,
  complete,
  area = false,
  children,
}: {
  filled: boolean
  complete: boolean
  area?: boolean
  children: ReactNode
}) {
  return (
    <div
      className="float-wrap"
      data-filled={filled ? '' : undefined}
      data-complete={complete ? '' : undefined}
    >
      {children}
      <span className={`float-check ${area ? 'float-check--area' : ''}`} aria-hidden>
        &#10003;
      </span>
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 font-mono text-[11px] tracking-wide text-red-300/90"
    >
      {message}
    </p>
  )
}

export function ContactForm({
  deferSuccess = false,
  cinematic = false,
  onSuccessSequence,
  className,
  style,
}: ContactFormProps = {}) {
  const { t, lang } = useLocale()
  const f = t.contact.form
  const { reduced } = useMotionBudget()

  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<AttachedFile[]>([])
  // honeypot: invisible to humans, tempting for bots
  const [company, setCompany] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputId = useId()

  const nameComplete = name.trim().length > 1
  const emailComplete = EMAIL_RE.test(email.trim())
  const canAddMore = files.length < MAX_FILES && status === 'idle'

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list)
    if (!incoming.length) return

    let err: string | undefined
    setFiles((prev) => {
      const next = [...prev]
      for (const file of incoming) {
        if (next.length >= MAX_FILES) {
          err = f.errAttachmentsMax
          break
        }
        if (!isAllowedFile(file)) {
          err = f.errAttachmentsType
          continue
        }
        if (file.size > MAX_FILE_BYTES) {
          err = f.errAttachmentsSize
          continue
        }
        const dup = next.some(
          (a) => a.file.name === file.name && a.file.size === file.size,
        )
        if (dup) continue
        next.push({ id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`, file })
      }
      return next
    })
    setErrors((p) => ({ ...p, files: err }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((a) => a.id !== id))
    setErrors((p) => ({ ...p, files: undefined }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status !== 'idle') return

    const next: Errors = {}
    if (!name.trim()) next.name = f.errName
    if (!emailComplete) next.email = f.errEmail
    if (files.length > MAX_FILES) next.files = f.errAttachmentsMax
    setErrors(next)
    if (Object.keys(next).length > 0) {
      document.getElementById(next.name ? 'lead-name' : next.email ? 'lead-email' : fileInputId)?.focus()
      return
    }

    setSubmitError(false)
    setStatus('submitting')
    try {
      if (!company) {
        // honeypot untouched: a real person — transmit the lead
        await submitLead({
          name,
          email,
          projectType,
          budget,
          message,
          lang,
          files: files.map((a) => a.file),
        })
      } else {
        // bot: pretend everything went fine, send nothing
        await new Promise((r) => setTimeout(r, 600))
      }
    } catch {
      setSubmitError(true)
      setStatus('idle')
      return
    }

    // brief confirmation morph on the button before the success screen
    setStatus('sent')
    await new Promise((r) => setTimeout(r, reduced ? 150 : 850))

    if (deferSuccess) {
      setStatus('locked')
      onSuccessSequence?.(name)
      return
    }

    setStatus('success')
  }

  function reset() {
    setStatus('idle')
    setName('')
    setEmail('')
    setProjectType('')
    setBudget('')
    setMessage('')
    setFiles([])
    setCompany('')
    setErrors({})
    setSubmitError(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const buttonLabel: Record<'idle' | 'submitting' | 'sent', ReactNode> = {
    idle: (
      <>
        {f.send}
        <span className="transition-transform duration-400 group-hover:translate-x-1.5">
          &rarr;
        </span>
      </>
    ),
    submitting: (
      <>
        {f.sending}
        <span className="animate-pulse-glow inline-block h-1.5 w-1.5 rounded-full bg-ink/70" />
      </>
    ),
    sent: (
      <>
        <span className="text-sm leading-none">&#10003;</span>
        {f.sent}
      </>
    ),
  }

  const shellClass = cinematic
    ? 'relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-[10px] lg:p-9'
    : 'relative rounded-2xl border border-slate-line bg-white/[0.02] p-7 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm lg:p-10'

  return (
    <div className={[shellClass, className].filter(Boolean).join(' ')} style={style}>
      {/* hairline glow along the top edge */}
      <span
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent"
        aria-hidden
      />
      {/* desktop-only slow light sweep */}
      <span className="panel-sheen" aria-hidden />

      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex min-h-[28rem] flex-col items-center justify-center text-center"
            role="status"
          >
            <motion.span
              initial={reduced ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-lime/40 bg-lime/10 shadow-[0_0_48px_-8px_rgba(201,242,75,0.5)]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <motion.path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="var(--color-lime)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
                />
              </svg>
            </motion.span>

            <motion.h3
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
              className="display-xl mt-8 text-3xl text-bone"
            >
              {f.successTitlePre}{' '}
              <span className="serif-accent text-lime">{f.successTitleAccent}</span>
            </motion.h3>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
              className="mt-4 max-w-xs text-sm leading-relaxed text-fog"
            >
              {f.successBody.replace(
                '{name}',
                name.trim().split(' ')[0] || f.successFallbackName,
              )}
            </motion.p>

            <motion.button
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={reset}
              className="link-sweep mt-10 font-mono text-[11px] tracking-[0.2em] text-fog uppercase transition-colors hover:text-bone"
            >
              {f.successAgain}
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE }}
            onSubmit={onSubmit}
            noValidate
            className="space-y-6"
          >
            {/* honeypot: hidden from humans and assistive tech */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="lead-company">Company</label>
              <input
                id="lead-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FloatWrap filled={name !== ''} complete={nameComplete}>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={f.namePlaceholder}
                    className="field"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name && e.target.value.trim())
                        setErrors((p) => ({ ...p, name: undefined }))
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'lead-name-error' : undefined}
                  />
                  <label htmlFor="lead-name" className="float-label">
                    {f.name} <span className="text-lime">*</span>
                  </label>
                </FloatWrap>
                <FieldError id="lead-name-error" message={errors.name} />
              </div>

              <div>
                <FloatWrap filled={email !== ''} complete={emailComplete}>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={f.emailPlaceholder}
                    className="field"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email && EMAIL_RE.test(e.target.value.trim()))
                        setErrors((p) => ({ ...p, email: undefined }))
                    }}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'lead-email-error' : undefined}
                  />
                  <label htmlFor="lead-email" className="float-label">
                    {f.email} <span className="text-lime">*</span>
                  </label>
                </FloatWrap>
                <FieldError id="lead-email-error" message={errors.email} />
              </div>
            </div>

            <FloatWrap filled={projectType !== ''} complete={projectType !== ''}>
              <select
                id="lead-type"
                name="projectType"
                className="field appearance-none pr-10"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              >
                <option value="" disabled hidden></option>
                {f.projectTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
              <label htmlFor="lead-type" className="float-label">
                {f.projectType}
              </label>
              <span
                className="pointer-events-none absolute top-1/2 right-9 -translate-y-1/2 text-xs text-dim"
                aria-hidden
              >
                &#9662;
              </span>
            </FloatWrap>

            <fieldset>
              <legend className="field-label flex items-center gap-2">
                {f.budget}
                <span
                  aria-hidden
                  className={`text-lime transition-opacity duration-400 ${
                    budget ? 'opacity-90' : 'opacity-0'
                  }`}
                >
                  &#10003;
                </span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {f.budgets.map((b) => (
                  <label key={b} className="cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      value={b}
                      checked={budget === b}
                      onChange={() => setBudget(b)}
                      className="peer sr-only"
                    />
                    <span className="chip block peer-checked:border-lime/60 peer-checked:bg-lime/10 peer-checked:text-lime peer-focus-visible:shadow-[0_0_0_3px_rgba(201,242,75,0.15)]">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <FloatWrap filled={message !== ''} complete={message.trim().length > 0} area>
              <textarea
                id="lead-message"
                name="message"
                rows={4}
                placeholder={f.messagePlaceholder}
                className="field resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <label htmlFor="lead-message" className="float-label float-label--area">
                {f.message}
              </label>
            </FloatWrap>

            <div>
              <div className="field-label flex items-center justify-between gap-3">
                <span>
                  {f.attachments}
                  <span className="ml-2 font-normal text-dim">
                    {files.length}/{MAX_FILES}
                  </span>
                </span>
              </div>
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                name="attachment"
                accept={ACCEPT_ATTR}
                multiple
                disabled={!canAddMore}
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files)
                }}
              />
              <label
                htmlFor={fileInputId}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!canAddMore) return
                  addFiles(e.dataTransfer.files)
                }}
                className={`flex min-h-[5.5rem] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-5 text-center transition-colors ${
                  canAddMore
                    ? 'border-slate-line bg-white/[0.02] hover:border-lime/40 hover:bg-lime/[0.03]'
                    : 'cursor-not-allowed border-slate-line/50 bg-white/[0.01] opacity-60'
                }`}
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-bone uppercase">
                  {f.attachmentsAdd}
                </span>
                <span className="max-w-sm text-[11px] leading-relaxed text-dim">
                  {f.attachmentsHint}
                </span>
              </label>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2" aria-label={f.attachments}>
                  {files.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 border-b border-white/5 py-2 last:border-0"
                    >
                      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-bone">
                        {item.file.name}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] tracking-wide text-dim">
                        {formatBytes(item.file.size)}
                      </span>
                      <button
                        type="button"
                        disabled={status !== 'idle'}
                        onClick={() => removeFile(item.id)}
                        aria-label={`${f.attachmentsRemove}: ${item.file.name}`}
                        className="shrink-0 font-mono text-[11px] tracking-wide text-fog transition-colors hover:text-lime disabled:opacity-40"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <FieldError id="lead-files-error" message={errors.files} />
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={status !== 'idle'}
                whileTap={reduced || status !== 'idle' ? undefined : { scale: 0.98 }}
                onPointerDown={(e) => {
                  if (status !== 'idle' || reduced) return
                  const el = e.currentTarget
                  el.classList.remove('jello-horizontal')
                  void el.offsetWidth
                  el.classList.add('jello-horizontal')
                }}
                className={`group inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4.5 font-mono text-xs font-medium tracking-[0.18em] uppercase transition-all duration-400 focus-visible:outline-none ${
                  cinematic
                    ? status === 'sent' || status === 'locked'
                      ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-ink shadow-[0_0_48px_-10px_rgba(56,189,248,0.7)]'
                      : status === 'submitting'
                        ? 'cursor-wait bg-gradient-to-r from-sky-500/80 to-cyan-400/80 text-ink'
                        : 'bg-gradient-to-r from-sky-500 to-cyan-400 text-ink hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-300 hover:shadow-[0_0_40px_-8px_rgba(34,211,238,0.55)] focus-visible:shadow-[0_0_0_3px_rgba(34,211,238,0.28)]'
                    : status === 'sent'
                      ? 'bg-lime-bright text-ink shadow-[0_0_56px_-8px_rgba(201,242,75,0.65)] focus-visible:shadow-[0_0_0_3px_rgba(201,242,75,0.3)]'
                      : status === 'submitting'
                        ? 'cursor-wait bg-lime/80 text-ink focus-visible:shadow-[0_0_0_3px_rgba(201,242,75,0.3)]'
                        : 'bg-lime text-ink hover:-translate-y-0.5 hover:bg-lime-bright hover:shadow-[0_0_48px_-8px_rgba(201,242,75,0.55)] focus-visible:shadow-[0_0_0_3px_rgba(201,242,75,0.3)]'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={status === 'locked' ? 'sent' : status}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="inline-flex items-center gap-3"
                  >
                    {
                      buttonLabel[
                        (status === 'locked' ? 'sent' : status) as Exclude<
                          Status,
                          'success' | 'locked'
                        >
                      ]
                    }
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {submitError && (
                <p
                  role="alert"
                  className="mt-3 text-center font-mono text-[11px] tracking-wide text-red-300/90"
                >
                  {f.errSubmit}{' '}
                  <a href="mailto:hello@webgiants.studio" className="underline hover:text-red-200">
                    hello@webgiants.studio
                  </a>
                </p>
              )}
            </div>

            <p className="text-center font-mono text-[10px] tracking-[0.14em] text-dim">
              {f.privacy}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
