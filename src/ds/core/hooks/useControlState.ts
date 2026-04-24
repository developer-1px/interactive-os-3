import { useMemo, useReducer } from 'react'
import { reduce } from '../state/reduce'
import type { Event, NormalizedData } from '../types'

const EMPTY: NormalizedData = { entities: {}, relationships: {} }

export function useControlState(base: NormalizedData): [NormalizedData, (e: Event) => void] {
  const [meta, dispatch] = useReducer(reduce, EMPTY)
  const data = useMemo<NormalizedData>(
    () => ({
      entities: { ...base.entities, ...meta.entities },
      relationships: { ...base.relationships, ...meta.relationships },
    }),
    [base, meta],
  )
  return [data, dispatch]
}
