import { AnimatePresence, motion } from 'motion/react'
import type { PackageStage } from './types'
import { EASE_OUT, SPRING_SNAP } from './motion'

const SIZE: Record<PackageStage, { w: number; h: number; r: number }> = {
  idea: { w: 92, h: 92, r: 999 },
  box: { w: 228, h: 196, r: 16 },
  gift: { w: 184, h: 184, r: 24 },
  letter: { w: 156, h: 112, r: 12 },
}

export type DeliveryLabels = {
  cargo: string
  idea: string
  handleCare: string
  brandMark: string
}

type PackageMorphProps = {
  stage: PackageStage
  labels: DeliveryLabels
  hidden?: boolean
  className?: string
}

/**
 * Continuous prop: idea mark → crate → sealed brief → letter.
 */
export function PackageMorph({
  stage,
  labels,
  hidden = false,
  className = '',
}: PackageMorphProps) {
  const size = SIZE[stage]

  return (
    <motion.div
      className={`delivery-pkg relative origin-center ${className}`}
      initial={false}
      animate={{
        width: size.w,
        height: size.h,
        borderRadius: size.r,
        opacity: hidden ? 0 : 1,
        scale: hidden ? 0.5 : 1,
      }}
      transition={{
        width: { duration: 0.9, ease: EASE_OUT },
        height: { duration: 0.9, ease: EASE_OUT },
        borderRadius: { duration: 0.85, ease: EASE_OUT },
        opacity: { duration: 0.32, ease: EASE_OUT },
        scale: { duration: 0.32, ease: EASE_OUT },
      }}
      style={{
        boxShadow:
          stage === 'idea'
            ? '0 0 52px -6px rgba(201,242,75,0.55), 0 16px 40px -18px rgba(0,0,0,0.55)'
            : stage === 'letter'
              ? '0 16px 36px -14px rgba(0,0,0,0.65)'
              : '0 28px 56px -22px rgba(0,0,0,0.88)',
      }}
    >
      <AnimatePresence mode="sync" initial={false}>
        {stage === 'idea' && <IdeaFace key="idea" />}
        {stage === 'box' && <BoxFace key="box" labels={labels} />}
        {stage === 'gift' && <GiftFace key="gift" />}
        {stage === 'letter' && <LetterFace key="letter" />}
      </AnimatePresence>
    </motion.div>
  )
}

/** Geometric lightbulb — symbol of an idea. */
function IdeaFace() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-visible rounded-full border border-lime/35 bg-[#101208]/90"
      initial={{ opacity: 0, scale: 0.55 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.12, filter: 'blur(5px)' }}
      transition={{ duration: 0.65, ease: EASE_OUT }}
    >
      <motion.span
        className="absolute inset-[-22%] rounded-full bg-[radial-gradient(circle,rgba(201,242,75,0.32),transparent_70%)]"
        animate={{ opacity: [0.45, 0.95, 0.45], scale: [0.94, 1.08, 0.94] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* orbiting sparks */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 120, 240].map((deg) => (
          <span
            key={deg}
            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(201,242,75,0.9)]"
            style={{
              transform: `rotate(${deg}deg) translateY(-40px) translate(-50%, -50%)`,
            }}
          />
        ))}
      </motion.div>

      <svg viewBox="0 0 80 80" className="relative h-[70%] w-[70%]">
        <motion.path
          d="M40 14c-10 0-18 7.4-18 18 0 6.6 3.2 11.2 7.2 14.6V54h21.6V46.6c4-3.4 7.2-8 7.2-14.6 0-10.6-8-18-18-18z"
          fill="#161a12"
          stroke="#c9f24b"
          strokeWidth="2.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: EASE_OUT }}
        />
        {/* diamond filament */}
        <motion.path
          d="M34 31 L40 23 L46 31 L40 39 Z"
          fill="none"
          stroke="#c9f24b"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, ...SPRING_SNAP }}
          style={{ transformOrigin: '40px 31px' }}
        />
        <motion.circle
          cx="40"
          cy="31"
          r="2.4"
          fill="#dcff5e"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.3, repeat: Infinity }}
        />
        <path
          d="M33 54h14M34 58h12M36 62h8"
          stroke="#8a8d94"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {[-45, -15, 15, 45].map((deg, i) => (
          <motion.line
            key={deg}
            x1="40"
            y1="12"
            x2="40"
            y2="5"
            stroke="#c9f24b"
            strokeWidth="1.7"
            strokeLinecap="round"
            style={{
              transformOrigin: '40px 40px',
              transform: `rotate(${deg}deg)`,
            }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.7, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </svg>
    </motion.div>
  )
}

function BoxFace({ labels }: { labels: DeliveryLabels }) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[inherit] border border-lime/25 bg-gradient-to-br from-[#1a1e16] via-[#121510] to-[#0a0c09]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(3px)' }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,242,75,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(201,242,75,0.35) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {[
        'top-3 left-3 border-t-2 border-l-2',
        'top-3 right-3 border-t-2 border-r-2',
        'bottom-3 left-3 border-b-2 border-l-2',
        'bottom-3 right-3 border-b-2 border-r-2',
      ].map((cls) => (
        <span key={cls} className={`absolute h-4 w-4 border-lime/70 ${cls}`} />
      ))}
      <motion.div
        className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 origin-left bg-lime/50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
      />
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease: EASE_OUT }}
      >
        <span className="font-mono text-[9px] tracking-[0.32em] text-lime/80 uppercase">
          {labels.cargo}
        </span>
        <span className="display-xl text-xl tracking-wide text-bone/90">
          {labels.idea}
        </span>
        <span className="font-mono text-[8px] tracking-[0.2em] text-dim uppercase">
          {labels.handleCare}
        </span>
      </motion.div>
    </motion.div>
  )
}

function GiftFace() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[inherit] border border-white/15 bg-gradient-to-br from-[#1c1814] via-[#14110e] to-[#0c0a08]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,242,75,0.12),transparent_55%)]" />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        style={{
          background:
            'linear-gradient(135deg, transparent 42%, rgba(201,242,75,0.55) 49%, rgba(201,242,75,0.55) 51%, transparent 58%)',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-lime/50 bg-[#2a320f] shadow-[0_0_28px_-4px_rgba(201,242,75,0.55)]"
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.14 }}
      >
        <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-lime">
          WG
        </span>
      </motion.div>
    </motion.div>
  )
}

function LetterFace() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[inherit] border border-white/25 bg-gradient-to-br from-[#f2efe6] via-[#e6e0d2] to-[#d4cdb8]"
      initial={{ opacity: 0, scaleY: 0.78 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[48%] origin-top"
        initial={{ scaleY: 0.2 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.05 }}
        style={{
          background:
            'linear-gradient(165deg, rgba(201,242,75,0.45), transparent 60%), #ebe5d6',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        }}
      />
      <div className="absolute right-4 bottom-4 left-4 space-y-1.5 opacity-40">
        <span className="block h-0.5 w-[72%] rounded bg-ink/50" />
        <span className="block h-0.5 w-[58%] rounded bg-ink/40" />
        <span className="block h-0.5 w-[64%] rounded bg-ink/35" />
      </div>
      <motion.div
        className="absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#2a320f] font-mono text-[8px] tracking-wide text-lime"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...SPRING_SNAP, delay: 0.24 }}
      >
        WG
      </motion.div>
    </motion.div>
  )
}

export function LetterSprite({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative h-[4.35rem] w-[6.1rem] overflow-hidden rounded-[10px] border border-white/35 bg-gradient-to-br from-[#f2efe6] via-[#e6e0d2] to-[#d4cdb8] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.7)] ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            'linear-gradient(165deg, rgba(201,242,75,0.45), transparent 60%), #ebe5d6',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        }}
      />
      <span className="absolute right-1.5 bottom-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2a320f] font-mono text-[7px] text-lime">
        WG
      </span>
    </div>
  )
}
