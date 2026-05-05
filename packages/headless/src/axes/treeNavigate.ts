import { fromKeyMap, type Axis, type KeyHandler } from './axis'
import { INTENTS } from './keys'
import { visibleEnabled } from './_visibleFlat'

/**
 * treeNavigate — DFS visible 순회 (collapse 반영). 단일 부모 prev/next 는 navigate.
 *
 * KeyMap form — chord 매핑 선언, visible flat 좌표 산수는 KeyHandler 캡슐화.
 */
const seekVisible = (offset: (len: number, i: number) => number): KeyHandler =>
  (d, id) => {
    const v = visibleEnabled(d)
    const i = v.indexOf(id)
    if (i < 0) return null
    return [{ type: 'navigate', id: v[offset(v.length, i)] }]
  }

export const treeNavigate: Axis = fromKeyMap([
  [INTENTS.treeNavigate.next, seekVisible((len, i) => Math.min(len - 1, i + 1))],
  [INTENTS.treeNavigate.prev, seekVisible((_, i) => Math.max(0, i - 1))],
  [INTENTS.navigate.start, seekVisible(() => 0)],
  [INTENTS.navigate.end, seekVisible((len) => len - 1)],
])
