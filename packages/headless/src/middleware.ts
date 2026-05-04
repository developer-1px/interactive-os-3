/** Middleware — defineFlow 의 gestures 를 일반화한 파이프라인 훅 정본.
 *
 *  phase 별 시그니처는 핸들러 내부 분기로 narrow.
 *  capability 패키지(history·clipboard 등)가 plugin manifest 의 middlewares 로 등록한다. */

import type { UiEvent, NormalizedData } from './types'

/** Phase — middleware 가 끼어드는 4 시점. */
export type Phase =
  | 'pre-dispatch'         // raw event → reducer 직전 (기존 gestures 와 등가)
  | 'post-dispatch'        // reducer 직후 (effect 실행 전 — undo/redo stack push 등)
  | 'pre-resource-read'    // useResource read 직전
  | 'post-resource-write'  // resource write 직후

/** pre-dispatch ctx — reducer 직전. UiEvent[] 반환 시 이벤트 변환/확장. */
export interface PreDispatchCtx {
  data: NormalizedData
  event: UiEvent
}
/** post-dispatch ctx — reducer 직후 (undo stack push 등). */
export interface PostDispatchCtx<S = unknown, C = unknown> {
  prev: S
  next: S
  cmd: C
}
/** resource ctx — useResource read/write 시점. */
export interface ResourceCtx<V = unknown> {
  key: string
  value: V
}

/** MiddlewareFn — phase 별 ctx 를 받는 함수. 내부 분기로 narrow. */
export type MiddlewareFn =
  | ((ctx: PreDispatchCtx) => UiEvent[] | void)
  | ((ctx: PostDispatchCtx) => void)
  | ((ctx: ResourceCtx) => void)

/** Middleware — name + phase + fn 의 manifest entry. */
export interface Middleware {
  name: string
  phase: Phase
  fn: MiddlewareFn
}

/** Middleware 선언 헬퍼 — 타입 추론용 identity. */
export const defineMiddleware = (m: Middleware): Middleware => m
