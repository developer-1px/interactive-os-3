/**
 * Sidebar widget — 단일 스키마. 모든 변형은 같은 SidebarProps를 받고
 * NormalizedData fragment(__root__ 없음)을 돌려준다.
 *
 * widget이 자체 nav landmark 소유. 외곽 wrapper 0.
 */
import type { NormalizedData, Event as DsEvent } from '@p/headless/types'

export interface SidebarProps {
  /** widget 인스턴스 id. entity prefix로 쓰인다. 페이지 내 충돌 방지용. */
  id: string
  /** ARIA aria-label — landmark 식별. */
  label: string
  /** Tree에 흘릴 데이터(라우트가 useControlState로 만든 것). */
  tree: NormalizedData
  /** Tree 이벤트 핸들러. */
  onEvent: (e: DsEvent) => void
  /** 폭 (확장 모드 기본). */
  width?: number
}
