import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { ContactForm } from '../ContactForm'
import { useLocale } from '../../i18n'
import { LetterSprite, PackageMorph } from './PackageMorph'
import { CourierBoy } from './CourierBoy'
import { EASE_IN, EASE_OUT, SPRING_SNAP, nextFrame, wait } from './motion'
import type { CourierPose, PackageStage } from './types'

type Mode = 'idle' | 'shrinking' | 'playing' | 'done'
type RideOrigin = { x: number; y: number }

type ContactSceneProps = {
  /** Shorter morph, no courier — for touch / reduced-motion. */
  lite?: boolean
}

/**
 * Form → idea → crate → sealed brief → letter → (catch → ride) → success.
 */
export function ContactScene({ lite = false }: ContactSceneProps) {
  const { t } = useLocale()
  const f = t.contact.form
  const d = t.contact.delivery

  const stageRef = useRef<HTMLDivElement>(null)
  const successBtnRef = useRef<HTMLButtonElement>(null)
  const [scope, animate] = useAnimate()

  const [mode, setMode] = useState<Mode>('idle')
  const [guestName, setGuestName] = useState('')
  const [stage, setStage] = useState<PackageStage>('idea')
  const [showPkg, setShowPkg] = useState(false)
  const [pkgHidden, setPkgHidden] = useState(false)
  const [showFallLetter, setShowFallLetter] = useState(false)
  const [showBoy, setShowBoy] = useState(false)
  const [boyPose, setBoyPose] = useState<CourierPose>('idle')
  const [boyHasLetter, setBoyHasLetter] = useState(false)
  const [ride, setRide] = useState<RideOrigin | null>(null)
  const playingRef = useRef(false)
  const cancelledRef = useRef(false)

  const labels = {
    cargo: d.cargo,
    idea: d.idea,
    handleCare: d.handleCare,
    brandMark: d.brandMark,
  }

  const liveStatus =
    mode === 'shrinking' || mode === 'playing'
      ? d.statusPlaying
      : mode === 'done'
        ? d.statusDone
        : ''

  const clearActors = useCallback(() => {
    setRide(null)
    setShowBoy(false)
    setShowPkg(false)
    setShowFallLetter(false)
    setPkgHidden(false)
    setBoyHasLetter(false)
    setBoyPose('idle')
  }, [])

  const reset = useCallback(() => {
    cancelledRef.current = false
    playingRef.current = false
    setMode('idle')
    setGuestName('')
    setStage('idea')
    clearActors()
  }, [clearActors])

  const finish = useCallback(() => {
    clearActors()
    setMode('done')
    playingRef.current = false
  }, [clearActors])

  const skip = useCallback(() => {
    if (mode !== 'shrinking' && mode !== 'playing') return
    cancelledRef.current = true
    finish()
  }, [finish, mode])

  useEffect(() => {
    if (mode !== 'done') return
    const id = window.setTimeout(() => successBtnRef.current?.focus(), 80)
    return () => window.clearTimeout(id)
  }, [mode])

  const aborted = () => cancelledRef.current

  const play = useCallback(
    async (name: string) => {
      if (playingRef.current) return
      playingRef.current = true
      cancelledRef.current = false
      setGuestName(name.trim().split(/\s+/)[0] || '')
      setMode('shrinking')

      setStage('idea')
      setPkgHidden(false)
      setShowPkg(true)
      await nextFrame()
      await nextFrame()
      if (aborted()) return

      const wrap = scope.current?.querySelector(
        '.delivery-pkg-wrap',
      ) as HTMLElement | null
      if (wrap) {
        wrap.style.opacity = '0'
        wrap.style.transform = 'translate3d(0, 20px, 0) scale(0.2)'
        wrap.style.filter = 'blur(8px)'
      }

      try {
        const formDur = lite ? 0.7 : 1.15
        await Promise.all([
          animate(
            '.delivery-form',
            {
              scale: [1, 1.015, 0.92, 0.55, 0.2],
              opacity: [1, 1, 0.85, 0.35, 0],
              filter: [
                'blur(0px)',
                'blur(0px)',
                'blur(1px)',
                'blur(6px)',
                'blur(12px)',
              ],
            },
            {
              duration: formDur,
              times: [0, 0.12, 0.4, 0.72, 1],
              ease: EASE_OUT,
            },
          ),
          animate(
            '.delivery-pkg-wrap',
            {
              opacity: [0, 0, 0.25, 0.85, 1],
              scale: [0.2, 0.25, 0.55, 0.92, 1],
              y: [20, 16, 8, 2, 0],
              filter: [
                'blur(8px)',
                'blur(6px)',
                'blur(3px)',
                'blur(0px)',
                'blur(0px)',
              ],
            },
            {
              duration: formDur,
              times: [0, 0.28, 0.52, 0.78, 1],
              ease: EASE_OUT,
            },
          ),
        ])
        if (aborted()) return

        await animate(
          '.delivery-pkg-wrap',
          { scale: [1, 1.06, 1], rotate: [0, -2, 0] },
          { duration: lite ? 0.4 : 0.7, times: [0, 0.45, 1], ease: EASE_OUT },
        )
        if (aborted()) return

        setMode('playing')
        await nextFrame()
        if (aborted()) return

        // Idea → box
        await animate(
          '.delivery-pkg-wrap',
          {
            scale: [1, 0.88, 1],
            rotate: [0, 4, 0],
            filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
          },
          { duration: lite ? 0.35 : 0.55, times: [0, 0.45, 1], ease: EASE_OUT },
        )
        if (aborted()) return
        setStage('box')
        await animate(
          '.delivery-pkg-wrap',
          { scale: [0.96, 1.03, 1], y: [4, -4, 0] },
          { duration: lite ? 0.55 : 0.95, times: [0, 0.55, 1], ease: EASE_OUT },
        )
        if (aborted()) return
        await wait(lite ? 120 : 280)
        if (aborted()) return

        // Box → gift
        await animate(
          '.delivery-pkg-wrap',
          {
            scale: [1, 0.9, 1.02, 1],
            rotate: [0, -3, 1.5, 0],
            filter: ['blur(0px)', 'blur(1.5px)', 'blur(0px)', 'blur(0px)'],
          },
          { duration: lite ? 0.4 : 0.62, times: [0, 0.35, 0.7, 1], ease: EASE_OUT },
        )
        if (aborted()) return
        setStage('gift')
        await wait(lite ? 280 : 720)
        if (aborted()) return

        // Gift → letter
        await animate(
          '.delivery-pkg-wrap',
          {
            scaleX: [1, 1.1, 1],
            scaleY: [1, 0.78, 1],
            rotate: [0, 2, 0],
          },
          { duration: lite ? 0.35 : 0.55, times: [0, 0.4, 1], ease: EASE_OUT },
        )
        if (aborted()) return
        setStage('letter')
        await wait(lite ? 220 : 560)
        if (aborted()) return

        if (lite) {
          // Lite: letter lifts briefly, then success — no courier
          await animate(
            '.delivery-pkg-wrap',
            {
              y: [0, -20, -40],
              scale: [1, 0.94, 0.88],
              opacity: [1, 1, 0],
            },
            { duration: 0.55, times: [0, 0.45, 1], ease: EASE_OUT },
          )
          if (aborted()) return
          finish()
          return
        }

        // Full: letter lifts → catch → ride
        await animate(
          '.delivery-pkg-wrap',
          {
            y: [0, -28, -64],
            scale: [1, 0.94, 0.88],
            rotate: [0, -3, -8],
          },
          { duration: 0.7, times: [0, 0.45, 1], ease: EASE_OUT },
        )
        if (aborted()) return

        setShowFallLetter(true)
        await nextFrame()
        setPkgHidden(true)
        await wait(40)
        if (aborted()) return

        setShowBoy(true)
        setBoyPose('lookUp')
        await nextFrame()
        if (aborted()) return
        await animate(
          '.delivery-boy-wrap',
          { x: 0, opacity: 1 },
          { type: 'spring', stiffness: 180, damping: 22, mass: 1.15 },
        )
        if (aborted()) return
        await wait(220)
        if (aborted()) return

        setBoyPose('catch')
        await animate(
          '.delivery-fall-letter',
          {
            x: [0, 6, 36],
            y: [-64, -88, 52],
            rotate: [-8, 12, -20, 8],
            scale: [0.88, 0.84, 0.68],
          },
          {
            duration: 0.85,
            times: [0, 0.3, 1],
            ease: [EASE_OUT, EASE_IN],
          },
        )
        if (aborted()) return

        setBoyHasLetter(true)
        setShowFallLetter(false)
        setBoyPose('hold')

        await Promise.all([
          animate(
            '.delivery-boy-wrap',
            {
              y: [0, 12, -4, 0],
              scaleY: [1, 0.9, 1.04, 1],
              scaleX: [1, 1.06, 0.97, 1],
            },
            { duration: 0.45, times: [0, 0.28, 0.62, 1], ease: EASE_OUT },
          ),
          animate(
            '.delivery-impact',
            { scale: [0.2, 1], opacity: [0, 1, 0] },
            { duration: 0.5, times: [0, 0.35, 1], ease: EASE_OUT },
          ),
        ])
        if (aborted()) return
        await wait(360)
        if (aborted()) return

        await animate(
          '.delivery-boy-wrap',
          { x: [0, -18], rotate: [0, -6] },
          { duration: 0.32, ease: EASE_IN },
        )
        if (aborted()) return

        const boyEl = scope.current?.querySelector(
          '.delivery-boy-wrap',
        ) as HTMLElement | null
        const rect = boyEl?.getBoundingClientRect()
        const origin: RideOrigin = rect
          ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          : {
              x: window.innerWidth * 0.55,
              y: (stageRef.current?.getBoundingClientRect().top ?? 200) + 220,
            }

        setBoyPose('ride')
        setRide(origin)
        setShowBoy(false)
        setShowPkg(false)
        await wait(2300)
        if (aborted()) return

        finish()
      } catch {
        if (!cancelledRef.current) finish()
      } finally {
        if (!cancelledRef.current) playingRef.current = false
      }
    },
    [animate, finish, lite, scope],
  )

  const showForm = mode === 'idle' || mode === 'shrinking'
  const showSkip = mode === 'shrinking' || mode === 'playing'

  return (
    <div ref={stageRef} className="contact-scene relative w-full">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveStatus}
      </p>

      {showSkip && (
        <button
          type="button"
          onClick={skip}
          className="absolute top-3 right-3 z-50 rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-fog uppercase backdrop-blur-sm transition-colors hover:border-lime/40 hover:text-lime focus-visible:shadow-[0_0_0_3px_rgba(201,242,75,0.25)] focus-visible:outline-none"
        >
          {d.skip}
        </button>
      )}

      <div
        ref={scope}
        className={`relative w-full overflow-visible ${
          showForm && mode === 'idle' ? '' : 'flex min-h-[30rem] items-center justify-center'
        }`}
        aria-busy={showSkip || undefined}
      >
        <AnimatePresence>
          {(mode === 'shrinking' || mode === 'playing') && (
            <motion.div
              key="glow"
              className="pointer-events-none absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgba(201,242,75,0.1),transparent_72%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              aria-hidden
            />
          )}
        </AnimatePresence>

        {showForm && (
          <div
            className={`delivery-form z-10 w-full will-change-transform ${
              mode === 'shrinking'
                ? 'pointer-events-none absolute inset-0 flex items-center justify-center'
                : 'relative'
            }`}
          >
            <div className="w-full">
              <ContactForm
                deferSuccess
                cinematic
                onSuccessSequence={(name) => {
                  void play(name)
                }}
              />
            </div>
          </div>
        )}

        {showPkg && (
          <div
            className="delivery-pkg-wrap absolute inset-0 z-20 flex items-center justify-center will-change-transform"
            style={{
              opacity: 0,
              transform: 'translate3d(0, 20px, 0) scale(0.2)',
              filter: 'blur(8px)',
            }}
            aria-hidden
          >
            <PackageMorph stage={stage} labels={labels} hidden={pkgHidden} />
          </div>
        )}

        {showFallLetter && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <div
              className="delivery-fall-letter will-change-transform"
              style={{
                transform: 'translate3d(0,-64px,0) scale(0.88) rotate(-8deg)',
              }}
            >
              <LetterSprite />
            </div>
          </div>
        )}

        {showBoy && (
          <div className="absolute inset-0 z-40 flex items-end justify-center pb-6" aria-hidden>
            <div className="relative">
              <div
                className="delivery-boy-wrap will-change-transform"
                style={{ transform: 'translate3d(-210px,0,0)', opacity: 0 }}
              >
                <CourierBoy pose={boyPose} withLetter={boyHasLetter} />
              </div>
              <div
                className="delivery-impact pointer-events-none absolute top-8 left-[60%] h-12 w-12 -translate-x-1/2"
                style={{ transform: 'scale(0)', opacity: 0 }}
              >
                <svg viewBox="0 0 48 48" className="h-full w-full">
                  {[0, 45, 90, 135].map((deg) => (
                    <line
                      key={deg}
                      x1="24"
                      y1="24"
                      x2="24"
                      y2="6"
                      stroke="#c9f24b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      transform={`rotate(${deg} 24 24)`}
                    />
                  ))}
                  <circle cx="24" cy="24" r="3" fill="#dcff5e" />
                </svg>
              </div>
              <div className="pointer-events-none absolute -bottom-0.5 left-1/2 h-2.5 w-24 -translate-x-1/2 rounded-full bg-black/45 blur-[3px]" />
            </div>
          </div>
        )}

        <AnimatePresence>
          {mode === 'done' && (
            <motion.div
              key="success"
              className="relative z-20 w-full"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <SuccessPanel
                titlePre={f.successTitlePre}
                titleAccent={f.successTitleAccent}
                body={f.successBody.replace(
                  '{name}',
                  guestName || f.successFallbackName,
                )}
                again={f.successAgain}
                onAgain={reset}
                againRef={successBtnRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {ride &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden>
            <motion.div
              className="absolute will-change-transform"
              style={{ left: ride.x, top: ride.y }}
              initial={{ x: -18, y: 0, rotate: -6, opacity: 1 }}
              animate={{
                x: [-18, 80, Math.max(window.innerWidth - ride.x + 140, 520)],
                y: [0, -14, -30, -18],
                rotate: [-6, -1, 5, 2],
                opacity: [1, 1, 1, 0],
              }}
              transition={{
                duration: 2.25,
                times: [0, 0.22, 0.86, 1],
                ease: [0.16, 0.75, 0.2, 1],
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <CourierBoy pose="ride" withLetter />
              </div>
            </motion.div>

            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-lime"
                style={{
                  top: ride.y - 20 + i * 10,
                  left: ride.x - 16,
                  width: i % 2 === 0 ? 5 : 3,
                  height: i % 2 === 0 ? 5 : 3,
                  boxShadow: '0 0 10px rgba(201,242,75,0.7)',
                }}
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: [0, 140 + i * 60, 280 + i * 90],
                  opacity: [0, 0.9, 0],
                  scale: [0.4, 1, 0.2],
                }}
                transition={{
                  duration: 1,
                  delay: 0.03 + i * 0.05,
                  repeat: 1,
                  ease: EASE_OUT,
                }}
              />
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}

function SuccessPanel({
  titlePre,
  titleAccent,
  body,
  again,
  onAgain,
  againRef,
}: {
  titlePre: string
  titleAccent: string
  body: string
  again: string
  onAgain: () => void
  againRef: RefObject<HTMLButtonElement | null>
}) {
  return (
    <div
      className="relative flex min-h-[28rem] w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_32px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-[10px]"
      role="status"
    >
      <span
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent"
        aria-hidden
      />
      <motion.span
        className="flex h-16 w-16 items-center justify-center rounded-full border border-lime/40 bg-lime/10 shadow-[0_0_48px_-8px_rgba(201,242,75,0.5)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...SPRING_SNAP, delay: 0.08 }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="var(--color-lime)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.22, ease: EASE_OUT }}
          />
        </svg>
      </motion.span>
      <motion.h3
        className="display-xl mt-8 text-3xl text-bone"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5, ease: EASE_OUT }}
      >
        {titlePre} <span className="serif-accent text-lime">{titleAccent}</span>
      </motion.h3>
      <motion.p
        className="mt-4 max-w-xs text-sm leading-relaxed text-fog"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT }}
      >
        {body}
      </motion.p>
      <motion.button
        ref={againRef}
        type="button"
        onClick={onAgain}
        className="link-sweep mt-10 font-mono text-[11px] tracking-[0.2em] text-fog uppercase transition-colors hover:text-bone"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.58 }}
      >
        {again}
      </motion.button>
    </div>
  )
}
