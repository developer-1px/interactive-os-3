import { ROOT, type NormalizedData } from '../types'

export { composeAxes, type Axis } from './axis'

/**
 * parentOf — returns parent id, or ROOT sentinel if id is top-level.
 * Returns undefined only if id isn't found anywhere.
 */
export const parentOf = (d: NormalizedData, id: string): string | undefined => {
  if (d.meta?.root?.includes(id)) return ROOT
  return Object.entries(d.relationships).find(([, kids]) => kids.includes(id))?.[0]
}

export const siblingsOf = (d: NormalizedData, id: string): string[] => {
  const p = parentOf(d, id)
  if (!p) return []
  if (p === ROOT) return d.meta?.root ?? []
  return d.relationships[p] ?? []
}

export const enabledSiblings = (d: NormalizedData, id: string): string[] =>
  siblingsOf(d, id).filter((sid) => !d.entities[sid]?.disabled)

export { navigate } from './navigate'
export { expand, expandKeys } from './expand'
export { activate } from './activate'
export { typeahead } from './typeahead'
export { treeNavigate } from './treeNavigate'
export { treeExpand } from './treeExpand'
export { multiSelect } from './multiSelect'
export { select } from './select'
export { numericStep } from './numericStep'
export { gridNavigate } from './gridNavigate'
export { gridSelection } from './gridSelection'
export { escape } from './escape'
export { pageNavigate } from './pageNavigate'
export { KEYS, INTENTS, matchChord, matchKey, type KeyChord, type KeyName } from './keys'
