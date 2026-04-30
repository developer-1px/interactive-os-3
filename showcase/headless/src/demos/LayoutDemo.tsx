import { useMemo } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'

/** definePage 라이브 데모 — entity tree 1개를 Renderer로 표시. */
export function LayoutDemo() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]:    { id: ROOT,     data: {} },
      sec:       { id: 'sec',    data: { type: 'Section', heading: { content: 'Section' } } },
      row:       { id: 'row',    data: { type: 'Row', flow: 'cluster' } },
      a:         { id: 'a',      data: { type: 'Text', variant: 'body', content: 'A' } },
      b:         { id: 'b',      data: { type: 'Text', variant: 'body', content: 'B' } },
      c:         { id: 'c',      data: { type: 'Text', variant: 'body', content: 'C' } },
    },
    relationships: {
      [ROOT]: ['sec'],
      sec:    ['row'],
      row:    ['a', 'b', 'c'],
    },
  }), [])
  return <Renderer page={page} />
}
