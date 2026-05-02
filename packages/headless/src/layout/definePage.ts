/**
 * definePage — identity wrapper over `NormalizedData` that also runs dev-time
 * structural validation (orphan/cycle/unknown node types). Warns only.
 *
 * Consumers build `{ entities, relationships }` directly — no builder DSL,
 * no new type. Re-using `NormalizedData` keeps the layout on the same rails
 * as ControlProps roles (`data` / `onEvent`).
 */
import type { NormalizedData } from '../types'
import { parseNormalizedData } from '../schema'
import { validatePage } from './validate'

export function definePage(page: NormalizedData): NormalizedData {
  parseNormalizedData(page)
  if (typeof window !== 'undefined' && import.meta && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
    validatePage(page)
  }
  return page
}
