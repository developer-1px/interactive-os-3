/** defineFeature — 한 화면 = 한 spec. 4 슬롯, 1 컨셉("state 의 pure 함수들"). */

import type { QueryResult, QuerySpec } from './query'

export interface CommandBase { type: string }

export type ReducerMap<S, Cmd extends CommandBase> = {
  readonly [K in Cmd['type']]: (s: S, p: Extract<Cmd, { type: K }>) => S
}

export type QueryResults<Q> = { readonly [K in keyof Q]: QueryResult<Q[K] extends QuerySpec<infer T> ? T : never> }

export interface FeatureSpec<
  S,
  Cmd extends CommandBase,
  Q extends Record<string, QuerySpec<unknown>> = Record<string, never>,
  V = unknown,
> {
  /** 사용자 의도 = JSON. 직렬화 가능해야 함. */
  state: S
  /** (s, cmd) → s'. pure. 외부 호출 금지. */
  on: ReducerMap<S, Cmd>
  /** state 의 함수로 외부 데이터 선언. runtime 이 fetch + 캐시. */
  query?: (s: S) => Q
  /** state + query → ViewModel. slot 단위 데이터. */
  view: (s: S, q: QueryResults<Q>) => V
}

/** identity — 타입 추론 + 런타임 검증 hook. */
export function defineFeature<
  S,
  Cmd extends CommandBase,
  Q extends Record<string, QuerySpec<unknown>> = Record<string, never>,
  V = unknown,
>(spec: FeatureSpec<S, Cmd, Q, V>): FeatureSpec<S, Cmd, Q, V> {
  return spec
}
