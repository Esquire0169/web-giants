import { useCallback, useEffect, useRef, useState } from 'react'

interface AppApi {
  notify: (title: string, text: string) => void
  close: () => void
}

const COLS = 16
const ROWS = 14
const CELL = 16
const TICK_MS = 110
const HS_KEY = 'wg-snake-hs'

type Dir = 'up' | 'down' | 'left' | 'right'
type Pt = { x: number; y: number }

const OPP: Record<Dir, Dir> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

const DELTA: Record<Dir, Pt> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

function randFood(snake: Pt[]): Pt {
  const taken = new Set(snake.map((p) => `${p.x},${p.y}`))
  let p: Pt
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (taken.has(`${p.x},${p.y}`))
  return p
}

function initialSnake(): Pt[] {
  const midY = Math.floor(ROWS / 2)
  return [
    { x: 5, y: midY },
    { x: 4, y: midY },
    { x: 3, y: midY },
  ]
}

export function SnakeWindow({ api }: { api: AppApi }) {
  const [snake, setSnake] = useState(initialSnake)
  const [food, setFood] = useState(() => randFood(initialSnake()))
  const [dir, setDir] = useState<Dir>('right')
  const [pending, setPending] = useState<Dir | null>(null)
  const [score, setScore] = useState(0)
  const [high, setHigh] = useState(() => {
    try {
      return Number(localStorage.getItem(HS_KEY) || 0)
    } catch {
      return 0
    }
  })
  const [alive, setAlive] = useState(true)
  const [paused, setPaused] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const dirRef = useRef(dir)
  const pendingRef = useRef(pending)
  const snakeRef = useRef(snake)
  const foodRef = useRef(food)
  const aliveRef = useRef(alive)
  const pausedRef = useRef(paused)

  dirRef.current = dir
  pendingRef.current = pending
  snakeRef.current = snake
  foodRef.current = food
  aliveRef.current = alive
  pausedRef.current = paused

  const reset = useCallback(() => {
    const s = initialSnake()
    setSnake(s)
    setFood(randFood(s))
    setDir('right')
    setPending(null)
    setScore(0)
    setAlive(true)
    setPaused(false)
    boardRef.current?.focus()
  }, [])

  useEffect(() => {
    boardRef.current?.focus()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!aliveRef.current || pausedRef.current) return

      let nextDir = dirRef.current
      const pend = pendingRef.current
      if (pend && pend !== OPP[nextDir]) {
        nextDir = pend
        setDir(pend)
        setPending(null)
      }

      const body = snakeRef.current
      const head = body[0]
      const d = DELTA[nextDir]
      const nh = { x: head.x + d.x, y: head.y + d.y }

      if (nh.x < 0 || nh.y < 0 || nh.x >= COLS || nh.y >= ROWS) {
        setAlive(false)
        return
      }
      if (body.some((p) => p.x === nh.x && p.y === nh.y)) {
        setAlive(false)
        return
      }

      const ate = nh.x === foodRef.current.x && nh.y === foodRef.current.y
      const next = [nh, ...body]
      if (!ate) next.pop()
      else {
        setScore((s) => {
          const n = s + 10
          setHigh((h) => {
            if (n > h) {
              try {
                localStorage.setItem(HS_KEY, String(n))
              } catch {
                /* ignore */
              }
              return n
            }
            return h
          })
          return n
        })
        setFood(randFood(next))
      }
      setSnake(next)
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  const wasAlive = useRef(true)
  useEffect(() => {
    if (wasAlive.current && !alive) {
      api.notify('Snake', `Game over — score ${score}. High score: ${Math.max(high, score)}.`)
    }
    wasAlive.current = alive
  }, [alive, api, score, high])

  function queueDir(next: Dir) {
    if (!alive || paused) return
    const cur = pendingRef.current ?? dirRef.current
    if (next === OPP[cur]) return
    setPending(next)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const map: Record<string, Dir> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      W: 'up',
      s: 'down',
      S: 'down',
      a: 'left',
      A: 'left',
      d: 'right',
      D: 'right',
    }
    const next = map[e.key]
    if (next) {
      e.preventDefault()
      e.stopPropagation()
      queueDir(next)
      return
    }
    if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
      e.preventDefault()
      if (alive) setPaused((p) => !p)
    }
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      reset()
    }
  }

  const cells: React.ReactNode[] = []
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = snake.findIndex((p) => p.x === x && p.y === y)
      const isHead = i === 0
      const isBody = i > 0
      const isFood = food.x === x && food.y === y
      let bg = '#9bbc0f'
      if (isHead) bg = '#0f380f'
      else if (isBody) bg = '#306230'
      else if (isFood) bg = '#8bac0f'
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            width: CELL,
            height: CELL,
            background: bg,
            boxShadow: isFood ? 'inset 0 0 0 2px #0f380f' : undefined,
          }}
        />,
      )
    }
  }

  return (
    <div className="p-3" style={{ fontSize: 12 }}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="font-bold">Snake.exe — Web Giants Arcade</div>
        <div className="font-mono text-xs">
          Score: {score} · Hi: {high}
        </div>
      </div>

      <div
        ref={boardRef}
        tabIndex={0}
        role="application"
        aria-label="Snake game. Arrow keys or WASD to move, Space to pause, R to restart."
        onKeyDown={onKeyDown}
        className="win98-panel-inset mx-auto w-fit outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          background: '#8bac0f',
          padding: 4,
          imageRendering: 'pixelated',
        }}
      >
        {cells}
      </div>

      <div className="mt-2 text-center text-xs text-gray-600" role="status">
        {!alive
          ? 'Game over — press Restart or R'
          : paused
            ? 'Paused — Space to resume'
            : 'Arrows / WASD · Space pause · R restart'}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="win98-btn"
          onClick={() => alive && setPaused((p) => !p)}
          disabled={!alive}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button type="button" className="win98-btn" onClick={reset}>
          Restart
        </button>
        <button
          type="button"
          className="win98-btn"
          onClick={() =>
            api.notify(
              'Snake Help',
              'Eat the lime squares. Do not hit walls or yourself.\nHigh score is saved locally — like a real .sav file.',
            )
          }
        >
          Help
        </button>
        <button type="button" className="win98-btn" onClick={api.close}>
          Exit
        </button>
      </div>

      {/* Touch D-pad for mobile */}
      <div className="mt-3 grid grid-cols-3 gap-1 sm:hidden" style={{ maxWidth: 140, margin: '0 auto' }}>
        <div />
        <button type="button" className="win98-btn !min-w-0" aria-label="Up" onClick={() => queueDir('up')}>
          ▲
        </button>
        <div />
        <button type="button" className="win98-btn !min-w-0" aria-label="Left" onClick={() => queueDir('left')}>
          ◄
        </button>
        <button type="button" className="win98-btn !min-w-0" aria-label="Down" onClick={() => queueDir('down')}>
          ▼
        </button>
        <button type="button" className="win98-btn !min-w-0" aria-label="Right" onClick={() => queueDir('right')}>
          ►
        </button>
      </div>
    </div>
  )
}
