/** Soft cinematic ease — long settle, no hard stop. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN = [0.7, 0, 0.84, 0] as const
export const EASE_IO = [0.45, 0, 0.55, 1] as const
/** Gentle overshoot for morph beats. */
export const EASE_BACK = [0.22, 1.15, 0.36, 1] as const

export const SPRING_SOFT = {
  type: 'spring' as const,
  stiffness: 160,
  damping: 28,
  mass: 1.05,
}

export const SPRING_SNAP = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 24,
  mass: 0.75,
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function nextFrame() {
  await new Promise<void>((r) => requestAnimationFrame(() => r()))
}
