import type { NormalizedData } from '../types'

export { composeAxes, type Axis } from './axis'

export const parentOf = (d: NormalizedData, id: string): string | undefined =>
  Object.entries(d.relationships).find(([, kids]) => kids.includes(id))?.[0]

export const siblingsOf = (d: NormalizedData, id: string): string[] => {
  const p = parentOf(d, id)
  return p ? d.relationships[p] ?? [] : []
}

export const enabledSiblings = (d: NormalizedData, id: string): string[] =>
  siblingsOf(d, id).filter((sid) => !d.entities[sid]?.data?.disabled)

export { navigate } from './navigate'
export { expand } from './expand'
export { activate } from './activate'
export { typeahead } from './typeahead'
export { treeNavigate } from './treeNavigate'
export { treeExpand } from './treeExpand'
export { multiSelect } from './multiSelect'
export { numericStep } from './numericStep'
