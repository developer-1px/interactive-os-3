import { EXPANDED, FOCUS, TYPEAHEAD, type UiEvent, type NormalizedData } from '../types'

type Handler<T extends UiEvent['type']> = (
  d: NormalizedData,
  e: Extract<UiEvent, { type: T }>,
) => NormalizedData

const setMeta = (d: NormalizedData, id: string, data: Record<string, unknown>): NormalizedData => ({
  ...d,
  entities: { ...d.entities, [id]: { id, data } },
})

const mergeData = (d: NormalizedData, id: string, patch: Record<string, unknown>): NormalizedData => {
  const prev = d.entities[id]
  if (!prev) return d
  return {
    ...d,
    entities: { ...d.entities, [id]: { ...prev, data: { ...prev.data, ...patch } } },
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

const toggleExpanded = (d: NormalizedData, id: string, open: boolean): NormalizedData => {
  const prev = (d.entities[EXPANDED]?.data?.ids as string[]) ?? []
  const has = prev.includes(id)
  if (open === has) return d
  const next = open ? [...prev, id] : prev.filter((x) => x !== id)
  return setMeta(d, EXPANDED, { ids: next })
}

const identity = (d: NormalizedData) => d

const handlers: { [K in UiEvent['type']]: Handler<K> } = {
  navigate: (d, e) => setMeta(d, FOCUS, { id: e.id }),
  expand: (d, e) => toggleExpanded(d, e.id, e.open),
  open: (d, e) => toggleExpanded(d, e.id, e.open),
  typeahead: (d, e) => setMeta(d, TYPEAHEAD, { buf: e.buf, deadline: e.deadline }),
  activate: identity,
  select: identity,
  value: identity,
  pan: (d, e) => {
    const cur = d.entities[e.id]?.data ?? {}
    const x = ((cur.x as number) ?? 0) + e.dx
    const y = ((cur.y as number) ?? 0) + e.dy
    return mergeData(d, e.id, { x, y })
  },
  zoom: (d, e) => {
    const cur = d.entities[e.id]?.data ?? {}
    const s0 = (cur.s as number) ?? 1
    const x0 = (cur.x as number) ?? 0
    const y0 = (cur.y as number) ?? 0
    const bounds = (cur.bounds as { minS?: number; maxS?: number }) ?? {}
    const s = clamp(s0 * e.k, bounds.minS ?? 0.05, bounds.maxS ?? 16)
    const k = s / s0
    const x = e.cx - (e.cx - x0) * k
    const y = e.cy - (e.cy - y0) * k
    return mergeData(d, e.id, { x, y, s })
  },
}

export const reduce = (d: NormalizedData, e: UiEvent): NormalizedData =>
  (handlers[e.type] as Handler<UiEvent['type']>)(d, e)
