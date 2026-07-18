import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { APPS, type AppDef } from './apps'
import { Win98Window } from './Win98Window'
import { clampWin, useClock, useFocusTrap, useOutsideClose, TASKBAR_H } from './hooks'

interface WinState {
  open: boolean
  minimized: boolean
  maximized: boolean
  x: number
  y: number
  z: number
}

interface Notice {
  title: string
  text: string
}

interface CtxMenu {
  x: number
  y: number
}

const MOBILE_BREAKPOINT = 640

function initialWindows(): Record<string, WinState> {
  const out: Record<string, WinState> = {}
  APPS.forEach((app, i) => {
    out[app.id] = {
      open: false,
      minimized: false,
      maximized: false,
      x: 80 + i * 32,
      y: 64 + i * 28,
      z: 10,
    }
  })
  return out
}

interface Props {
  onExit: () => void
}

export default function Win98Desktop({ onExit }: Props) {
  const reduced = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)
  const startBtnRef = useRef<HTMLButtonElement>(null)
  const startMenuRef = useRef<HTMLDivElement>(null)
  const ctxMenuRef = useRef<HTMLDivElement>(null)

  const [wins, setWins] = useState<Record<string, WinState>>(initialWindows)
  const [, setTopZ] = useState(20)
  const [startOpen, setStartOpen] = useState(false)
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const lastPointerType = useRef<string>('mouse')

  const time = useClock()
  useFocusTrap(rootRef)

  /* ---------- window manager ---------- */

  const focusWin = useCallback((id: string) => {
    setTopZ((z) => {
      setWins((ws) => ({ ...ws, [id]: { ...ws[id], z: z + 1 } }))
      return z + 1
    })
  }, [])

  const openWin = useCallback(
    (id: string) => {
      const app = APPS.find((a) => a.id === id)
      if (!app) return
      setTopZ((z) => {
        setWins((ws) => {
          const cur = ws[id]
          const small = window.innerWidth < MOBILE_BREAKPOINT
          const pos = clampWin(cur.x, cur.y, app.width)
          return {
            ...ws,
            [id]: {
              ...cur,
              open: true,
              minimized: false,
              maximized: cur.open ? cur.maximized : small,
              x: pos.x,
              y: pos.y,
              z: z + 1,
            },
          }
        })
        return z + 1
      })
      setStartOpen(false)
      setCtxMenu(null)
    },
    [],
  )

  const closeWin = useCallback((id: string) => {
    setWins((ws) => ({ ...ws, [id]: { ...ws[id], open: false, maximized: false } }))
  }, [])

  const minimizeWin = useCallback((id: string) => {
    setWins((ws) => ({ ...ws, [id]: { ...ws[id], minimized: true } }))
  }, [])

  const toggleMax = useCallback(
    (id: string) => {
      setWins((ws) => ({ ...ws, [id]: { ...ws[id], maximized: !ws[id].maximized } }))
      focusWin(id)
    },
    [focusWin],
  )

  const moveWin = useCallback((id: string, x: number, y: number) => {
    setWins((ws) => ({ ...ws, [id]: { ...ws[id], x, y } }))
  }, [])

  const openList = useMemo(
    () => APPS.filter((a) => wins[a.id].open),
    [wins],
  )

  const activeId = useMemo(() => {
    let best: string | null = null
    let bestZ = -1
    for (const a of APPS) {
      const w = wins[a.id]
      if (w.open && !w.minimized && w.z > bestZ) {
        best = a.id
        bestZ = w.z
      }
    }
    return best
  }, [wins])

  /* keep windows inside the viewport on resize */
  useEffect(() => {
    const onResize = () => {
      setWins((ws) => {
        const next = { ...ws }
        for (const app of APPS) {
          const w = next[app.id]
          const pos = clampWin(w.x, w.y, app.width)
          next[app.id] = { ...w, x: pos.x, y: pos.y }
        }
        return next
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ---------- menus ---------- */

  useOutsideClose(startOpen, [startMenuRef, startBtnRef], () => setStartOpen(false))
  useOutsideClose(ctxMenu !== null, [ctxMenuRef], () => setCtxMenu(null))

  /* focus first item when a menu opens */
  useEffect(() => {
    if (startOpen) startMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [startOpen])
  useEffect(() => {
    if (ctxMenu) ctxMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [ctxMenu])

  function menuKeyNav(e: React.KeyboardEvent, container: HTMLElement | null) {
    if (!container || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return
    e.preventDefault()
    const items = Array.from(container.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    const idx = items.indexOf(document.activeElement as HTMLElement)
    const next =
      e.key === 'ArrowDown'
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length]
    next?.focus()
  }

  /* ---------- escape chain ---------- */

  function onRootKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    if (notice) return setNotice(null)
    if (ctxMenu) return setCtxMenu(null)
    if (startOpen) {
      setStartOpen(false)
      startBtnRef.current?.focus()
      return
    }
    if (welcomeOpen) return setWelcomeOpen(false)
    if (activeId) return closeWin(activeId)
    onExit()
  }

  /* ---------- desktop icons ---------- */

  function iconClick(app: AppDef, e: React.MouseEvent) {
    // keyboard activation (Enter/Space) reports detail === 0; touch taps open directly
    if (e.detail === 0 || lastPointerType.current === 'touch') {
      openWin(app.id)
    } else {
      setSelectedIcon(app.id)
    }
  }

  const startItems = [...APPS.map((a) => ({ icon: a.icon, label: a.title.split(' — ')[0], action: () => openWin(a.id) }))]

  const menuTransition = reduced ? { duration: 0 } : { duration: 0.15 }

  return (
    <div
      ref={rootRef}
      className="win98 crt fixed inset-0 overflow-hidden"
      style={{ cursor: 'default' }}
      role="dialog"
      aria-modal="true"
      aria-label="Web Giants 98 retro desktop. Press Escape to close windows and exit."
      tabIndex={-1}
      onKeyDown={onRootKeyDown}
    >
      {/* desktop background: right-click for context menu, click clears selection */}
      <div
        className="absolute inset-0"
        data-desktop
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).dataset.desktop === undefined) return
          e.preventDefault()
          setStartOpen(false)
          setCtxMenu({
            x: Math.min(e.clientX, window.innerWidth - 190),
            y: Math.min(e.clientY, window.innerHeight - TASKBAR_H - 150),
          })
        }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).dataset.desktop !== undefined) setSelectedIcon(null)
        }}
      />

      {/* desktop icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-3">
        {APPS.map((app) => (
          <button
            key={app.id}
            className="win98-icon flex w-24 flex-col items-center gap-1 p-1.5"
            data-selected={selectedIcon === app.id ? '' : undefined}
            aria-label={`Open ${app.title}`}
            onPointerDown={(e) => {
              lastPointerType.current = e.pointerType
            }}
            onClick={(e) => iconClick(app, e)}
            onDoubleClick={() => openWin(app.id)}
          >
            <span style={{ fontSize: 32 }} aria-hidden>
              {app.icon}
            </span>
            <span
              className="text-center leading-tight text-white"
              style={{ fontSize: 11, textShadow: '1px 1px 2px #000' }}
            >
              {app.title.split(' — ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* welcome dialog */}
      <AnimatePresence>
        {welcomeOpen && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={menuTransition}
            className="win98-panel absolute shadow-xl"
            style={{
              left: '50%',
              top: '45%',
              transform: 'translate(-50%, -50%)',
              width: 'min(420px, calc(100vw - 16px))',
              zIndex: 9000,
            }}
            role="dialog"
            aria-label="Welcome to Web Giants 98"
          >
            <div className="win98-titlebar">
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 14 }} aria-hidden>
                  💡
                </span>
                <span>Welcome to Web Giants 98!</span>
              </div>
              <button
                onClick={() => setWelcomeOpen(false)}
                className="win98-btn win98-ctl !min-w-0 !p-0 leading-none font-bold text-black"
                aria-label="Close welcome dialog"
              >
                ✕
              </button>
            </div>
            <div className="p-5" style={{ fontSize: 12 }}>
              <div className="mb-4 flex items-start gap-4">
                <div style={{ fontSize: 36 }} aria-hidden>
                  🎉
                </div>
                <div>
                  <div className="mb-1 text-sm font-bold">You found the easter egg!</div>
                  <div className="leading-relaxed text-gray-700">
                    Welcome to <strong>Web Giants 98</strong> — a retro version of our site from an
                    alternate universe where the internet peaked in 1998.
                  </div>
                </div>
              </div>
              <div className="win98-panel-inset mb-4 p-2 text-xs leading-loose">
                💡 Tip: open desktop icons with double-click, tap, or Enter.
                <br />
                🗂️ Cases, Services, Studio & Mail pull live site content.
                <br />
                🐍 Snake.exe is on the desktop — arrows / WASD, Space to pause.
              </div>
              <div className="flex justify-end gap-2">
                <button className="win98-btn font-bold" onClick={() => setWelcomeOpen(false)} autoFocus>
                  OK
                </button>
                <button className="win98-btn" onClick={onExit}>
                  Exit to modern site
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* windows */}
      {APPS.map((app) => {
        const w = wins[app.id]
        if (!w.open || w.minimized) return null
        return (
          <Win98Window
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            rect={{ x: w.x, y: w.y, w: app.width }}
            z={w.z}
            maximized={w.maximized}
            active={activeId === app.id}
            onClose={() => closeWin(app.id)}
            onMin={() => minimizeWin(app.id)}
            onToggleMax={() => toggleMax(app.id)}
            onFocus={() => focusWin(app.id)}
            onMove={(x, y) => moveWin(app.id, x, y)}
          >
            {app.render({
              notify: (title, text) => setNotice({ title, text }),
              close: () => closeWin(app.id),
            })}
          </Win98Window>
        )
      })}

      {/* system dialog (replaces alert) */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={menuTransition}
            className="win98-panel absolute shadow-xl"
            style={{
              left: '50%',
              top: '40%',
              transform: 'translate(-50%, -50%)',
              width: 'min(340px, calc(100vw - 16px))',
              zIndex: 9500,
            }}
            role="alertdialog"
            aria-label={notice.title}
          >
            <div className="win98-titlebar">
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 14 }} aria-hidden>
                  ⚠️
                </span>
                <span>{notice.title}</span>
              </div>
              <button
                onClick={() => setNotice(null)}
                className="win98-btn win98-ctl !min-w-0 !p-0 leading-none font-bold text-black"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <div className="p-4 text-center" style={{ fontSize: 12 }}>
              <p className="mb-4 leading-relaxed whitespace-pre-line">{notice.text}</p>
              <button className="win98-btn font-bold" onClick={() => setNotice(null)} autoFocus>
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* context menu */}
      <AnimatePresence>
        {ctxMenu && (
          <motion.div
            ref={ctxMenuRef}
            initial={{ opacity: reduced ? 0 : 1, scale: reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={menuTransition}
            className="win98-panel absolute w-44 py-0.5 shadow-xl"
            style={{ left: ctxMenu.x, top: ctxMenu.y, zIndex: 9600, fontSize: 12 }}
            role="menu"
            aria-label="Desktop context menu"
            onKeyDown={(e) => menuKeyNav(e, ctxMenuRef.current)}
          >
            {[
              {
                label: 'Arrange Icons',
                action: () => setNotice({ title: 'Desktop', text: 'Icons are already perfectly arranged.' }),
              },
              {
                label: 'Refresh',
                action: () => setNotice({ title: 'Desktop', text: 'Refreshed. Everything is still 1998.' }),
              },
              { label: 'Properties', action: () => openWin('about') },
              { label: 'Exit to 2026', action: onExit },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <button
                  role="menuitem"
                  className="win98-menuitem"
                  onClick={() => {
                    setCtxMenu(null)
                    item.action()
                  }}
                >
                  {item.label}
                </button>
                {i === arr.length - 2 && <div className="mx-1 my-0.5 border-t border-gray-400" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* taskbar */}
      <div className="win98-taskbar">
        <div className="relative">
          <button
            ref={startBtnRef}
            className="win98-start-btn"
            onClick={() => setStartOpen((s) => !s)}
            aria-haspopup="menu"
            aria-expanded={startOpen}
            aria-controls="win98-start-menu"
          >
            <div className="grid h-4 w-4 grid-cols-2 gap-0.5" aria-hidden>
              <div style={{ background: '#ff0000' }} />
              <div style={{ background: '#00ff00' }} />
              <div style={{ background: '#0000ff' }} />
              <div style={{ background: '#ffff00' }} />
            </div>
            <span>Start</span>
          </button>
          <AnimatePresence>
            {startOpen && (
              <motion.div
                ref={startMenuRef}
                id="win98-start-menu"
                initial={reduced ? { opacity: 0 } : { scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={menuTransition}
                className="win98-panel absolute bottom-full left-0 z-[9999] w-52"
                style={{ fontSize: 12 }}
                role="menu"
                aria-label="Start menu"
                onKeyDown={(e) => menuKeyNav(e, startMenuRef.current)}
              >
                <div className="flex">
                  <div
                    aria-hidden
                    style={{
                      background: '#808080',
                      color: '#fff',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      padding: '8px 4px',
                      fontSize: 14,
                      fontWeight: 'bold',
                      letterSpacing: 2,
                    }}
                  >
                    Web Giants 98
                  </div>
                  <div className="flex-1 py-0.5">
                    {startItems.map((item) => (
                      <button key={item.label} role="menuitem" className="win98-menuitem" onClick={item.action}>
                        <span aria-hidden>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <div className="mx-1 my-0.5 border-t border-gray-400" />
                    <button role="menuitem" className="win98-menuitem" onClick={onExit}>
                      <span aria-hidden>🚪</span>
                      <span>Exit to 2026</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="win98-panel-inset mx-1 h-6 w-px" aria-hidden />

        {/* open windows */}
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {openList.map((app) => {
            const w = wins[app.id]
            const isActive = activeId === app.id
            return (
              <button
                key={app.id}
                className={`win98-btn max-w-[130px] overflow-hidden text-xs text-ellipsis whitespace-nowrap !px-3 !py-0.5 ${
                  isActive ? 'win98-btn--pressed' : ''
                }`}
                aria-pressed={isActive}
                aria-label={`${app.title}${w.minimized ? ', minimized' : isActive ? ', active' : ''}`}
                onClick={() => {
                  if (w.minimized) {
                    setWins((ws) => ({ ...ws, [app.id]: { ...ws[app.id], minimized: false } }))
                    focusWin(app.id)
                  } else if (isActive) {
                    minimizeWin(app.id)
                  } else {
                    focusWin(app.id)
                  }
                }}
              >
                <span aria-hidden>{app.icon}</span> {app.title.split(' — ')[0]}
              </button>
            )
          })}
        </div>

        {/* system tray */}
        <div className="win98-panel-inset ml-auto flex shrink-0 items-center gap-2 px-2 py-0.5 font-mono text-xs">
          <span aria-hidden title="Connected: 56k modem" className="cursor-help">
            📶
          </span>
          <span aria-hidden title="Volume: dial-up noises" className="cursor-help">
            🔊
          </span>
          <time>{time}</time>
        </div>
      </div>
    </div>
  )
}
