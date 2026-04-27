/** useFeature — defineFeature spec 를 React 에 연결.
 *  반환은 [view, dispatch] 만 — state 직접 노출 X (selector 가 잘못된 SSOT 보는 버그 차단). */

import { useCallback, useEffect, useMemo, useReducer, useRef, useSyncExternalStore } from 'react'
import type { CommandBase, FeatureSpec } from './defineFeature'
import type { QuerySpec } from './query'
import { applyEffectsDiff, type Effect } from './effects'
import { queryVersion, resolveQueries, subscribeQueries } from './query'

const subscribeToQueries = (cb: () => void) => subscribeQueries(cb)

export function useFeature<S, Cmd extends CommandBase, Q extends Record<string, QuerySpec<unknown>>, V>(
  spec: FeatureSpec<S, Cmd, Q, V>,
): [V, (cmd: Cmd) => void] {
  const reducer = useCallback(
    (s: S, cmd: Cmd): S => {
      const handler = (spec.on as unknown as Record<string, (s: S, p: Cmd) => S>)[cmd.type]
      return handler ? handler(s, cmd) : s
    },
    [spec],
  )

  const [state, dispatch] = useReducer(reducer, spec.state)

  // query 갱신을 구독해서 view 재계산 트리거 (version 이 바뀌면 리렌더)
  const qv = useSyncExternalStore(subscribeToQueries, queryVersion, queryVersion)

  const queries = useMemo(() => resolveQueries(spec.query, state), [spec, state, qv])
  const view = useMemo(() => spec.view(state, queries as never), [spec, state, queries])

  // effect: prev → next diff 후 실행
  const prevEffectsRef = useRef<Effect[]>([])
  useEffect(() => {
    if (!spec.effect) return
    const next = spec.effect(state)
    applyEffectsDiff(prevEffectsRef.current, next)
    prevEffectsRef.current = next
  }, [spec, state])

  return [view, dispatch as (cmd: Cmd) => void]
}
