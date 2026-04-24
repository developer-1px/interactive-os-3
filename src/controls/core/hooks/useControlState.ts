import { useMemo, useState } from 'react'
import { reduce } from '../reduce'
import type { Event, NormalizedData } from '../types'

const EMPTY: NormalizedData = { entities: {}, relationships: {} }

export function useControlState(base: NormalizedData): [NormalizedData, (e: Event) => void] {
  const [meta, setMeta] = useState<NormalizedData>(EMPTY)
  const data = useMemo<NormalizedData>(
    () => ({
      entities: { ...base.entities, ...meta.entities },
      relationships: { ...base.relationships, ...meta.relationships },
    }),
    [base, meta],
  )
  const dispatch = (e: Event) => setMeta((d) => reduce(d, e))
  return [data, dispatch]
}
