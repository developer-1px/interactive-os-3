import type { NormalizedData } from '../types'

/**
 * fromTree — convention-based tree builder. Input is `{id, children?, ...rest}` —
 * id and children are reserved keys; rest becomes the entity's user data.
 * No callbacks. No options for shape transformation.
 */
export function fromTree<T extends { id: string; children?: T[] }>(
  roots: T[],
  opts?: { focusId?: string | null; expanded?: string[] },
): NormalizedData {
  const entities: NormalizedData['entities'] = {}
  const relationships: NormalizedData['relationships'] = {}

  const walk = (node: T) => {
    const { id, children, ...rest } = node as T & Record<string, unknown>
    entities[id] = rest as Record<string, unknown>
    if (children?.length) {
      relationships[id] = children.map((c) => c.id)
      for (const c of children) walk(c)
    }
  }
  for (const r of roots) walk(r)

  const meta: NormalizedData['meta'] = { root: roots.map((r) => r.id) }
  if (opts?.focusId !== undefined) meta.focus = opts.focusId
  if (opts?.expanded) meta.expanded = opts.expanded

  return { entities, relationships, meta }
}

/**
 * fromList — flat array to NormalizedData.
 * Each item must have `id`; remaining keys become user data.
 */
export function fromList(items: Array<{ id: string } & Record<string, unknown>>): NormalizedData {
  const entities: NormalizedData['entities'] = {}
  items.forEach(({ id, ...rest }) => {
    entities[id] = rest
  })
  return { entities, relationships: {}, meta: { root: items.map((i) => i.id) } }
}

export const pathAncestors = (path: string, sep: string = '/'): string[] => {
  const segs = path.split(sep).filter(Boolean)
  return segs.reduce<string[]>(
    (acc, seg) => [...acc, `${acc.at(-1) ?? ''}${sep}${seg}`],
    [],
  )
}
