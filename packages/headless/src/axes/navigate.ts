import type { Axis } from './axis'
import { enabledSiblings } from './index'
import { INTENTS, matchChord } from './keys'

const mod = (n: number, m: number) => ((n % m) + m) % m

/**
 * navigate — siblings prev/next (단일 부모). visible-flat (collapse 반영) 은 treeNavigate.
 * orientation 별 prev/next/start/end 키는 `INTENTS.navigate` 에서 import (SSOT).
 */
export const navigate =
  (orientation: 'vertical' | 'horizontal' = 'vertical'): Axis =>
  (d, id, t) => {
    if (t.kind !== 'key') return null
    const o = INTENTS.navigate[orientation]
    const sibs = enabledSiblings(d, id)
    if (!sibs.length) return null
    const i = Math.max(0, sibs.indexOf(id))
    const targetIdx =
      matchChord(t, o.prev) ? mod(i - 1, sibs.length) :
      matchChord(t, o.next) ? mod(i + 1, sibs.length) :
      matchChord(t, INTENTS.navigate.start) ? 0 :
      matchChord(t, INTENTS.navigate.end) ? sibs.length - 1 :
      -1
    return targetIdx < 0 ? null : [{ type: 'navigate', id: sibs[targetIdx] }]
  }
