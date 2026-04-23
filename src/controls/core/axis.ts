import type { KeySpec } from './key'
import type { Event, NormalizedData } from './types'

export type Axis = (d: NormalizedData, id: string, k: KeySpec) => Event[] | null

export const composeAxes = (...axes: Axis[]): Axis => (d, id, k) => {
  for (const a of axes) {
    const r = a(d, id, k)
    if (r) return r
  }
  return null
}
