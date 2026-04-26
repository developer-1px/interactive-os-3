import { useMemo, useReducer, useRef } from 'react'
import { reduce } from '../state/reduce'
import { EXPANDED, FOCUS, TYPEAHEAD, type Event, type NormalizedData } from '../types'

const EMPTY: NormalizedData = { entities: {}, relationships: {} }
const SEED_KEYS = [FOCUS, EXPANDED, TYPEAHEAD] as const

/**
 * meta 키들(FOCUS/EXPANDED/TYPEAHEAD)이 base에 시드되어 있으면 reducer 초기 state에
 * 동일 키로 hydrate한다. 그래야 첫 expand/navigate 액션이 base 시드를 무시하고
 * 빈 배열 위에 덮어쓰는 버그가 발생하지 않는다.
 *
 * base의 seed 값이 외부에서 갱신되면(URL→base bridge 등) data 머지에서 base가
 * 이긴다. user dispatch 이후엔 meta가 이긴다 — touchedRef로 키 단위 추적.
 */
const hydrate = (base: NormalizedData): NormalizedData => {
  const entities: NormalizedData['entities'] = {}
  for (const k of SEED_KEYS) {
    if (base.entities[k]) entities[k] = base.entities[k]
  }
  return Object.keys(entities).length > 0 ? { entities, relationships: {} } : EMPTY
}

export function useControlState(base: NormalizedData): [NormalizedData, (e: Event) => void] {
  const [meta, rawDispatch] = useReducer(reduce, base, hydrate)
  const touched = useRef<Set<string>>(new Set())
  const dispatch = (e: Event) => {
    if (e.type === 'navigate') touched.current.add(FOCUS)
    else if (e.type === 'expand' || e.type === 'open') touched.current.add(EXPANDED)
    else if (e.type === 'typeahead') touched.current.add(TYPEAHEAD)
    rawDispatch(e)
  }
  const data = useMemo<NormalizedData>(() => {
    const entities = { ...base.entities, ...meta.entities }
    for (const k of SEED_KEYS) {
      // eslint-disable-next-line react-hooks/refs -- touched는 dispatch에서만 추가되는 idempotent set
      if (!touched.current.has(k) && base.entities[k]) entities[k] = base.entities[k]
    }
    return {
      entities,
      relationships: { ...base.relationships, ...meta.relationships },
    }
  }, [base, meta])
  return [data, dispatch]
}
