import { EXPANDED, FOCUS, TYPEAHEAD, type Event, type NormalizedData } from './types'

type Handler<T extends Event['type']> = (
  d: NormalizedData,
  e: Extract<Event, { type: T }>,
) => NormalizedData

const setMeta = (d: NormalizedData, id: string, data: Record<string, unknown>): NormalizedData => ({
  ...d,
  entities: { ...d.entities, [id]: { id, data } },
})

const toggleExpanded = (d: NormalizedData, id: string, open: boolean): NormalizedData => {
  const prev = (d.entities[EXPANDED]?.data?.ids as string[]) ?? []
  const next = open ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
  return setMeta(d, EXPANDED, { ids: next })
}

const identity = (d: NormalizedData) => d

const handlers: { [K in Event['type']]: Handler<K> } = {
  navigate: (d, e) => setMeta(d, FOCUS, { id: e.id }),
  expand: (d, e) => toggleExpanded(d, e.id, e.open),
  open: (d, e) => toggleExpanded(d, e.id, e.open),
  typeahead: (d, e) => setMeta(d, TYPEAHEAD, { buf: e.buf, deadline: e.deadline }),
  activate: identity,
  select: identity,
  value: identity,
}

export const reduce = (d: NormalizedData, e: Event): NormalizedData =>
  (handlers[e.type] as Handler<Event['type']>)(d, e)
