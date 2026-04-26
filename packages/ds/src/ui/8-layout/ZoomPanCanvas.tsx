import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  initialScale?: number
  minScale?: number
  maxScale?: number
}

export function ZoomPanCanvas({
  children,
  initialScale = 1,
  minScale = 0.1,
  maxScale = 4,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const state = useRef({ x: 0, y: 0, s: initialScale })
  const dragging = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null)

  useEffect(() => {
    const vp = viewportRef.current
    const stage = stageRef.current
    if (!vp || !stage) return

    const apply = () => {
      const { x, y, s } = state.current
      stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`
    }
    apply()

    let spaceDown = false

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      // ctrl/meta(트랙패드 핀치는 ctrlKey=true 로 들어옴) → zoom, 그 외 → pan
      if (e.ctrlKey || e.metaKey) {
        const rect = vp.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top
        const factor = Math.pow(1.0035, -e.deltaY)
        const next = Math.max(minScale, Math.min(maxScale, state.current.s * factor))
        const k = next / state.current.s
        state.current.x = cx - (cx - state.current.x) * k
        state.current.y = cy - (cy - state.current.y) * k
        state.current.s = next
      } else {
        state.current.x -= e.deltaX
        state.current.y -= e.deltaY
      }
      apply()
    }

    const onPointerDown = (e: PointerEvent) => {
      const isMiddle = e.button === 1
      const isBackground = e.target === vp
      if (!spaceDown && !isMiddle && !isBackground) return
      e.preventDefault()
      vp.setPointerCapture(e.pointerId)
      dragging.current = {
        startX: e.clientX,
        startY: e.clientY,
        ox: state.current.x,
        oy: state.current.y,
      }
      vp.style.cursor = 'grabbing'
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spaceDown) {
        spaceDown = true
        vp.style.cursor = 'grab'
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceDown = false
        if (!dragging.current) vp.style.cursor = ''
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const d = dragging.current
      if (!d) return
      state.current.x = d.ox + (e.clientX - d.startX)
      state.current.y = d.oy + (e.clientY - d.startY)
      apply()
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging.current) return
      dragging.current = null
      if (vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId)
      vp.style.cursor = spaceDown ? 'grab' : ''
    }

    vp.addEventListener('wheel', onWheel, { passive: false })
    vp.addEventListener('pointerdown', onPointerDown)
    vp.addEventListener('pointermove', onPointerMove)
    vp.addEventListener('pointerup', onPointerUp)
    vp.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      vp.removeEventListener('wheel', onWheel)
      vp.removeEventListener('pointerdown', onPointerDown)
      vp.removeEventListener('pointermove', onPointerMove)
      vp.removeEventListener('pointerup', onPointerUp)
      vp.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [minScale, maxScale])

  return (
    <div
      ref={viewportRef}
      data-ds="ZoomPanCanvas"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        touchAction: 'none',
      }}
      tabIndex={0}
    >
      <div
        ref={stageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
