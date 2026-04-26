import {
  Children,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

export type SplitAxis = 'row' | 'column'

export type SplitProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  /** localStorage 영속화 키. 생략 시 메모리 전용. */
  id?: string
  /** 분배 축. 기본 'row'. */
  axis?: SplitAxis
  /** fr 비율 배열. 자식 수와 길이가 다르면 1로 채움. */
  defaultSizes?: number[]
  /** px 단위 최소 폭. number면 모든 panel에 동일 적용. */
  minSizes?: number | number[]
  children?: ReactNode
}

const SEPARATOR_TRACK_PX = 8
const STORAGE_PREFIX = 'ds:split:'
const DEFAULT_MIN = 120

function normalizeSizes(n: number, defaults?: number[]): number[] {
  if (n <= 0) return []
  return Array.from({ length: n }, (_, i) => {
    const v = defaults?.[i]
    return typeof v === 'number' && v > 0 ? v : 1
  })
}

function normalizeMins(n: number, mins?: number | number[]): number[] {
  if (typeof mins === 'number') return Array.from({ length: n }, () => mins)
  if (Array.isArray(mins)) return Array.from({ length: n }, (_, i) => mins[i] ?? DEFAULT_MIN)
  return Array.from({ length: n }, () => DEFAULT_MIN)
}

function trackTemplate(sizes: number[]): string {
  const tracks: string[] = []
  sizes.forEach((s, i) => {
    tracks.push(`${s}fr`)
    if (i < sizes.length - 1) tracks.push(`${SEPARATOR_TRACK_PX}px`)
  })
  return tracks.join(' ')
}

function loadSizes(id: string | undefined, n: number): number[] | null {
  if (!id || typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + id)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== n) return null
    if (!parsed.every(v => typeof v === 'number' && v > 0 && Number.isFinite(v))) return null
    return parsed as number[]
  } catch {
    return null
  }
}

function saveSizes(id: string | undefined, sizes: number[]): void {
  if (!id || typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(sizes))
  } catch {
    /* quota / private mode — silent */
  }
}

/**
 * Split — N-pane resize layout primitive.
 *
 * 자식 사이에 separator를 자동 삽입하고, 마우스/터치 드래그로 인접 두 panel의 fr 비율을 조절한다.
 * `id`를 부여하면 `localStorage`에 폭이 영속화된다 (uncontrolled).
 * 항상 full-height. Tab 흐름을 오염시키지 않는다 (separator는 tabIndex=-1).
 */
export function Split({
  id,
  axis = 'row',
  defaultSizes,
  minSizes,
  children,
  style,
  ...rest
}: SplitProps) {
  const arr = Children.toArray(children).filter(Boolean)
  const n = arr.length
  const mins = useMemo(() => normalizeMins(n, minSizes), [n, minSizes])

  const [sizes, setSizes] = useState<number[]>(() => {
    const stored = loadSizes(id, n)
    if (stored) return stored
    return normalizeSizes(n, defaultSizes)
  })
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  // 자식 수 변화 시 sizes 길이 재정합
  useEffect(() => {
    setSizes(prev => {
      if (prev.length === n) return prev
      if (n === 0) return []
      return Array.from({ length: n }, (_, i) => prev[i] ?? defaultSizes?.[i] ?? 1)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  const rootRef = useRef<HTMLDivElement | null>(null)

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, sepIndex: number) => {
      const root = rootRef.current
      if (!root) return
      e.preventDefault()
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      setDraggingIndex(sepIndex)

      const rect = root.getBoundingClientRect()
      const totalPx = axis === 'row' ? rect.width : rect.height
      const panelsPx = totalPx - SEPARATOR_TRACK_PX * Math.max(0, n - 1)
      const startSizes = sizes.slice()
      const sumFr = startSizes.reduce((a, b) => a + b, 0) || 1
      const startPx = startSizes.map(s => (s / sumFr) * panelsPx)
      const startCoord = axis === 'row' ? e.clientX : e.clientY

      const onMove = (ev: PointerEvent) => {
        const coord = axis === 'row' ? ev.clientX : ev.clientY
        const delta = coord - startCoord
        const left = sepIndex
        const right = sepIndex + 1

        let leftPx = startPx[left] + delta
        let rightPx = startPx[right] - delta

        const minLeft = mins[left] ?? DEFAULT_MIN
        const minRight = mins[right] ?? DEFAULT_MIN
        if (leftPx < minLeft) {
          rightPx -= minLeft - leftPx
          leftPx = minLeft
        }
        if (rightPx < minRight) {
          leftPx -= minRight - rightPx
          rightPx = minRight
        }

        const nextPx = startPx.slice()
        nextPx[left] = leftPx
        nextPx[right] = rightPx

        const total = nextPx.reduce((a, b) => a + b, 0) || 1
        const next = nextPx.map(px => (px / total) * sumFr)
        setSizes(next)
      }
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
        setDraggingIndex(null)
        setSizes(curr => {
          saveSizes(id, curr)
          return curr
        })
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    },
    [axis, id, mins, n, sizes]
  )

  const template = trackTemplate(sizes)
  const templateProp =
    axis === 'row' ? { gridTemplateColumns: template } : { gridTemplateRows: template }

  const sumFr = sizes.reduce((a, b) => a + b, 0) || 1
  const out: ReactNode[] = []
  arr.forEach((child, i) => {
    out.push(<Fragment key={`p-${i}`}>{child}</Fragment>)
    if (i < arr.length - 1) {
      const valueNow = Math.round(
        (sizes.slice(0, i + 1).reduce((a, b) => a + b, 0) / sumFr) * 100,
      )
      out.push(
        <div
          key={`s-${i}`}
          role="separator"
          aria-orientation={axis === 'row' ? 'vertical' : 'horizontal'}
          aria-valuenow={valueNow}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={-1}
          data-ds-handle
          data-index={i}
          data-active={draggingIndex === i ? 'true' : undefined}
          onPointerDown={e => onPointerDown(e, i)}
        />,
      )
    }
  })

  return (
    <div
      ref={rootRef}
      data-ds="Split"
      data-axis={axis}
      data-dragging={draggingIndex !== null ? axis : undefined}
      style={{ ...templateProp, ...style }}
      {...rest}
    >
      {out}
    </div>
  )
}
