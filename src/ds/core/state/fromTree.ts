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

export const pathAncestors = (path: string, sep: string = '/'): string[] => {
  const segs = path.split(sep).filter(Boolean)
  return segs.reduce<string[]>(
    (acc, seg) => [...acc, `${acc.at(-1) ?? ''}${sep}${seg}`],
    [],
  )
}
