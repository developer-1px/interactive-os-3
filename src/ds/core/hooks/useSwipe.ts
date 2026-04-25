import { useEffect, useRef, type RefObject } from 'react'

// 모바일 stack navigation/Sheet dismiss용 한 방향 swipe 인식 훅.
// activate 단발 emit 원칙과 대칭 — pointer 시작/종료의 단일 의도 한 번만 발행한다.
//
// 임계: 거리 ≥ 64px AND 가로/세로 비율 ≥ 1.5 AND 시간 ≤ 600ms.
// onSwipe는 'left'|'right'|'up'|'down' 중 onAxes에 매칭된 것만 호출.
//
// 사용자가 텍스트 선택/스크롤 중일 때를 침범하지 않도록 pointer-type === 'touch'에서만 발동.
// (마우스 드래그까지 swipe로 가져가면 selection과 충돌)
export type SwipeDir = 'left' | 'right' | 'up' | 'down'

export interface UseSwipeOpts {
  onSwipe: (dir: SwipeDir) => void
  axes?: SwipeDir[]
  threshold?: number  // px
  ratio?: number      // 주축/부축 비율
  timeout?: number    // ms
}

export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  { onSwipe, axes = ['left', 'right'], threshold = 64, ratio = 1.5, timeout = 600 }: UseSwipeOpts,
) {
  const start = useRef<{ x: number; y: number; t: number; id: number } | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      start.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }
    }
    const onUp = (e: PointerEvent) => {
      const s = start.current
      start.current = null
      if (!s || s.id !== e.pointerId) return
      const dx = e.clientX - s.x
      const dy = e.clientY - s.y
      const adx = Math.abs(dx)
      const ady = Math.abs(dy)
      const dt = performance.now() - s.t
      if (dt > timeout) return
      let dir: SwipeDir | null = null
      if (adx > ady * ratio && adx >= threshold) dir = dx > 0 ? 'right' : 'left'
      else if (ady > adx * ratio && ady >= threshold) dir = dy > 0 ? 'down' : 'up'
      if (dir && axes.includes(dir)) onSwipe(dir)
    }
    el.addEventListener('pointerdown', onDown, { passive: true })
    el.addEventListener('pointerup', onUp, { passive: true })
    el.addEventListener('pointercancel', () => { start.current = null }, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
    }
  }, [ref, onSwipe, axes, threshold, ratio, timeout])
}
