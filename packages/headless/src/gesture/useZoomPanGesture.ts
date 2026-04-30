import { useEffect, type RefObject } from 'react'
import type { Event } from '../types'

/**
 * useZoomPanGesture — raw browser 이벤트(wheel/pointer/key/Safari gesture)를
 * pan/zoom Event로 번역해 onEvent로 emit.
 *
 * 상태(x, y, s)는 entity.data 안에 산다 — useZoomPanGesture 자체는 상태 보유 X.
 * gesture/intent 분리: 이 훅은 입력 어댑터, 변환·clamp는 reduce의 pan/zoom 핸들러.
 *
 * 트리거 (pan):
 *   · background — viewport 빈공간 드래그
 *   · space-held — Space 누른 상태에서 드래그
 *   · middle-button — 휠클릭 드래그
 *   · wheel — 트랙패드 가로/세로 스크롤 (modifier 없음)
 *
 * 트리거 (zoom):
 *   · wheel + ctrl/meta (트랙패드 핀치는 ctrlKey=true)
 *
 * Safari edge-swipe / gesturestart 차단 포함.
 */
export interface ZoomPanOptions {
  /** zoom 1step 비율. 기본 1.0035 — Figma 식. */
  zoomFactor?: number
}

export function useZoomPanGesture(
  ref: RefObject<HTMLElement | null>,
  id: string,
  onEvent: (e: Event) => void,
  opts: ZoomPanOptions & { stageRef?: RefObject<HTMLElement | null> } = {},
) {
  const zoomFactor = opts.zoomFactor ?? 1.0035

  useEffect(() => {
    const vp = ref.current
    if (!vp) return

    let spaceDown = false
    let dragging: { startX: number; startY: number } | null = null

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const rect = vp.getBoundingClientRect()
        onEvent({
          type: 'zoom',
          id,
          cx: e.clientX - rect.left,
          cy: e.clientY - rect.top,
          k: Math.pow(zoomFactor, -e.deltaY),
        })
      } else {
        onEvent({ type: 'pan', id, dx: -e.deltaX, dy: -e.deltaY })
      }
    }

    const setStageInteractive = (on: boolean) => {
      const stage = opts.stageRef?.current
      if (stage) stage.style.pointerEvents = on ? '' : 'none'
    }

    const onPointerDown = (e: PointerEvent) => {
      const isMiddle = e.button === 1
      const isBackground = e.target === vp
      if (!spaceDown && !isMiddle && !isBackground) return
      e.preventDefault()
      vp.setPointerCapture(e.pointerId)
      dragging = { startX: e.clientX, startY: e.clientY }
      vp.style.cursor = 'grabbing'
      // 드래그 중엔 stage 자식 hit-test 차단 — 1000+ 카드 mousemove마다 raycast 회피
      setStageInteractive(false)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      onEvent({ type: 'pan', id, dx: e.clientX - dragging.startX, dy: e.clientY - dragging.startY })
      dragging.startX = e.clientX
      dragging.startY = e.clientY
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = null
      if (vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId)
      vp.style.cursor = spaceDown ? 'grab' : ''
      setStageInteractive(true)
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
        if (!dragging) vp.style.cursor = ''
      }
    }

    // Safari iOS pinch / 뒤로·앞으로 스와이프 차단
    const onGesture = (e: Event) => (e as unknown as { preventDefault: () => void }).preventDefault()

    vp.addEventListener('wheel', onWheel, { passive: false })
    vp.addEventListener('pointerdown', onPointerDown)
    vp.addEventListener('pointermove', onPointerMove)
    vp.addEventListener('pointerup', onPointerUp)
    vp.addEventListener('pointercancel', onPointerUp)
    vp.addEventListener('gesturestart', onGesture as EventListener)
    vp.addEventListener('gesturechange', onGesture as EventListener)
    vp.addEventListener('gestureend', onGesture as EventListener)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      vp.removeEventListener('wheel', onWheel)
      vp.removeEventListener('pointerdown', onPointerDown)
      vp.removeEventListener('pointermove', onPointerMove)
      vp.removeEventListener('pointerup', onPointerUp)
      vp.removeEventListener('pointercancel', onPointerUp)
      vp.removeEventListener('gesturestart', onGesture as EventListener)
      vp.removeEventListener('gesturechange', onGesture as EventListener)
      vp.removeEventListener('gestureend', onGesture as EventListener)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [ref, id, onEvent, zoomFactor, opts.stageRef])
}
