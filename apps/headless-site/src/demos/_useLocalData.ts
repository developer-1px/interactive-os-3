import { useState } from 'react'
import { reduce, isMetaId, type NormalizedData, type UiEvent } from '@p/headless'

/**
 * Demo helper — wraps NormalizedData in local state.
 *
 * `reduce` from @p/headless is **partial** by design — it owns FOCUS / EXPANDED /
 * TYPEAHEAD / pan / zoom meta. Domain state (selected, value, …) is the consumer's
 * job. This helper layers a small single-select + numeric-value reducer on top so
 * the demos visibly react to clicks and keyboard. Real apps would do this inside
 * a Resource (useResource).
 */
export function useLocalData(initial: NormalizedData | (() => NormalizedData)) {
  const [data, setData] = useState(initial)

  const onEvent = (e: UiEvent) => {
    setData((d) => {
      const next = reduce(d, e)

      if (e.type === 'activate') {
        // click also moves focus (most APG patterns are click-sets-focus)
        const focused = reduce(next, { type: 'navigate', id: e.id })
        return setSingleSelect(focused, e.id)
      }
      if (e.type === 'value') {
        return setValue(next, e.id, e.value as number)
      }
      return next
    })
  }

  return [data, onEvent] as const
}

/**
 * Single-select: mark `targetId` as selected and clear `selected` on all other
 * non-meta entities. Walks the entity map, not just root children, so nested
 * patterns (tree/menu) still work.
 */
function setSingleSelect(d: NormalizedData, targetId: string): NormalizedData {
  const entities = { ...d.entities }
  for (const id of Object.keys(entities)) {
    if (isMetaId(id)) continue
    const ent = entities[id]
    if (!ent) continue
    const wasSelected = Boolean(ent.data?.selected)
    const willBe = id === targetId
    if (wasSelected === willBe) continue
    entities[id] = { ...ent, data: { ...ent.data, selected: willBe } }
  }
  return { ...d, entities }
}

function setValue(d: NormalizedData, id: string, value: number): NormalizedData {
  const ent = d.entities[id]
  if (!ent) return d
  return {
    ...d,
    entities: { ...d.entities, [id]: { ...ent, data: { ...ent.data, value } } },
  }
}
