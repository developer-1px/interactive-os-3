import type { Axis } from '../core/axis'
import { getChildren, isDisabled } from '../core/types'

const TRIGGER = new Set(['Enter', ' '])

export const activate: Axis = (d, id, k) =>
  TRIGGER.has(k.key) && !isDisabled(d, id) && !getChildren(d, id).length
    ? [{ type: 'activate', id }]
    : null
