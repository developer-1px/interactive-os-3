import { useRef, type ReactNode } from 'react'
import type { ControlProps } from '../../core/types'
import { useZoomPanGesture } from '../../core/hooks/useZoomPanGesture'

/**
 * ZoomPanCanvas — 선언적·직렬화 가능한 zoom/pan 뷰포트.
 *
 * 상태(x, y, s)는 entity.data 안에 산다 — useState/useRef 내부 상태 없음.
 * 상위 useControlState reducer가 pan/zoom Event를 받아 entity.data를 갱신,
 * 이 컴포넌트는 그걸 읽어 transform만 적용한다.
 *
 * 그래서:
 *   · URL share-link: ?view={x,y,s} 으로 deep link 가능
 *   · undo/redo: pan/zoom Event 스택을 미들웨어로 시간여행
 *   · persistence: localStorage / 서버 세션 — 새로고침해도 위치 복원
 *
 * entity.data 스키마:
 *   { x: number; y: number; s: number; bounds?: { minS, maxS } }
 *
 * 입력 → Event 번역은 core/hooks/useZoomPanGesture가 담당 (gesture/intent 분리).
 *
 * children은 본 캔버스가 wrapping role이라 예외적으로 ReactNode 허용 (memory: showcase·layout 정당화).
 */
export type ZoomPanCanvasProps = ControlProps & {
  /** entity id — pan/zoom Event의 target. data가 NormalizedData면 ROOT, 아니면 명시. */
  id: string
  children: ReactNode
}

export function ZoomPanCanvas({ data, onEvent, id, children }: ZoomPanCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useZoomPanGesture(viewportRef, id, onEvent ?? (() => {}), { stageRef })

  const cur = data.entities[id]?.data ?? {}
  const x = (cur.x as number) ?? 0
  const y = (cur.y as number) ?? 0
  const s = (cur.s as number) ?? 1

  return (
    <div
      ref={viewportRef}
      data-ds="ZoomPanCanvas"
      style={{
        position: 'relative',
        // overflow:clip — hidden과 달리 스크롤 컨테이너를 만들지 않음(paint·layout 절약)
        overflow: 'clip',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        // Safari edge-swipe(뒤로/앞으로) + 트랙패드 가로 bounce 차단
        overscrollBehavior: 'none',
      }}
      tabIndex={0}
    >
      <div
        ref={stageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${s})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
