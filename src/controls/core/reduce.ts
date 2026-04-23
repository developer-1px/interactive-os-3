import { EXPANDED, FOCUS, type Event, type NormalizedData } from './types'

export function reduce(d: NormalizedData, e: Event): NormalizedData {
  switch (e.type) {
    case 'navigate':
      return setMeta(d, FOCUS, { id: e.id })
    case 'expand':
    case 'open': {
      const ids = new Set((d.entities[EXPANDED]?.data?.ids as string[]) ?? [])
      e.open ? ids.add(e.id) : ids.delete(e.id)
      return setMeta(d, EXPANDED, { ids: [...ids] })
    }
    default:
      return d
  }
}

function setMeta(
  d: NormalizedData,
  id: string,
  data: Record<string, unknown>,
): NormalizedData {
  return {
    ...d,
    entities: { ...d.entities, [id]: { id, data } },
  }
}
