import { ROOT, FOCUS, EXPANDED, type NormalizedData } from '../types'

type FromTreeOpts<T> = {
  getId: (n: T) => string
  getKids?: (n: T) => T[] | undefined
  toData?: (n: T) => Record<string, unknown>
  focusId?: string | null
  expandedIds?: string[]
}

export function fromTree<T>(
  roots: T[],
  { getId, getKids, toData, focusId, expandedIds }: FromTreeOpts<T>,
): NormalizedData {
  const entities: NormalizedData['entities'] = { [ROOT]: { id: ROOT } }
  const relationships: NormalizedData['relationships'] = {}

  const walk = (node: T, parentId: string) => {
    const id = getId(node)
    entities[id] = { id, data: toData?.(node) ?? {} }
    relationships[parentId] = [...(relationships[parentId] ?? []), id]
    for (const c of getKids?.(node) ?? []) walk(c, id)
  }
  for (const r of roots) walk(r, ROOT)

  if (expandedIds) entities[EXPANDED] = { id: EXPANDED, data: { ids: expandedIds } }
  if (focusId !== undefined) entities[FOCUS] = { id: FOCUS, data: { id: focusId } }

  return { entities, relationships }
}

/**
 * fromList — 평탄한 배열을 NormalizedData 로 변환. Display-only Collection
 * (Top10List/BarChart 류)에서 entries/bars 대신 쓰는 adapter.
 */
export function fromList(items: Array<Record<string, unknown>>): NormalizedData {
  const ids = items.map((_, i) => `__${i}`)
  const entities: NormalizedData['entities'] = { [ROOT]: { id: ROOT } }
  items.forEach((item, i) => {
    entities[ids[i]] = { id: ids[i], data: item }
  })
  return { entities, relationships: { [ROOT]: ids } }
}

export const pathAncestors = (path: string, sep: string = '/'): string[] => {
  const segs = path.split(sep).filter(Boolean)
  return segs.reduce<string[]>(
    (acc, seg) => [...acc, `${acc.at(-1) ?? ''}${sep}${seg}`],
    [],
  )
}
