import type { Meta, NormalizedData, UiEvent } from '../types'

type Handler<T extends UiEvent['type']> = (
  d: NormalizedData,
  e: Extract<UiEvent, { type: T }>,
) => NormalizedData

const setMeta = (d: NormalizedData, patch: Partial<Meta>): NormalizedData => ({
  ...d,
  meta: { ...d.meta, ...patch },
})

const mergeData = (d: NormalizedData, id: string, patch: Record<string, unknown>): NormalizedData => {
  const prev = d.entities[id]
  if (!prev) return d
  return {
    ...d,
    entities: { ...d.entities, [id]: { ...prev, ...patch } },
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

const toggleSet = (d: NormalizedData, key: 'expanded' | 'open', id: string, on: boolean): NormalizedData => {
  const prev = d.meta?.[key] ?? []
  const has = prev.includes(id)
  if (on === has) return d
  const next = on ? [...prev, id] : prev.filter((x) => x !== id)
  return setMeta(d, { [key]: next } as Partial<Meta>)
}

const identity = (d: NormalizedData) => d

const handlers: { [K in UiEvent['type']]: Handler<K> } = {
  navigate: (d, e) => setMeta(d, { focus: e.id }),
  expand: (d, e) => toggleSet(d, 'expanded', e.id, e.open),
  open: (d, e) => toggleSet(d, 'open', e.id, e.open),
  typeahead: (d, e) => setMeta(d, { typeahead: { buf: e.buf, deadline: e.deadline } }),
  activate: identity,
  select: (d, e) => setMeta(d, { selectAnchor: e.id }),
  selectMany: identity,
  value: identity,
  pan: (d, e) => {
    const cur = d.entities[e.id] ?? {}
    const x = ((cur.x as number) ?? 0) + e.dx
    const y = ((cur.y as number) ?? 0) + e.dy
    return mergeData(d, e.id, { x, y })
  },
  zoom: (d, e) => {
    const cur = d.entities[e.id] ?? {}
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
