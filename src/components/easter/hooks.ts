import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export const TASKBAR_H = 36
/** Keep at least the titlebar reachable when clamping. */
const TITLEBAR_H = 30

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/** Live clock, aligned to minute boundaries. */
export function useClock() {
  const [time, setTime] = useState(formatTime)
  useEffect(() => {
    let interval: number | undefined
    const timeout = window.setTimeout(() => {
      setTime(formatTime())
      interval = window.setInterval(() => setTime(formatTime()), 60_000)
    }, 60_000 - (Date.now() % 60_000))
    return () => {
      window.clearTimeout(timeout)
      if (interval !== undefined) window.clearInterval(interval)
    }
  }, [])
  return time
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible-dialog behavior for the overlay: focuses the container on mount
 * and keeps Tab / Shift+Tab cycling inside it.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.focus({ preventScroll: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.getClientRects().length > 0,
      )
      if (nodes.length === 0) {
        e.preventDefault()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === el)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    el.addEventListener('keydown', onKeyDown)
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [ref])
}

/** Clamp a window position so it never leaves the viewport (taskbar excluded). */
export function clampWin(x: number, y: number, w: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxX = Math.max(0, vw - Math.min(w, vw))
  const maxY = Math.max(0, vh - TASKBAR_H - TITLEBAR_H)
  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  }
}

/**
 * Pointer-event drag (mouse + touch + pen) with pointer capture.
 * Returns an onPointerDown handler; deltas are reported to `onMove`.
 */
export function usePointerDrag(opts: {
  onStart?: (e: React.PointerEvent) => void
  onMove: (dx: number, dy: number) => void
}) {
  const cb = useRef(opts)
  cb.current = opts

  return useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const target = e.currentTarget as HTMLElement
    const startX = e.clientX
    const startY = e.clientY
    cb.current.onStart?.(e)
    target.setPointerCapture(e.pointerId)

    const move = (ev: PointerEvent) => {
      cb.current.onMove(ev.clientX - startX, ev.clientY - startY)
    }
    const end = () => {
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerup', end)
      target.removeEventListener('pointercancel', end)
    }
    target.addEventListener('pointermove', move)
    target.addEventListener('pointerup', end)
    target.addEventListener('pointercancel', end)
  }, [])
}

/** Calls `onOutside` on pointerdown outside all of the given refs (while `active`). */
export function useOutsideClose(
  active: boolean,
  refs: RefObject<HTMLElement | null>[],
  onOutside: () => void,
) {
  const cb = useRef(onOutside)
  cb.current = onOutside
  useEffect(() => {
    if (!active) return
    const handler = (e: PointerEvent) => {
      const target = e.target as Node
      if (refs.some((r) => r.current?.contains(target))) return
      cb.current()
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
    // refs array identity is stable per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
