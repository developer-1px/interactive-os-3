import type { KeyboardEvent } from 'react'
import type { NormalizedData } from '../core/types'

export type AxisHandler = (e: KeyboardEvent, id: string) => boolean

export function compose(...handlers: AxisHandler[]): AxisHandler {
  return (e, id) => handlers.some((h) => h(e, id))
}

export function parentOf(d: NormalizedData, id: string): string | undefined {
  for (const [p, kids] of Object.entries(d.relationships)) {
    if (kids.includes(id)) return p
  }
  return undefined
}

export function siblingsOf(d: NormalizedData, id: string): string[] {
  const p = parentOf(d, id)
  return p ? (d.relationships[p] ?? []) : []
}

export function enabledSiblings(d: NormalizedData, id: string): string[] {
  return siblingsOf(d, id).filter((sid) => !d.entities[sid]?.data?.disabled)
}

export { createNavigate } from './navigate'
export { createExpand } from './expand'
export { createActivate } from './activate'
export { useTypeahead } from './typeahead'
export { createTreeNavigate } from './treeNavigate'
export { createTreeExpand } from './treeExpand'
