/** Middleware — defineFlow 의 gestures 를 일반화한 파이프라인 훅 정본.
 *
 *  phase 별 시그니처는 핸들러 내부 분기로 narrow.
 *  capability 패키지(history·clipboard 등)가 plugin manifest 의 middlewares 로 등록한다. */

import type { UiEvent, NormalizedData } from './types'

export type Phase =
  | 'pre-dispatch'         // raw event → reducer 직전 (기존 gestures 와 등가)
  | 'post-dispatch'        // reducer 직후 (effect 실행 전 — undo/redo stack push 등)
  | 'pre-resource-read'    // useResource read 직전
  | 'post-resource-write'  // resource write 직후

export interface PreDispatchCtx {
  data: NormalizedData
  event: UiEvent
}
export interface PostDispatchCtx<S = unknown, C = unknown> {
  prev: S
  next: S
  cmd: C
}
export interface ResourceCtx<V = unknown> {
  key: string
  value: V
}

export type MiddlewareFn =
  | ((ctx: PreDispatchCtx) => UiEvent[] | void)
  | ((ctx: PostDispatchCtx) => void)
  | ((ctx: ResourceCtx) => void)

export interface Middleware {
  name: string
  phase: Phase
  fn: MiddlewareFn
}

export const defineMiddleware = (m: Middleware): Middleware => m
