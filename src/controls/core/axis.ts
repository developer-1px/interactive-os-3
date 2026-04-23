import type { KeySpec } from './key'
import type { Event, NormalizedData } from './types'

export type Axis = (d: NormalizedData, id: string, k: KeySpec) => Event[] | null

export const composeAxes = (...axes: Axis[]): Axis =>
  (d, id, k) => axes.reduce<Event[] | null>((acc, a) => acc ?? a(d, id, k), null)
