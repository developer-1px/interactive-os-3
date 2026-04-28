/**
 * Preview cell 공통 props. 모든 kind 가 동일 인터페이스 — dispatch 를 위한 invariant.
 */
import type { ReactNode } from 'react'

export interface PreviewProps {
  /** 토큰 함수 호출 결과 (e.g. "var(--ds-accent)", "16px"). string-emit 결과. */
  value: string
  /** 카드 caption — 사람이 읽는 라벨 */
  name?: ReactNode
  /** 보조 caption — 함수 호출 표기 (e.g. "accent()", "pad(4)") */
  call?: ReactNode
}
