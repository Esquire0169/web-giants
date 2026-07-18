import { motion } from 'motion/react'
import type { CourierPose } from './types'
import { EASE_OUT } from './motion'

type CourierBoyProps = {
  pose?: CourierPose
  withLetter?: boolean
  className?: string
}

/**
 * Night courier — cap, lime vest, radio pack. Distinct from a generic scooter kid.
 */
export function CourierBoy({
  pose = 'idle',
  withLetter = false,
  className = '',
}: CourierBoyProps) {
  const riding = pose === 'ride'
  const looking = pose === 'lookUp' || pose === 'catch'
  const catching = pose === 'catch'

  return (
    <motion.div
      className={`delivery-boy relative h-[10.5rem] w-[9.5rem] will-change-transform ${className}`}
      aria-hidden
      animate={{
        y: riding ? [0, -4, 0] : catching ? [0, 10, -5, 0] : 0,
        rotate: catching ? [0, -5, 4, 0] : riding ? [0, -1.5, 1.5, 0] : 0,
        scaleY: catching ? [1, 0.9, 1.05, 1] : 1,
        scaleX: catching ? [1, 1.07, 0.96, 1] : 1,
      }}
      transition={
        riding
          ? {
              y: { duration: 0.34, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
            }
          : { duration: 0.45, ease: EASE_OUT }
      }
    >
      <svg viewBox="0 0 140 160" className="h-full w-full overflow-visible">
        <defs>
          <style>{`
            .cw { transform-origin: center; transform-box: fill-box; }
            .cw-spin { animation: cwspin 0.38s linear infinite; }
            @keyframes cwspin { to { transform: rotate(360deg); } }
          `}</style>
          <filter id="boySoft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        <g filter="url(#boySoft)">
          {/* board / scooter */}
          <rect x="16" y="120" width="96" height="6" rx="3" fill="#1a1c20" />
          <rect x="98" y="76" width="4" height="48" rx="2" fill="#2e3238" />
          <rect x="82" y="72" width="26" height="5" rx="2" fill="#c9f24b" />
          <circle cx="88" cy="74" r="2" fill="#0d0e10" />

          <g className={`cw ${riding ? 'cw-spin' : ''}`}>
            <circle cx="32" cy="134" r="13" fill="#0e1012" stroke="#c9f24b" strokeWidth="2.4" />
            <circle cx="32" cy="134" r="4" fill="#c9f24b" opacity="0.35" />
            <circle cx="32" cy="134" r="2.5" fill="#c9f24b" />
          </g>
          <g className={`cw ${riding ? 'cw-spin' : ''}`} style={{ animationDuration: '0.46s' }}>
            <circle cx="104" cy="134" r="13" fill="#0e1012" stroke="#c9f24b" strokeWidth="2.4" />
            <circle cx="104" cy="134" r="4" fill="#c9f24b" opacity="0.35" />
            <circle cx="104" cy="134" r="2.5" fill="#c9f24b" />
          </g>

          {/* radio backpack */}
          <rect x="36" y="56" width="20" height="32" rx="5" fill="#c9f24b" />
          <rect x="40" y="62" width="12" height="6" rx="1.5" fill="#0d0e10" opacity="0.4" />
          <line x1="46" y1="56" x2="46" y2="44" stroke="#c9f24b" strokeWidth="2" />
          <circle cx="46" cy="42" r="2.5" fill="#dcff5e" />

          {/* lime courier vest over dark body */}
          <rect x="54" y="54" width="30" height="38" rx="8" fill="#181a1e" />
          <path d="M56 58h26l-3 28H59z" fill="#c9f24b" opacity="0.88" />
          <rect x="54" y="90" width="12" height="22" rx="4" fill="#25282e" />
          <rect x="72" y="90" width="12" height="22" rx="4" fill="#25282e" />

          <path
            d={looking ? 'M80 60c14-12 28-6 32 6' : 'M82 68c10 4 18 10 22 18'}
            fill="none"
            stroke="#eceae4"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transition: 'd 0.3s cubic-bezier(0.16,1,0.3,1)' }}
          />

          <g
            style={{
              transformOrigin: '70px 40px',
              transform: looking ? 'rotate(-16deg) translateY(-2px)' : undefined,
              transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* messenger cap */}
            <path d="M52 36c2-14 16-18 32-12v8H52z" fill="#1a1c20" />
            <rect x="48" y="36" width="40" height="5" rx="2" fill="#c9f24b" />
            <circle cx="70" cy="44" r="15" fill="#e8c4a2" />
            <circle cx="65" cy="42" r="1.5" fill="#0d0e10" />
            <circle cx="75" cy="42" r="1.5" fill="#0d0e10" />
            <path
              d="M65 49c2 2.4 8 2.4 10 0"
              fill="none"
              stroke="#0d0e10"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>

          {withLetter && (
            <g transform="translate(90 54) rotate(-10)">
              <rect width="34" height="24" rx="3" fill="#f2efe6" stroke="#c9f24b" strokeWidth="1.6" />
              <path d="M0 0 L17 12 L34 0" fill="none" stroke="#1a1c20" strokeWidth="1.1" opacity="0.35" />
              <circle cx="27" cy="17" r="4" fill="#2a320f" />
              <text x="27" y="19" textAnchor="middle" fill="#c9f24b" fontSize="4" fontFamily="monospace">
                WG
              </text>
            </g>
          )}
        </g>
      </svg>
    </motion.div>
  )
}
