import { fromKeyMap, type Axis, type KeyHandler } from './axis'
import { enabledSiblings } from './index'
import { INTENTS } from './keys'

const mod = (n: number, m: number) => ((n % m) + m) % m
const seekSibling = (offset: (i: number, len: number) => number): KeyHandler =>
  (d, id) => {
    const sibs = enabledSiblings(d, id)
    if (!sibs.length) return null
    const i = Math.max(0, sibs.indexOf(id))
    const t = offset(i, sibs.length)
    return [{ type: 'navigate', id: sibs[t] }]
  }

/**
 * navigate — siblings prev/next (단일 부모). visible-flat (collapse 반영) 은 treeNavigate.
 * orientation 별 prev/next/start/end 키는 `INTENTS.navigate` 에서 import (SSOT).
 *
 * KeyMap form — chord 매핑은 fromKeyMap, sibling index 산수는 KeyHandler 캡슐화.
 */
export const navigate =
  (orientation: 'vertical' | 'horizontal' = 'vertical'): Axis => {
    const o = INTENTS.navigate[orientation]
    return fromKeyMap([
      [o.prev, seekSibling((i, len) => mod(i - 1, len))],
      [o.next, seekSibling((i, len) => mod(i + 1, len))],
      [INTENTS.navigate.start, seekSibling(() => 0)],
      [INTENTS.navigate.end, seekSibling((_, len) => len - 1)],
    ])
  }
