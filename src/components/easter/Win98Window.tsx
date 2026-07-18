import { useRef, type ReactNode } from 'react'
import { clampWin, usePointerDrag, TASKBAR_H } from './hooks'

export interface WinRect {
  x: number
  y: number
  w: number
}

interface Props {
  id: string
  title: string
  icon: string
  rect: WinRect
  z: number
  maximized: boolean
  active: boolean
  onClose: () => void
  onMin: () => void
  onToggleMax: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  children: ReactNode
}

const ARROW_STEP = 16

export function Win98Window({
  id,
  title,
  icon,
  rect,
  z,
  maximized,
  active,
  onClose,
  onMin,
  onToggleMax,
  onFocus,
  onMove,
  children,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const dragBase = useRef({ x: 0, y: 0, w: 0 })

  const onTitlePointerDown = usePointerDrag({
    onStart: () => {
      onFocus()
      const w = frameRef.current?.getBoundingClientRect().width ?? rect.w
      dragBase.current = { x: rect.x, y: rect.y, w }
    },
    onMove: (dx, dy) => {
      if (maximized) return
      const { x, y, w } = dragBase.current
      const next = clampWin(x + dx, y + dy, w)
      onMove(next.x, next.y)
    },
  })

  function onTitleKeyDown(e: React.KeyboardEvent) {
    if (maximized) return
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-ARROW_STEP, 0],
      ArrowRight: [ARROW_STEP, 0],
      ArrowUp: [0, -ARROW_STEP],
      ArrowDown: [0, ARROW_STEP],
    }
    const d = deltas[e.key]
    if (!d) return
    e.preventDefault()
    const w = frameRef.current?.getBoundingClientRect().width ?? rect.w
    const next = clampWin(rect.x + d[0], rect.y + d[1], w)
    onMove(next.x, next.y)
  }

  const frameStyle: React.CSSProperties = maximized
    ? { left: 0, top: 0, width: '100vw', height: `calc(100dvh - ${TASKBAR_H}px)`, zIndex: z }
    : {
        left: rect.x,
        top: rect.y,
        width: `min(${rect.w}px, calc(100vw - 12px))`,
        zIndex: z,
      }

  const controls = [
    { label: 'Minimize', glyph: '_', action: onMin },
    { label: maximized ? 'Restore' : 'Maximize', glyph: maximized ? '❐' : '□', action: onToggleMax },
    { label: 'Close', glyph: '✕', action: onClose },
  ]

  return (
    <section
      ref={frameRef}
      className="win98-panel absolute flex flex-col shadow-lg"
      style={frameStyle}
      onPointerDown={onFocus}
      aria-label={title}
      data-active={active ? '' : undefined}
    >
      <div
        className={`win98-titlebar ${active ? '' : 'win98-titlebar--inactive'}`}
        onPointerDown={onTitlePointerDown}
        onDoubleClick={onToggleMax}
        onKeyDown={onTitleKeyDown}
        tabIndex={0}
        role="toolbar"
        aria-label={`${title} — use arrow keys to move the window`}
        style={{ touchAction: 'none' }}
      >
        <div className="pointer-events-none flex items-center gap-1.5">
          <span style={{ fontSize: 14 }} aria-hidden>
            {icon}
          </span>
          <span>{title}</span>
        </div>
        <div className="flex gap-0.5">
          {controls.map((c) => (
            <button
              key={c.label}
              onClick={c.action}
              onPointerDown={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="win98-btn win98-ctl !min-w-0 !p-0 leading-none font-bold text-black"
              aria-label={`${c.label} ${title}`}
            >
              {c.glyph}
            </button>
          ))}
        </div>
      </div>
      <div
        className="min-h-0 flex-1 overflow-y-auto"
        style={maximized ? undefined : { maxHeight: '60vh' }}
        data-win-content={id}
      >
        {children}
      </div>
    </section>
  )
}
