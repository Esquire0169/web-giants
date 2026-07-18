import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const BIOS_LINES = [
  'WEB GIANTS BIOS v2.98 — Copyright (C) 1998 Web Giants Corp.',
  'CPU: Intel Pentium II 233MHz',
  'Memory Test: 65536K OK',
  'Detecting IDE drives...',
  'Primary Master: WG340014A (40GB)',
  'Loading WEBGIANTS.SYS...',
  '',
  'Starting Windows 98...',
]

const BOOT_MESSAGES = [
  { text: 'Loading system files...', pct: 12 },
  { text: 'Initializing device drivers...', pct: 28 },
  { text: 'Loading WEBGIANTS.DLL...', pct: 40 },
  { text: 'Starting graphics subsystem...', pct: 55 },
  { text: 'Loading user profile...', pct: 68 },
  { text: 'Applying settings...', pct: 79 },
  { text: 'Starting development services...', pct: 88 },
  { text: 'Preparing desktop...', pct: 96 },
  { text: 'Welcome to Web Giants 98!', pct: 100 },
]

interface Props {
  onComplete: () => void
}

type Phase = 'bios' | 'loading' | 'done'

export default function BootSequence({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('bios')
  const [biosLine, setBiosLine] = useState(0)
  const [bootStep, setBootStep] = useState(0)

  useEffect(() => {
    if (phase === 'bios') {
      if (biosLine < BIOS_LINES.length) {
        const t = setTimeout(() => setBiosLine((l) => l + 1), biosLine === 0 ? 100 : 150)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('loading'), 600)
        return () => clearTimeout(t)
      }
    }
  }, [phase, biosLine])

  useEffect(() => {
    if (phase === 'loading') {
      if (bootStep < BOOT_MESSAGES.length) {
        const t = setTimeout(() => setBootStep((s) => s + 1), 280)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => {
          setPhase('done')
          setTimeout(onComplete, 600)
        }, 500)
        return () => clearTimeout(t)
      }
    }
  }, [phase, bootStep, onComplete])

  const current = BOOT_MESSAGES[Math.min(bootStep, BOOT_MESSAGES.length - 1)]
  const pct = bootStep === 0 ? 0 : (current?.pct ?? 100)

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'bios' && (
          <motion.div
            key="bios"
            className="bios h-full w-full overflow-hidden p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-3xl">
              {BIOS_LINES.slice(0, biosLine).map((line, i) => (
                <div key={i} className={line === '' ? 'h-4' : ''}>
                  {line}
                  {i === biosLine - 1 && <span className="blink">_</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {(phase === 'loading' || phase === 'done') && (
          <motion.div
            key="win98boot"
            className="flex h-full w-full flex-col items-center justify-center"
            style={{ background: '#000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-10 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="grid h-16 w-16 grid-cols-2 gap-1">
                  <div style={{ background: '#ff0000', transform: 'skewX(-8deg)' }} />
                  <div style={{ background: '#00ff00', transform: 'skewX(-8deg)' }} />
                  <div style={{ background: '#0000ff', transform: 'skewX(-8deg)' }} />
                  <div style={{ background: '#ffff00', transform: 'skewX(-8deg)' }} />
                </div>
                <div
                  className="leading-tight font-bold text-white"
                  style={{ fontFamily: 'sans-serif', fontSize: '28px' }}
                >
                  <span style={{ color: '#fff' }}>Web Giants</span>
                  <span style={{ color: '#aaa', fontWeight: 300 }}> 98</span>
                </div>
              </div>
              <div className="font-mono text-xs text-gray-500">Loading...</div>
            </div>

            <div className="mb-4 w-72">
              <div className="win98-progress-track">
                <motion.div
                  className="win98-progress-fill"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.25, ease: 'linear' }}
                />
              </div>
            </div>
            <div className="h-4 font-mono text-xs text-gray-500">
              {bootStep > 0 && bootStep <= BOOT_MESSAGES.length
                ? BOOT_MESSAGES[bootStep - 1].text
                : ''}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
