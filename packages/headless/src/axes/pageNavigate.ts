import type { Axis } from './axis'
import { enabledSiblings } from './index'
import { INTENTS, matchChord } from './keys'

/**
 * pageNavigate — PageUp/PageDown 키로 sibling 단위 N 칸 이동.
 *
 * 키는 `INTENTS.pageNavigate` (prev/next) 에서 import — SSOT.
 * step=1 이면 feed 식 "다음 article", step>1 이면 grid/list 식 page 점프.
 */
export const pageNavigate =
  (_orientation: 'vertical' | 'horizontal' = 'vertical', step = 1): Axis =>
  (d, id, t) => {
    if (t.kind !== 'key') return null
    const sibs = enabledSiblings(d, id)
    if (!sibs.length) return null
    const i = Math.max(0, sibs.indexOf(id))
    let target = -1
    if (matchChord(t, INTENTS.pageNavigate.next)) target = Math.min(sibs.length - 1, i + step)
    else if (matchChord(t, INTENTS.pageNavigate.prev)) target = Math.max(0, i - step)
    if (target < 0 || target === i) return null
    return [{ type: 'navigate', id: sibs[target] }]
  }
